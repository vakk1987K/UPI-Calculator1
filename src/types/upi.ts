/**
 * Official UPI Framework Type Definitions
 * Strictly aligned with:
 * 1. RBI Notification on Zero MDR (Section 10A Payment and Settlement Systems Act)
 * 2. NPCI UPI Circulars & FAQs on PPI-on-UPI Interchange
 * 3. NPCI RuPay Credit Card on UPI Operating Circulars
 * Sourced: Current 2026 Regulatory Status.
 */

export type TransactionType = 'P2P' | 'P2M';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'mr' | 'gu' | 'ta' | 'bn' | 'or' | 'kn';

export type PaymentInstrument =
  | 'bank_account' // Standard Bank-to-Bank Account UPI (Zero MDR under Sec 10A PSS Act)
  | 'ppi_wallet' // Prepaid Payment Instruments / Wallets on UPI (NPCI Interchange Circular)
  | 'rupay_credit_card'; // RuPay Credit Card linked on UPI (NPCI Operating Circular)

export type MerchantCategoryKey =
  | 'general_merchant' // Standard merchant / retail store
  | 'small_offline_merchant' // Qualifying small offline merchant (P2PM QR / turnover ≤ ₹20L)
  | 'fuel_and_utilities' // Fuel stations, utility bills, railway bookings
  | 'capital_markets' // Mutual funds, stockbrokers, securities (SEBI / Bank UPI mandatory)
  | 'regular_merchant'
  | 'small_merchant'
  | 'essential_services';

export interface RegulatoryFrameworkMeta {
  instrument: PaymentInstrument;
  titleEn: string;
  titleTe: string;
  regulatoryStatusEn: string;
  regulatoryStatusTe: string;
  customerChargeEn: string;
  customerChargeTe: string;
  merchantMdrEn: string;
  merchantMdrTe: string;
  acquirerCommercialNoteEn: string;
  acquirerCommercialNoteTe: string;
  officialSource: string;
  officialSourceUrl: string;
}

export interface CalculationInput {
  amount: number | string;
  transactionType: TransactionType;
  paymentInstrument: PaymentInstrument;
  merchantCategory?: MerchantCategoryKey;
  evaluationDate?: string;
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
  
  // Customer Side (Always ₹0 extra across all UPI instruments)
  customerCharge: number; // 0
  customerTotalPays: number;
  
  // Ecosystem / Regulatory / Acquirer Side
  isMdrLegallyZero: boolean;
  statutoryMdrPercent: number; // 0% for bank account UPI
  statutoryMdrAmount: number;
  
  // Interchange / Commercial Acquirer Side
  hasEcosystemInterchange: boolean;
  interchangeRatePercent: number;
  estimatedInterchangeAmount: number;
  isSmallMerchantExempt: boolean;
  
  // Optional backward compatibility fields
  isMdrApplicable?: boolean;
  applicableMdrRatePercent?: number;
  estimatedMdr?: number;
  rawMdrAmount?: number;
  mdrCapApplied?: boolean;
  mdrCapAmount?: number | null;
  explanationEn?: string;
  explanationTe?: string;
  sourceNotice?: string;
  ruleEffectiveFrom?: string;
  ruleEffectiveUntil?: string | null;
  
  formulaText: string;
  whoBearsFeeEn: string;
  whoBearsFeeTe: string;
  
  estimatedMerchantSettlement: number;
  commercialSettlementDisclaimerEn: string;
  commercialSettlementDisclaimerTe: string;
  
  officialCircularNoticeEn: string;
  officialCircularNoticeTe: string;
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
