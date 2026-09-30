import { describe, expect, it } from 'vitest';
import { calculateMerchantProjections, calculateUpiMdr } from './calculateMdr';

describe('UPI MDR 2026 Regulatory Calculation Engine Tests', () => {
  const futureDate = '2026-10-15';
  const currentDate = '2026-09-30';

  // -------------------------------------------------------------
  // PATH 1: PERSON TO PERSON (P2P) - Always ₹0 MDR across all amounts
  // -------------------------------------------------------------
  describe('Path 1: Person to Person (P2P)', () => {
    const boundaryAmounts = [500, 1999, 2000, 2001, 5000, 10000, 50000, 74999, 75000, 100000];

    boundaryAmounts.forEach((amt) => {
      it(`should return ₹0 MDR & full settlement for P2P ₹${amt}`, () => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2P',
          evaluationDate: futureDate,
        });
        expect(res.customerCharge).toBe(0);
        expect(res.customerTotalPays).toBe(amt);
        expect(res.estimatedMdr).toBe(0);
        expect(res.estimatedMerchantSettlement).toBe(amt);
        expect(res.isMdrApplicable).toBe(false);
      });
    });
  });

  // -------------------------------------------------------------
  // PATH 2: NORMAL P2M MERCHANT (Effective 15 October 2026)
  // <= ₹2,000: 0% MDR
  // > ₹2,000: 0.40% on entire amount, capped at ₹300 for ₹75,000+
  // -------------------------------------------------------------
  describe('Path 2: Normal P2M Merchant (0.40%, Cap ₹300)', () => {
    it('₹500 -> 0% MDR (≤ ₹2,000 is 100% Free)', () => {
      const res = calculateUpiMdr({
        amount: 500,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(500);
      expect(res.estimatedMdr).toBe(0);
      expect(res.isMdrApplicable).toBe(false);
    });

    it('₹1,999 -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 1999,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.isMdrApplicable).toBe(false);
    });

    it('₹2,000 exact boundary -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 2000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.isMdrApplicable).toBe(false);
    });

    it('₹2,001 -> 0.40% MDR is ~₹8.00 (2001 * 0.004 = 8.004)', () => {
      const res = calculateUpiMdr({
        amount: 2001,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(2001);
      expect(res.applicableMdrRatePercent).toBe(0.4);
      expect(res.estimatedMdr).toBe(8.0);
      expect(res.estimatedMerchantSettlement).toBe(1993.0);
      expect(res.mdrCapApplied).toBe(false);
    });

    it('₹3,000 -> 0.40% MDR = ₹12.00', () => {
      const res = calculateUpiMdr({
        amount: 3000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(12.0);
      expect(res.estimatedMerchantSettlement).toBe(2988.0);
    });

    it('₹5,000 -> 0.40% MDR = ₹20.00', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(20.0);
      expect(res.estimatedMerchantSettlement).toBe(4980.0);
    });

    it('₹10,000 -> 0.40% MDR = ₹40.00', () => {
      const res = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(10000);
      expect(res.estimatedMdr).toBe(40.0);
      expect(res.estimatedMerchantSettlement).toBe(9960.0);
    });

    it('₹50,000 -> 0.40% MDR = ₹200.00', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(20.0);
    });

    it('₹74,999 boundary -> 0.40% MDR = ₹300.00 (74999 * 0.004 = 299.996)', () => {
      const res = calculateUpiMdr({
        amount: 74999,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(300.0);
    });

    it('₹75,000 exact cap threshold -> 0.40% MDR = ₹300.00 (hits ₹300 cap)', () => {
      const res = calculateUpiMdr({
        amount: 75000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(300.0);
      expect(res.estimatedMerchantSettlement).toBe(74700.0);
    });

    it('₹1,00,000 -> capped at ₹300.00 (not ₹400)', () => {
      const res = calculateUpiMdr({
        amount: 100000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.rawMdrAmount).toBe(400.0);
      expect(res.estimatedMdr).toBe(300.0);
      expect(res.mdrCapApplied).toBe(true);
      expect(res.mdrCapAmount).toBe(300);
      expect(res.estimatedMerchantSettlement).toBe(99700.0);
      expect(res.customerCharge).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // PATH 3: ESSENTIAL / THIN-MARGIN SECTORS (Effective 15 October 2026)
  // <= ₹2,000: 0% MDR
  // > ₹2,000: Flat ₹5 MDR (NOT a percentage)
  // -------------------------------------------------------------
  describe('Path 3: Essential & Thin-Margin Sectors (Flat ₹5 fee)', () => {
    it('₹1,999 -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 1999,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.isMdrApplicable).toBe(false);
    });

    it('₹2,000 -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 2000,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.isMdrApplicable).toBe(false);
    });

    it('₹2,001 -> Flat ₹5 MDR', () => {
      const res = calculateUpiMdr({
        amount: 2001,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.isFlatFee).toBe(true);
      expect(res.estimatedMdr).toBe(5);
      expect(res.estimatedMerchantSettlement).toBe(1996);
      expect(res.customerCharge).toBe(0);
    });

    it('₹10,000 fuel payment -> Flat ₹5 MDR (NOT ₹40)', () => {
      const res = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.isFlatFee).toBe(true);
      expect(res.estimatedMdr).toBe(5);
      expect(res.estimatedMerchantSettlement).toBe(9995);
      expect(res.customerCharge).toBe(0);
    });

    it('₹75,000 essential payment -> Flat ₹5 MDR', () => {
      const res = calculateUpiMdr({
        amount: 75000,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(5);
    });

    it('₹1,00,000 essential payment -> Flat ₹5 MDR', () => {
      const res = calculateUpiMdr({
        amount: 100000,
        transactionType: 'P2M',
        merchantCategory: 'essential_services',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(5);
      expect(res.estimatedMerchantSettlement).toBe(99995);
    });
  });

  // -------------------------------------------------------------
  // PATH 4: CAPITAL MARKETS (Effective 15 October 2026)
  // <= ₹2,000: 0% MDR
  // > ₹2,000: 0.02% MDR, capped at ₹300
  // -------------------------------------------------------------
  describe('Path 4: Capital Markets (0.02%, Cap ₹300)', () => {
    it('₹2,000 -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 2000,
        transactionType: 'P2M',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
    });

    it('₹2,001 -> 0.02% MDR = ₹0.40', () => {
      const res = calculateUpiMdr({
        amount: 2001,
        transactionType: 'P2M',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(res.applicableMdrRatePercent).toBe(0.02);
      expect(res.estimatedMdr).toBe(0.4);
      expect(res.estimatedMerchantSettlement).toBe(2000.6);
    });

    it('₹10,000 mutual fund -> 0.02% MDR = ₹2.00 (NOT ₹40)', () => {
      const res = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(res.applicableMdrRatePercent).toBe(0.02);
      expect(res.estimatedMdr).toBe(2.0);
      expect(res.estimatedMerchantSettlement).toBe(9998.0);
      expect(res.customerCharge).toBe(0);
    });

    it('₹1,00,000 stock trade -> 0.02% MDR = ₹20.00', () => {
      const res = calculateUpiMdr({
        amount: 100000,
        transactionType: 'P2M',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(20.0);
      expect(res.estimatedMerchantSettlement).toBe(99980.0);
    });

    it('₹20,00,000 large transfer -> 0.02% = ₹400, capped at ₹300', () => {
      const res = calculateUpiMdr({
        amount: 2000000,
        transactionType: 'P2M',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(res.rawMdrAmount).toBe(400.0);
      expect(res.estimatedMdr).toBe(300.0);
      expect(res.mdrCapApplied).toBe(true);
      expect(res.mdrCapAmount).toBe(300);
    });
  });

  // -------------------------------------------------------------
  // PATH 5: SMALL MERCHANTS / P2PM QR (Effective 15 October 2026)
  // Zero MDR for qualifying merchants up to ₹1 Lakh/month
  // -------------------------------------------------------------
  describe('Path 5: Small Merchants / P2PM QR (0% MDR up to ₹1L/month)', () => {
    const testAmounts = [1999, 2000, 2001, 5000, 10000, 74999, 75000, 100000];

    testAmounts.forEach((amt) => {
      it(`₹${amt} on Small Merchant P2PM -> ₹0 MDR`, () => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2M',
          merchantCategory: 'small_merchant',
          evaluationDate: futureDate,
        });
        expect(res.customerCharge).toBe(0);
        expect(res.customerTotalPays).toBe(amt);
        expect(res.estimatedMdr).toBe(0);
        expect(res.estimatedMerchantSettlement).toBe(amt);
        expect(res.isMdrApplicable).toBe(false);
      });
    });
  });

  // -------------------------------------------------------------
  // CURRENT RULES (Until 14 October 2026)
  // Section 10A PSS Act zero-MDR directive
  // -------------------------------------------------------------
  describe('Current Rules (Until 14 October 2026)', () => {
    it('₹10,000 on regular merchant before 15 Oct has 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        merchantCategory: 'regular_merchant',
        evaluationDate: currentDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.customerCharge).toBe(0);
      expect(res.isFutureFrameworkActive).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // PREPAID WALLET / PPI ON UPI (NPCI Circular)
  // -------------------------------------------------------------
  describe('Prepaid Wallet / PPI on UPI (NPCI Circular)', () => {
    it('₹2,000 on PPI Wallet -> 0% MDR', () => {
      const res = calculateUpiMdr({
        amount: 2000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.customerCharge).toBe(0);
    });

    it('₹5,000 on PPI Wallet for Small Merchant -> 0% MDR exempt', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'small_merchant',
        evaluationDate: futureDate,
      });
      expect(res.estimatedMdr).toBe(0);
      expect(res.customerCharge).toBe(0);
    });

    it('₹2,001 on PPI Wallet for Normal Merchant -> 1.10% interchange', () => {
      const res = calculateUpiMdr({
        amount: 2001,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(res.applicableMdrRatePercent).toBe(1.1);
      expect(res.estimatedMdr).toBe(22.01);
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(2001);
    });
  });

  // -------------------------------------------------------------
  // MERCHANT PROJECTIONS
  // -------------------------------------------------------------
  describe('Merchant Mode Projection Calculations', () => {
    it('projects monthly settlement for normal merchant under new rules', () => {
      const proj = calculateMerchantProjections({
        averageAmount: 3000,
        dailyTransactions: 10,
        businessDaysPerMonth: 30,
        merchantCategory: 'regular_merchant',
        evaluationDate: futureDate,
      });
      expect(proj.monthlyTransactions).toBe(300);
      expect(proj.monthlySalesVolume).toBe(900000);
      // ₹3,000 * 0.004 = ₹12 MDR per transaction
      expect(proj.estimatedMdrPerTransaction).toBe(12);
      expect(proj.estimatedMonthlyMdr).toBe(3600);
      expect(proj.estimatedAnnualMdr).toBe(43200);
      expect(proj.estimatedNetMonthlySettlement).toBe(896400);
    });

    it('projects ₹0 MDR for small merchants under P2PM framework', () => {
      const proj = calculateMerchantProjections({
        averageAmount: 1500,
        dailyTransactions: 20,
        businessDaysPerMonth: 25,
        merchantCategory: 'small_merchant',
        evaluationDate: futureDate,
      });
      expect(proj.estimatedMonthlyMdr).toBe(0);
      expect(proj.isMdrApplicable).toBe(false);
      expect(proj.estimatedNetMonthlySettlement).toBe(750000);
    });
  });
});
