import { describe, it, expect } from 'vitest';
import { calculateUpiMdr, formatCurrencyINR } from './calculateMdr';

describe('UPI MDR Official Calculation Tests (2026 Framework)', () => {
  const futureDate = '2026-10-15';
  const currentDate = '2026-09-30';

  // -------------------------------------------------------------
  // PATH 1: PERSON TO PERSON (P2P)
  // -------------------------------------------------------------
  describe('Path 1: P2P Transfers (Person to Person)', () => {
    it('returns ₹0 MDR for any P2P amount under both current and future dates', () => {
      const amounts = [100, 1999, 2000, 2001, 10000, 75000, 100000, 500000];
      amounts.forEach((amt) => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2P',
          evaluationDate: futureDate,
        });
        expect(res.estimatedMdr).toBe(0);
        expect(res.customerCharge).toBe(0);
        expect(res.customerTotalPays).toBe(amt);
        expect(res.isMdrApplicable).toBe(false);
        expect(res.formulaText).toContain('0%');
      });
    });
  });

  // -------------------------------------------------------------
  // PATH 2: NORMAL P2M MERCHANT (0.40%, CAP ₹300)
  // -------------------------------------------------------------
  describe('Path 2: Normal P2M Merchant (Future Framework from 15 Oct 2026)', () => {
    it('returns ₹0 MDR for amounts <= ₹2,000', () => {
      expect(calculateUpiMdr({ amount: 100, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate }).estimatedMdr).toBe(0);
      expect(calculateUpiMdr({ amount: 1999, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate }).estimatedMdr).toBe(0);
      expect(calculateUpiMdr({ amount: 2000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate }).estimatedMdr).toBe(0);
    });

    it('returns 0.40% MDR for amounts > ₹2,000', () => {
      // 2001 * 0.004 = 8.004 -> 8
      const res2001 = calculateUpiMdr({ amount: 2001, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res2001.estimatedMdr).toBe(8);
      expect(res2001.customerCharge).toBe(0);
      expect(res2001.formulaText).toContain('0.4%');

      // 5000 * 0.004 = 20
      const res5000 = calculateUpiMdr({ amount: 5000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res5000.estimatedMdr).toBe(20);
      expect(res5000.customerCharge).toBe(0);

      // 10000 * 0.004 = 40
      const res10000 = calculateUpiMdr({ amount: 10000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res10000.estimatedMdr).toBe(40);
      expect(res10000.estimatedMerchantSettlement).toBe(9960);

      // 50000 * 0.004 = 200
      const res50000 = calculateUpiMdr({ amount: 50000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res50000.estimatedMdr).toBe(200);
    });

    it('enforces maximum MDR cap of ₹300 at ₹75,000 and above', () => {
      // 74999 * 0.004 = 299.996 -> rounds to 300
      const res74999 = calculateUpiMdr({ amount: 74999, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res74999.estimatedMdr).toBe(300);

      // 75000 * 0.004 = 300
      const res75000 = calculateUpiMdr({ amount: 75000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res75000.estimatedMdr).toBe(300);

      // 100000 * 0.004 = 400 -> must cap at 300
      const res100000 = calculateUpiMdr({ amount: 100000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res100000.estimatedMdr).toBe(300);
      expect(res100000.mdrCapApplied).toBe(true);
      expect(res100000.estimatedMerchantSettlement).toBe(99700);
      expect(res100000.formulaText).toContain('Cap Applied');
    });
  });

  // -------------------------------------------------------------
  // PATH 3: ESSENTIAL SERVICES & FUEL (FLAT ₹5)
  // -------------------------------------------------------------
  describe('Path 3: Essential & Thin-Margin Sectors (Fuel, Railways, Telecom)', () => {
    it('returns ₹0 MDR for essential sectors <= ₹2,000', () => {
      const res = calculateUpiMdr({ amount: 1500, transactionType: 'P2M', merchantCategory: 'essential_services', evaluationDate: futureDate });
      expect(res.estimatedMdr).toBe(0);
    });

    it('returns flat ₹5 MDR for transactions > ₹2,000', () => {
      const res2001 = calculateUpiMdr({ amount: 2001, transactionType: 'P2M', merchantCategory: 'essential_services', evaluationDate: futureDate });
      expect(res2001.estimatedMdr).toBe(5);
      expect(res2001.isFlatFee).toBe(true);

      const res10000 = calculateUpiMdr({ amount: 10000, transactionType: 'P2M', merchantCategory: 'essential_services', evaluationDate: futureDate });
      expect(res10000.estimatedMdr).toBe(5);
      expect(res10000.estimatedMerchantSettlement).toBe(9995);
      expect(res10000.formulaText).toContain('Flat ₹5.00');

      const res100000 = calculateUpiMdr({ amount: 100000, transactionType: 'P2M', merchantCategory: 'essential_services', evaluationDate: futureDate });
      expect(res100000.estimatedMdr).toBe(5);
    });
  });

  // -------------------------------------------------------------
  // PATH 4: CAPITAL MARKETS (0.02%, CAP ₹300)
  // -------------------------------------------------------------
  describe('Path 4: Capital Markets (Mutual Funds, Stocks)', () => {
    it('returns ₹0 MDR for capital markets <= ₹2,000', () => {
      const res = calculateUpiMdr({ amount: 2000, transactionType: 'P2M', merchantCategory: 'capital_markets', evaluationDate: futureDate });
      expect(res.estimatedMdr).toBe(0);
    });

    it('returns 0.02% MDR for transactions > ₹2,000', () => {
      // 10000 * 0.0002 = 2
      const res10000 = calculateUpiMdr({ amount: 10000, transactionType: 'P2M', merchantCategory: 'capital_markets', evaluationDate: futureDate });
      expect(res10000.estimatedMdr).toBe(2);
      expect(res10000.customerCharge).toBe(0);

      // 100000 * 0.0002 = 20
      const res100000 = calculateUpiMdr({ amount: 100000, transactionType: 'P2M', merchantCategory: 'capital_markets', evaluationDate: futureDate });
      expect(res100000.estimatedMdr).toBe(20);

      // 2000000 * 0.0002 = 400 -> Capped at 300
      const res20L = calculateUpiMdr({ amount: 2000000, transactionType: 'P2M', merchantCategory: 'capital_markets', evaluationDate: futureDate });
      expect(res20L.estimatedMdr).toBe(300);
      expect(res20L.mdrCapApplied).toBe(true);
    });

    it('returns 0.02% capped at ₹300 when paying via Prepaid Wallet on Capital Markets', () => {
      // 10000 * 0.0002 = 2
      const resWallet10k = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(resWallet10k.estimatedMdr).toBe(2);
      expect(resWallet10k.applicableMdrRatePercent).toBe(0.02);
      expect(resWallet10k.formulaText).toContain('0.02%');
      expect(resWallet10k.formulaText).toContain('Capital Markets');
      expect(resWallet10k.customerCharge).toBe(0);
      expect(resWallet10k.estimatedMerchantSettlement).toBe(9998);

      // 2000000 * 0.0002 = 400 -> Capped at 300
      const resWallet20L = calculateUpiMdr({
        amount: 2000000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(resWallet20L.estimatedMdr).toBe(300);
      expect(resWallet20L.mdrCapApplied).toBe(true);
      expect(resWallet20L.formulaText).toContain('Cap Applied: ₹300');
    });

    it('returns 0.02% capped at ₹300 when paying via RuPay Credit Card on Capital Markets', () => {
      const resCC10k = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        paymentInstrument: 'rupay_credit_card',
        merchantCategory: 'capital_markets',
        evaluationDate: futureDate,
      });
      expect(resCC10k.estimatedMdr).toBe(2);
      expect(resCC10k.applicableMdrRatePercent).toBe(0.02);
    });
  });

  // -------------------------------------------------------------
  // PATH 5: SMALL MERCHANTS / P2PM QR (0% FREE)
  // -------------------------------------------------------------
  describe('Path 5: Small Merchants under P2PM QR (<= ₹1 Lakh/month)', () => {
    it('returns ₹0 MDR across all transaction amounts', () => {
      const amounts = [500, 2000, 5000, 10000, 75000, 100000];
      amounts.forEach((amt) => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2M',
          merchantCategory: 'small_merchant',
          evaluationDate: futureDate,
        });
        expect(res.estimatedMdr).toBe(0);
        expect(res.customerCharge).toBe(0);
        expect(res.estimatedMerchantSettlement).toBe(amt);
      });
    });
  });

  // -------------------------------------------------------------
  // RUPAY CREDIT CARD ON UPI (NPCI CIRCULAR)
  // -------------------------------------------------------------
  describe('RuPay Credit Card on UPI (NPCI Circular)', () => {
    it('returns Nil MDR (0%) for transactions <= ₹2,000 on normal merchants', () => {
      const res1999 = calculateUpiMdr({ amount: 1999, transactionType: 'P2M', paymentInstrument: 'rupay_credit_card', evaluationDate: futureDate });
      expect(res1999.estimatedMdr).toBe(0);

      const res2000 = calculateUpiMdr({ amount: 2000, transactionType: 'P2M', paymentInstrument: 'rupay_credit_card', evaluationDate: futureDate });
      expect(res2000.estimatedMdr).toBe(0);
    });

    it('returns standard 2.0% MDR for transactions > ₹2,000 on normal merchants', () => {
      // 5000 * 0.02 = 100
      const res5000 = calculateUpiMdr({ amount: 5000, transactionType: 'P2M', paymentInstrument: 'rupay_credit_card', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res5000.estimatedMdr).toBe(100);
      expect(res5000.customerCharge).toBe(0);
      expect(res5000.estimatedMerchantSettlement).toBe(4900);
    });

    it('returns Nil MDR (0%) for small merchants at any amount', () => {
      const res = calculateUpiMdr({ amount: 5000, transactionType: 'P2M', paymentInstrument: 'rupay_credit_card', merchantCategory: 'small_merchant', evaluationDate: futureDate });
      expect(res.estimatedMdr).toBe(0);
    });
  });

  // -------------------------------------------------------------
  // EDGE CASE VALIDATION & ROBUSTNESS TESTS (USER REQUIREMENT #5)
  // -------------------------------------------------------------
  describe('Input Robustness & Edge Cases', () => {
    it('handles ₹0 amount cleanly with no NaN or crash', () => {
      const res = calculateUpiMdr({ amount: 0, transactionType: 'P2M', evaluationDate: futureDate });
      expect(res.amount).toBe(0);
      expect(res.estimatedMdr).toBe(0);
      expect(res.customerCharge).toBe(0);
      expect(res.formulaText).toContain('0.00');
      expect(res.formulaText).not.toContain('NaN');
    });

    it('clamps negative amounts to ₹0 and sets validation warning', () => {
      const res = calculateUpiMdr({ amount: -50, transactionType: 'P2M', evaluationDate: futureDate });
      expect(res.amount).toBe(0);
      expect(res.estimatedMdr).toBe(0);
      expect(res.validationWarning).toBeDefined();
    });

    it('handles blank string or invalid letters safely', () => {
      const resBlank = calculateUpiMdr({ amount: '' as any, transactionType: 'P2M', evaluationDate: futureDate });
      expect(resBlank.amount).toBe(0);
      expect(resBlank.estimatedMdr).toBe(0);

      const resAbc = calculateUpiMdr({ amount: 'invalid-text' as any, transactionType: 'P2M', evaluationDate: futureDate });
      expect(resAbc.amount).toBe(0);
      expect(resAbc.estimatedMdr).toBe(0);
    });

    it('handles ₹0.01 fractional micro-amount correctly', () => {
      const res = calculateUpiMdr({ amount: 0.01, transactionType: 'P2M', evaluationDate: futureDate });
      expect(res.amount).toBe(0.01);
      expect(res.estimatedMdr).toBe(0);
      expect(res.formulaText).toContain('0.01');
    });

    it('handles very large values (₹10 Lakh & ₹1 Crore) without overflow or NaN', () => {
      const res10L = calculateUpiMdr({ amount: 1000000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res10L.estimatedMdr).toBe(300); // Capped at ₹300
      expect(res10L.estimatedMerchantSettlement).toBe(999700);

      const res1Cr = calculateUpiMdr({ amount: 10000000, transactionType: 'P2M', merchantCategory: 'regular_merchant', evaluationDate: futureDate });
      expect(res1Cr.estimatedMdr).toBe(300);
      expect(res1Cr.estimatedMerchantSettlement).toBe(9999700);
    });
  });

  // -------------------------------------------------------------
  // CURRENT ZERO-MDR RULES (UNTIL 14 OCT 2026)
  // -------------------------------------------------------------
  describe('Current Rules (Until 14 October 2026)', () => {
    it('returns ₹0 MDR for all standard bank UPI amounts', () => {
      const res = calculateUpiMdr({ amount: 10000, transactionType: 'P2M', paymentInstrument: 'bank_account', evaluationDate: currentDate });
      expect(res.estimatedMdr).toBe(0);
      expect(res.customerCharge).toBe(0);
    });
  });
});
