/**
 * Calculation Engine for UPI Transactions
 * Strictly aligns with verified official regulations:
 * 1. Bank Account UPI: Section 10A PSS Act Statutory Zero-MDR directive (0% MDR / ₹0 customer charge).
 * 2. PPI Wallet on UPI: NPCI March 2023 Circular on PPI Interchange (Ecosystem fee / ₹0 customer charge).
 * 3. RuPay Credit Card on UPI: NPCI Operating Circular (Nil MDR ≤ ₹2,000 for small merchants / Acquirer pricing).
 */

import { REGULATORY_FRAMEWORKS, UPI_REGULATORY_META } from '../rules/upiRules';
import {
  CalculationInput,
  CalculationResult,
  MerchantCategoryKey,
  PaymentInstrument,
} from '../types/upi';

export function formatCurrencyINR(val: number, showDecimals = false): string {
  if (val === undefined || isNaN(val) || !isFinite(val)) return '₹0';
  const rounded = Math.round((val + Number.EPSILON) * 100) / 100;
  if (showDecimals || rounded % 1 !== 0) {
    return `₹${rounded.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `₹${rounded.toLocaleString('en-IN')}`;
}

export function roundToDecimals(value: number, decimals = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function calculateUpiMdr(input: CalculationInput): CalculationResult {
  // Input sanitization and safety
  let parsedAmount = typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount;
  let validationWarning: string | undefined = undefined;

  if (isNaN(parsedAmount) || !isFinite(parsedAmount)) {
    parsedAmount = 0;
  } else if (parsedAmount < 0) {
    validationWarning = 'Amount cannot be negative. Clamped to ₹0.';
    parsedAmount = 0;
  }

  const safeAmount = roundToDecimals(parsedAmount, 2);
  const formattedAmount = formatCurrencyINR(safeAmount, safeAmount % 1 !== 0);
  const instrument: PaymentInstrument = input.paymentInstrument || 'bank_account';
  const category: MerchantCategoryKey = input.merchantCategory || 'general_merchant';
  const meta = REGULATORY_FRAMEWORKS[instrument];

  // Customer charge is ALWAYS ₹0 for all UPI transactions in India
  const customerCharge = 0;
  const customerTotalPays = safeAmount;

  // -----------------------------------------------------------------
  // 1. P2P TRANSFERS (Person to Person) - 100% Free
  // -----------------------------------------------------------------
  if (input.transactionType === 'P2P') {
    return {
      amount: safeAmount,
      formattedAmount,
      transactionType: 'P2P',
      paymentInstrument: instrument,
      paymentInstrumentLabelEn: 'Person to Person (P2P)',
      customerCharge: 0,
      customerTotalPays: safeAmount,
      isMdrLegallyZero: true,
      statutoryMdrPercent: 0,
      statutoryMdrAmount: 0,
      hasEcosystemInterchange: false,
      interchangeRatePercent: 0,
      estimatedInterchangeAmount: 0,
      isSmallMerchantExempt: false,
      formulaText: `${formattedAmount} (P2P Transfer) → 100% Free = ₹0.00`,
      whoBearsFeeEn: 'Both sender and receiver pay ₹0. Person-to-Person UPI is 100% free by law.',
      whoBearsFeeTe: 'పంపేవారికి మరియు స్వీకరించేవారికి 100% ఉచితం. ఎటువంటి ఛార్జీలు ఉండవు.',
      estimatedMerchantSettlement: safeAmount,
      commercialSettlementDisclaimerEn: 'P2P transfers are direct bank-to-bank credits with zero charges.',
      commercialSettlementDisclaimerTe: 'P2P లావాదేవీలకు ఎటువంటి కోతలు ఉండవు.',
      officialCircularNoticeEn: 'RBI & NPCI UPI Core Operating Principles (P2P zero-charge directive).',
      officialCircularNoticeTe: 'RBI & NPCI మార్గదర్శకాల ప్రకారం P2P పూర్తిగా ఉచితం.',
      validationWarning,
    };
  }

  // -----------------------------------------------------------------
  // 2. STANDARD BANK-ACCOUNT UPI (Section 10A PSS Act: ZERO MDR)
  // -----------------------------------------------------------------
  if (instrument === 'bank_account') {
    return {
      amount: safeAmount,
      formattedAmount,
      transactionType: 'P2M',
      paymentInstrument: 'bank_account',
      paymentInstrumentLabelEn: meta.titleEn,
      merchantCategory: category,
      customerCharge: 0,
      customerTotalPays: safeAmount,
      isMdrLegallyZero: true,
      statutoryMdrPercent: 0,
      statutoryMdrAmount: 0,
      hasEcosystemInterchange: false,
      interchangeRatePercent: 0,
      estimatedInterchangeAmount: 0,
      isSmallMerchantExempt: false,
      formulaText: `${formattedAmount} (Bank Account UPI) → Statutory 0% MDR = ₹0.00`,
      whoBearsFeeEn: 'Both Customer and Merchant bear ₹0 MDR under Section 10A of the PSS Act.',
      whoBearsFeeTe: 'సెక్షన్ 10A PSS చట్టం ప్రకారం కస్టమర్ మరియు వ్యాపారి ఇద్దరికీ ₹0 MDR.',
      estimatedMerchantSettlement: safeAmount,
      commercialSettlementDisclaimerEn:
        'Under Government of India and RBI directives, no MDR is charged for bank-account UPI. The merchant receives 100% of the funds.',
      commercialSettlementDisclaimerTe:
        'భారత ప్రభుత్వ నిబంధనల ప్రకారం బ్యాంక్ UPI కి 0% MDR. వ్యాపారికి పూర్తి మొత్తం అందుతుంది.',
      officialCircularNoticeEn:
        'Payment and Settlement Systems Act (Section 10A) & Ministry of Finance Zero-MDR Notification.',
      officialCircularNoticeTe: 'ఆర్థిక మంత్రిత్వ శాఖ జీరో-MDR ఉత్తర్వులు.',
      validationWarning,
    };
  }

  // -----------------------------------------------------------------
  // 3. PREPAID WALLET / PPI ON UPI (NPCI Interchange Framework)
  // -----------------------------------------------------------------
  if (instrument === 'ppi_wallet') {
    const isExempt = safeAmount <= 2000 || category === 'small_offline_merchant';
    const ratePercent = isExempt ? 0 : category === 'fuel_and_utilities' ? 0.50 : 1.10;
    const interchangeAmount = roundToDecimals((safeAmount * ratePercent) / 100, 2);

    let formulaText = '';
    if (isExempt) {
      formulaText = safeAmount === 0
        ? `₹0.00 × 0% = ₹0.00`
        : safeAmount <= 2000
        ? `${formattedAmount} ≤ ₹2,000 threshold (Wallet on UPI) → 0% Nil Fee = ₹0.00`
        : `${formattedAmount} (Small Offline Vendor Exemption) → 0% = ₹0.00`;
    } else {
      formulaText = `${formattedAmount} × ${ratePercent}% (NPCI Ecosystem Interchange) = ${formatCurrencyINR(interchangeAmount, true)}`;
    }

    return {
      amount: safeAmount,
      formattedAmount,
      transactionType: 'P2M',
      paymentInstrument: 'ppi_wallet',
      paymentInstrumentLabelEn: meta.titleEn,
      merchantCategory: category,
      customerCharge: 0,
      customerTotalPays: safeAmount,
      isMdrLegallyZero: false,
      statutoryMdrPercent: 0,
      statutoryMdrAmount: 0,
      hasEcosystemInterchange: !isExempt,
      interchangeRatePercent: ratePercent,
      estimatedInterchangeAmount: interchangeAmount,
      isSmallMerchantExempt: isExempt,
      formulaText,
      whoBearsFeeEn: isExempt
        ? 'Customer and Merchant bear ₹0 fee for wallet transactions up to ₹2,000.'
        : `Customer pays ₹0 extra. The ${formatCurrencyINR(interchangeAmount, true)} ecosystem interchange is paid between acquirer and wallet issuer.`,
      whoBearsFeeTe: isExempt
        ? '₹2,000 లోపు లావాదేవీలకు కస్టమర్ మరియు వ్యాపారికి ఎటువంటి ఛార్జీ ఉండదు.'
        : `కస్టమర్‌కు ₹0 ఛార్జ్. ఇంటర్‌ఛేంజ్ రుసుము బ్యాంకుల మధ్య అంతర్గతంగా వర్తిస్తుంది.`,
      estimatedMerchantSettlement: roundToDecimals(safeAmount - interchangeAmount, 2),
      commercialSettlementDisclaimerEn:
        'NPCI sets this interchange between payment providers. The merchant’s actual net payout is determined by their commercial contract with their acquiring bank or payment aggregator (e.g. blended rates).',
      commercialSettlementDisclaimerTe:
        'ఇంటర్‌ఛేంజ్ అనేది బ్యాంకుల మధ్య రుసుము. వ్యాపారికి అందే నికర మొత్తం వారి పేమెంట్ గేట్‌వే ఒప్పందంపై ఆధారపడి ఉంటుంది.',
      officialCircularNoticeEn: 'NPCI Operating Circular on PPI Interchange on UPI (March 2023).',
      officialCircularNoticeTe: 'NPCI PPI ఇంటర్‌ఛేంజ్ సర్క్యులర్ (మార్చి 2023).',
      validationWarning,
    };
  }

  // -----------------------------------------------------------------
  // 4. RUPAY CREDIT CARD ON UPI (NPCI Operating Circular)
  // -----------------------------------------------------------------
  // RuPay Credit Card on UPI
  const isSmallOfflineExempt = category === 'small_offline_merchant' || safeAmount <= 2000;
  // Indicative commercial credit card acquiring MDR rate (typically ~1.75% to 2.0%)
  const indicativeCommercialMdrRate = isSmallOfflineExempt ? 0 : 2.0;
  const estimatedCommercialMdr = roundToDecimals((safeAmount * indicativeCommercialMdrRate) / 100, 2);

  let formulaText = '';
  if (isSmallOfflineExempt) {
    formulaText = safeAmount === 0
      ? `₹0.00 × 0% = ₹0.00`
      : `${formattedAmount} ≤ ₹2,000 (Small Merchant RuPay CC Exemption) → Nil MDR (0%) = ₹0.00`;
  } else {
    formulaText = `${formattedAmount} × ~2.00% (Indicative Credit Card Acquirer Pricing) = ${formatCurrencyINR(estimatedCommercialMdr, true)}`;
  }

  return {
    amount: safeAmount,
    formattedAmount,
    transactionType: 'P2M',
    paymentInstrument: 'rupay_credit_card',
    paymentInstrumentLabelEn: meta.titleEn,
    merchantCategory: category,
    customerCharge: 0,
    customerTotalPays: safeAmount,
    isMdrLegallyZero: isSmallOfflineExempt,
    statutoryMdrPercent: 0,
    statutoryMdrAmount: 0,
    hasEcosystemInterchange: !isSmallOfflineExempt,
    interchangeRatePercent: indicativeCommercialMdrRate,
    estimatedInterchangeAmount: estimatedCommercialMdr,
    isSmallMerchantExempt: isSmallOfflineExempt,
    formulaText,
    whoBearsFeeEn: isSmallOfflineExempt
      ? 'Nil MDR: Small merchant offline transactions up to ₹2,000 are 100% exempt from MDR under NPCI operating circular.'
      : `Customer surcharge is strictly ₹0. Merchant commercial MDR is charged by acquiring bank/aggregator as per merchant agreement.`,
    whoBearsFeeTe: isSmallOfflineExempt
      ? 'చిన్న వ్యాపారులకు ₹2,000 వరకు Nil MDR (100% ఉచితం).'
      : 'కస్టమర్‌కు ఎలాంటి సర్‌ఛార్జ్ ఉండదు. వ్యాపారికి వారి బ్యాంక్ ఒప్పందం ప్రకారం క్రెడిట్ కార్డ్ ఛార్జీలు వర్తిస్తాయి.',
    estimatedMerchantSettlement: roundToDecimals(safeAmount - estimatedCommercialMdr, 2),
    commercialSettlementDisclaimerEn:
      'NPCI mandates Nil MDR up to ₹2,000 for qualifying small merchants. For transactions > ₹2,000, commercial MDR is not a single government-fixed fee; it is set by the acquiring bank/payment provider (typically ~1.5% - 2.0%).',
    commercialSettlementDisclaimerTe:
      'చిన్న వ్యాపారులకు ₹2,000 వరకు Nil MDR తప్పనిసరి. ₹2,000 దాటితే వాస్తవ ఛార్జీలు బ్యాంక్ ఒప్పందం ప్రకారం ఉంటాయి (~1.5% - 2.0%).',
    officialCircularNoticeEn:
      'NPCI Operating Circular on RuPay Credit Card on UPI (Nil MDR for Small Merchants ≤ ₹2,000).',
    officialCircularNoticeTe: 'NPCI రూపే క్రెడిట్ కార్డ్ UPI ఆపరేటింగ్ సర్క్యులర్.',
    validationWarning,
  };
}
