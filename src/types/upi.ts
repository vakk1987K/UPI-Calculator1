/**
 * Official UPI Framework Type Definitions
 * Sourced: Current 2026 Regulatory Status.
 */

export type TransactionType = 'P2P' | 'P2M';

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'mr' | 'gu' | 'ta' | 'bn' | 'or' | 'kn';

export type PaymentInstrument =
  | 'bank_account'
  | 'ppi_wallet'
  | 'rupay_credit_card';

export type MerchantCategoryKey =
  | 'general_merchant'
  | 'small_offline_merchant'
  | 'fuel_and_utilities'
  | 'capital_markets'
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
  customerCharge: number;
  customerTotalPays: number;
  
  // Ecosystem / Regulatory / Acquirer Side
  isMdrLegallyZero: boolean;
  statutoryMdrPercent: number;
  statutoryMdrAmount: number;
  
  // Interchange / Commercial Acquirer Side
  hasEcosystemInterchange: boolean;
  interchangeRatePercent: number;
  estimatedInterchangeAmount: number;
  isSmallMerchantExempt: boolean;
  
  // Explicit Settlement & MDR Descriptions (avoiding misleading pseudo-subtractions)
  applicableMdrDisplayEn: string;
  applicableMdrDisplayTe: string;
  isSettlementDeterminedByAcquirer: boolean;
  estimatedMerchantSettlement: number | null;
  merchantSettlementDisplayEn: string;
  merchantSettlementDisplayTe: string;
  
  formulaText: string;
  whoBearsFeeEn: string;
  whoBearsFeeTe: string;
  
  commercialSettlementDisclaimerEn: string;
  commercialSettlementDisclaimerTe: string;
  
  officialCircularNoticeEn: string;
  officialCircularNoticeTe: string;
  validationWarning?: string;
  
  // Optional backward compatibility
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
}
