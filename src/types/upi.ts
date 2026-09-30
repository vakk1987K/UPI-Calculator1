/**
 * Official UPI MDR Type Definitions
 * Strictly aligned with RBI, NPCI Circulars & Ministry of Finance (DFS).
 * Sourced: September 30, 2026.
 */

export type TransactionType = 'P2P' | 'P2M';

export type SupportedLanguage = 'en' | 'te';

export type PaymentInstrument =
  | 'bank_account' // Standard Bank-to-Bank Account UPI
  | 'rupay_credit_card' // RuPay Credit Card linked on UPI (NPCI Circular)
  | 'ppi_wallet'; // Prepaid Payment Instruments (Paytm Wallet, PhonePe Wallet, PPI on UPI)

export type MerchantCategoryKey =
  | 'regular_merchant' // Normal P2M Merchant / Retail Shop (0.40%, Cap ₹300)
  | 'small_merchant' // Small Merchant / P2PM QR (≤ ₹1 Lakh/month: 0% Free)
  | 'essential_services' // Essential & Thin-Margin (Railways, Telecom, Insurance, Fuel, Agri: Flat ₹5)
  | 'capital_markets'; // Capital Markets (Mutual Funds, Securities, Stockbrokers: 0.02%, Cap ₹300)

export interface MerchantCategoryConfig {
  key: MerchantCategoryKey;
  labelEn: string;
  labelTe: string;
  descriptionEn: string;
  descriptionTe: string;
  typicalExamplesEn: string;
  typicalExamplesTe: string;
}

export interface PaymentInstrumentConfig {
  key: PaymentInstrument;
  labelEn: string;
  labelTe: string;
  shortDescEn: string;
  shortDescTe: string;
  regulatoryNoteEn: string;
}

export interface UpiRegulatoryRule {
  id: string;
  titleEn: string;
  titleTe: string;
  effectiveFrom: string; // ISO date 'YYYY-MM-DD'
  effectiveUntil: string | null; // ISO date or null if ongoing
  transactionType: TransactionType;
  paymentInstrument?: PaymentInstrument;
  merchantCategory?: MerchantCategoryKey;
  threshold: number; // e.g. 2000 INR
  rateBelowOrEqualThreshold: number; // Decimal (0.0 = 0%)
  rateAboveThreshold: number; // Decimal (e.g. 0.004 = 0.40%, 0.0002 = 0.02%, 0.02 = 2.0%)
  isFlatFee?: boolean; // True if statutory flat fee (e.g. ₹5 for essential sectors)
  flatFeeAmount?: number; // Flat fee in INR (e.g. 5)
  maximumMdrCap: number | null; // Cap in INR (e.g. 300 or null)
  customerCharge: number; // ALWAYS 0 for UPI in India
  isExempt: boolean;
  source: string;
  sourceDate: string;
  ruleSummaryEn: string;
  ruleSummaryTe: string;
  reasonEn: string;
  reasonTe: string;
}

export interface CalculationInput {
  amount: number | string;
  transactionType: TransactionType;
  paymentInstrument?: PaymentInstrument;
  merchantCategory?: MerchantCategoryKey;
  evaluationDate?: string; // e.g. '2026-10-15' or '2026-09-30'
}

export interface CalculationResult {
  amount: number;
  formattedAmount: string;
  transactionType: TransactionType;
  paymentInstrument: PaymentInstrument;
  paymentInstrumentLabelEn: string;
  merchantCategory?: MerchantCategoryKey;
  merchantCategoryLabelEn?: string;
  merchantCategoryLabelTe?: string;
  customerCharge: number; // ALWAYS 0
  customerTotalPays: number;
  applicableMdrRatePercent: number;
  rawMdrAmount: number;
  estimatedMdr: number;
  formulaText: string;
  isFlatFee: boolean;
  flatFeeAmount: number;
  mdrCapApplied: boolean;
  mdrCapAmount: number | null;
  estimatedMerchantSettlement: number;
  isMdrApplicable: boolean;
  whoBearsFeeEn: string;
  whoBearsFeeTe: string;
  appliedRuleId: string;
  ruleEffectiveFrom: string;
  ruleEffectiveUntil: string | null;
  isFutureFrameworkActive: boolean;
  explanationEn: string;
  explanationTe: string;
  sourceNotice: string;
  validationWarning?: string;
}

export interface MerchantProjectionInput {
  averageAmount: number | string;
  dailyTransactions: number | string;
  businessDaysPerMonth: number | string;
  merchantCategory: MerchantCategoryKey;
  paymentInstrument?: PaymentInstrument;
  evaluationDate?: string;
}

export interface MerchantProjectionResult {
  monthlyTransactions: number;
  monthlySalesVolume: number;
  transactionsSubjectToMdr: number;
  applicableMdrRatePercent: number;
  estimatedMdrPerTransaction: number;
  estimatedMonthlyMdr: number;
  estimatedAnnualMdr: number;
  estimatedNetMonthlySettlement: number;
  isMdrApplicable: boolean;
}
