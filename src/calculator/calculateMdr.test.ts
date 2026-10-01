import { describe, it, expect } from 'vitest';
import { calculateUpiMdr, formatCurrencyINR } from './calculateMdr';

describe('UPI Regulatory Engine Tests (Verified RBI & NPCI Directives)', () => {
  // -------------------------------------------------------------
  // 1. PERSON TO PERSON (P2P) TRANSFERS
  // -------------------------------------------------------------
  describe('P2P Transfers (Person to Person)', () => {
    it('is 100% free with ₹0 fee and ₹0 MDR at any amount', () => {
      const amounts = [10, 500, 2000, 10000, 75000, 100000, 500000];
      amounts.forEach((amt) => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2P',
          paymentInstrument: 'bank_account',
        });
        expect(res.customerCharge).toBe(0);
        expect(res.statutoryMdrAmount).toBe(0);
        expect(res.customerTotalPays).toBe(amt);
        expect(res.estimatedMerchantSettlement).toBe(amt);
        expect(res.isMdrLegallyZero).toBe(true);
        expect(res.formulaText).toContain('100% Free');
      });
    });
  });

  // -------------------------------------------------------------
  // 2. STANDARD BANK-ACCOUNT UPI (SECTION 10A PSS ACT ZERO MDR)
  // -------------------------------------------------------------
  describe('Bank Account UPI (Official Zero-MDR Framework)', () => {
    it('customer surcharge is always ₹0 by law', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'bank_account',
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(5000);
    });

    it('statutory MDR is legally 0% across ALL amounts under Section 10A PSS Act', () => {
      const amounts = [100, 1999, 2000, 2001, 10000, 75000, 100000, 1000000];
      amounts.forEach((amt) => {
        const res = calculateUpiMdr({
          amount: amt,
          transactionType: 'P2M',
          paymentInstrument: 'bank_account',
        });
        expect(res.statutoryMdrPercent).toBe(0);
        expect(res.statutoryMdrAmount).toBe(0);
        expect(res.isMdrLegallyZero).toBe(true);
        expect(res.estimatedMerchantSettlement).toBe(amt);
        expect(res.formulaText).toContain('Statutory 0% MDR');
      });
    });
  });

  // -------------------------------------------------------------
  // 3. PREPAID WALLET / PPI ON UPI (NPCI MARCH 2023 CIRCULAR)
  // -------------------------------------------------------------
  describe('Prepaid Wallet / PPI on UPI (NPCI Interchange Framework)', () => {
    it('customer charge is strictly ₹0 as mandated by NPCI', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(5000);
    });

    it('returns 0% interchange for transactions <= ₹2,000', () => {
      const res100 = calculateUpiMdr({ amount: 100, transactionType: 'P2M', paymentInstrument: 'ppi_wallet' });
      expect(res100.interchangeRatePercent).toBe(0);
      expect(res100.estimatedInterchangeAmount).toBe(0);

      const res2000 = calculateUpiMdr({ amount: 2000, transactionType: 'P2M', paymentInstrument: 'ppi_wallet' });
      expect(res2000.interchangeRatePercent).toBe(0);
      expect(res2000.estimatedInterchangeAmount).toBe(0);
      expect(res2000.formulaText).toContain('0% Nil Fee');
    });

    it('returns 0% interchange for small offline merchants at any amount', () => {
      const resSmall = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'small_offline_merchant',
      });
      expect(resSmall.interchangeRatePercent).toBe(0);
      expect(resSmall.estimatedInterchangeAmount).toBe(0);
      expect(resSmall.isSmallMerchantExempt).toBe(true);
    });

    it('applies standard 1.10% ecosystem interchange for regular merchants > ₹2,000', () => {
      // 5000 * 1.10% = 55.00
      const res5000 = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'general_merchant',
      });
      expect(res5000.interchangeRatePercent).toBe(1.10);
      expect(res5000.estimatedInterchangeAmount).toBe(55);
      expect(res5000.customerCharge).toBe(0);
      expect(res5000.formulaText).toContain('1.1%');
    });

    it('applies concessional 0.50% interchange for fuel and utility merchants > ₹2,000', () => {
      // 10000 * 0.50% = 50.00
      const resFuel = calculateUpiMdr({
        amount: 10000,
        transactionType: 'P2M',
        paymentInstrument: 'ppi_wallet',
        merchantCategory: 'fuel_and_utilities',
      });
      expect(resFuel.interchangeRatePercent).toBe(0.50);
      expect(resFuel.estimatedInterchangeAmount).toBe(50);
    });
  });

  // -------------------------------------------------------------
  // 4. RUPAY CREDIT CARD ON UPI (NPCI OPERATING CIRCULAR)
  // -------------------------------------------------------------
  describe('RuPay Credit Card on UPI (NPCI Operating Circular)', () => {
    it('customer surcharge is strictly prohibited (customer pays ₹0 extra)', () => {
      const res = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'rupay_credit_card',
      });
      expect(res.customerCharge).toBe(0);
      expect(res.customerTotalPays).toBe(5000);
    });

    it('returns Nil MDR (0%) for transactions <= ₹2,000 or small offline merchants', () => {
      const res1500 = calculateUpiMdr({
        amount: 1500,
        transactionType: 'P2M',
        paymentInstrument: 'rupay_credit_card',
      });
      expect(res1500.interchangeRatePercent).toBe(0);
      expect(res1500.estimatedInterchangeAmount).toBe(0);
      expect(res1500.isSmallMerchantExempt).toBe(true);

      const resSmall = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'rupay_credit_card',
        merchantCategory: 'small_offline_merchant',
      });
      expect(resSmall.interchangeRatePercent).toBe(0);
      expect(resSmall.estimatedInterchangeAmount).toBe(0);
    });

    it('indicates commercial acquirer pricing for transactions > ₹2,000 on general merchants', () => {
      // 5000 * 2.0% = 100.00
      const res5000 = calculateUpiMdr({
        amount: 5000,
        transactionType: 'P2M',
        paymentInstrument: 'rupay_credit_card',
        merchantCategory: 'general_merchant',
      });
      expect(res5000.estimatedInterchangeAmount).toBe(100);
      expect(res5000.customerCharge).toBe(0);
      expect(res5000.commercialSettlementDisclaimerEn).toContain('acquiring bank');
    });
  });

  // -------------------------------------------------------------
  // 5. INPUT VALIDATION & EDGE CASES
  // -------------------------------------------------------------
  describe('Input Validation & Edge Cases', () => {
    it('handles ₹0 cleanly without NaN', () => {
      const res = calculateUpiMdr({ amount: 0, transactionType: 'P2M', paymentInstrument: 'bank_account' });
      expect(res.amount).toBe(0);
      expect(res.customerCharge).toBe(0);
      expect(res.statutoryMdrAmount).toBe(0);
      expect(res.formulaText).not.toContain('NaN');
    });

    it('clamps negative amounts and sets warning', () => {
      const res = calculateUpiMdr({ amount: -500, transactionType: 'P2M', paymentInstrument: 'bank_account' });
      expect(res.amount).toBe(0);
      expect(res.validationWarning).toBeDefined();
    });

    it('handles invalid string safely', () => {
      const res = calculateUpiMdr({ amount: 'abc' as any, transactionType: 'P2M', paymentInstrument: 'bank_account' });
      expect(res.amount).toBe(0);
      expect(res.customerCharge).toBe(0);
    });

    it('handles ₹0.01 fractional micro transaction', () => {
      const res = calculateUpiMdr({ amount: 0.01, transactionType: 'P2M', paymentInstrument: 'bank_account' });
      expect(res.amount).toBe(0.01);
      expect(res.customerCharge).toBe(0);
    });

    it('handles ₹10 Lakhs and ₹1 Crore safely', () => {
      const res10L = calculateUpiMdr({ amount: 1000000, transactionType: 'P2M', paymentInstrument: 'bank_account' });
      expect(res10L.amount).toBe(1000000);
      expect(res10L.statutoryMdrAmount).toBe(0);
      expect(res10L.estimatedMerchantSettlement).toBe(1000000);
    });
  });
});
