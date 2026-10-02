/**
 * Calculation Engine for UPI Transactions
 * Strictly aligns with verified official regulations:
 * 1. Bank Account UPI: Section 10A PSS Act Statutory Zero-MDR directive (0% MDR / ₹0 customer charge / 100% merchant settlement).
 * 2. PPI Wallet on UPI: NPCI March 2023 Circular on PPI Interchange (Ecosystem fee between acquirer and issuer; ₹0 customer charge; merchant settlement governed by acquirer agreement).
 * 3. RuPay Credit Card on UPI: NPCI Operating Circular (Nil MDR strictly for qualifying small offline merchants ≤ ₹2,000; commercial acquirer pricing for others; ₹0 customer surcharge).
 */

import { REGULATORY_FRAMEWORKS } from '../rules/upiRules';
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

  // 1. P2P TRANSFERS (100% Free)
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
      applicableMdrDisplayEn: '₹0 (100% Free)',
      applicableMdrDisplayTe: '₹0 (100% ఉచితం)',
      isSettlementDeterminedByAcquirer: false,
      estimatedMerchantSettlement: safeAmount,
      merchantSettlementDisplayEn: `${formattedAmount} (Full bank credit)`,
      merchantSettlementDisplayTe: `${formattedAmount} (పూర్తి మొత్తం జమ)`,
      formulaText: `${formattedAmount} (P2P Transfer) → 100% Free = ₹0.00`,
      whoBearsFeeEn: 'Both sender and receiver pay ₹0. Person-to-Person UPI is 100% free by law.',
      whoBearsFeeTe: 'పంపేవారికి మరియు స్వీకరించేవారికి 100% ఉచితం. ఎటువంటి ఛార్జీలు ఉండవు.',
      commercialSettlementDisclaimerEn: 'P2P transfers are direct bank-to-bank credits with zero charges.',
      commercialSettlementDisclaimerTe: 'P2P లావాదేవీలకు ఎటువంటి కోతలు ఉండవు.',
      officialCircularNoticeEn: 'RBI & NPCI UPI Core Operating Principles (P2P zero-charge directive).',
      officialCircularNoticeTe: 'RBI & NPCI మార్గదర్శకాల ప్రకారం P2P పూర్తిగా ఉచితం.',
      validationWarning,
    };
  }

  // 2. STANDARD BANK-ACCOUNT UPI (Section 10A PSS Act: ZERO MDR)
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
      applicableMdrDisplayEn: '0% Statutory Zero-MDR (Section 10A PSS Act)',
      applicableMdrDisplayTe: '0% MDR (సెక్షన్ 10A PSS చట్టం ప్రకారం ఉచితం)',
      isSettlementDeterminedByAcquirer: false,
      estimatedMerchantSettlement: safeAmount,
      merchantSettlementDisplayEn: `${formattedAmount} (100% settled to merchant account)`,
      merchantSettlementDisplayTe: `${formattedAmount} (వ్యాపారి ఖాతాలో 100% జమ అవుతుంది)`,
      formulaText: `${formattedAmount} (Bank Account UPI) → Statutory 0% MDR = ₹0.00`,
      whoBearsFeeEn: 'Both Customer and Merchant bear ₹0 MDR under Section 10A of the PSS Act.',
      whoBearsFeeTe: 'సెక్షన్ 10A PSS చట్టం ప్రకారం కస్టమర్ మరియు వ్యాపారి ఇద్దరికీ ₹0 MDR.',
      commercialSettlementDisclaimerEn:
        'Under Government of India and RBI directives (Section 10A PSS Act), no MDR is charged for bank-account UPI. The merchant receives 100% of the funds.',
      commercialSettlementDisclaimerTe:
        'భారత ప్రభుత్వ నిబంధనల ప్రకారం బ్యాంక్ UPI కి 0% MDR. వ్యాపారికి పూర్తి మొత్తం అందుతుంది.',
      officialCircularNoticeEn:
        'Payment and Settlement Systems Act (Section 10A) & RBI Notification DPSS.CO.PD No.1164/02.14.003/2019-20.',
      officialCircularNoticeTe: 'ఆర్థిక మంత్రిత్వ శాఖ & RBI జీరో-MDR ఉత్తర్వులు.',
      validationWarning,
    };
  }

  // 3. PREPAID WALLET / PPI ON UPI (NPCI Interchange Framework)
  if (instrument === 'ppi_wallet') {
    const isExempt = safeAmount <= 2000 || category === 'small_offline_merchant';
    const ratePercent = isExempt ? 0 : category === 'fuel_and_utilities' ? 0.50 : 1.10;
    const interchangeAmount = roundToDecimals((safeAmount * ratePercent) / 100, 2);

    let formulaText = '';
    if (isExempt) {
      formulaText = safeAmount === 0
        ? `₹0.00 × 0% = ₹0.00`
        : safeAmount <= 2000
        ? `${formattedAmount} ≤ ₹2,000 threshold (Wallet on UPI) → 0% Ecosystem Interchange = ₹0.00`
        : `${formattedAmount} (Small Offline Vendor Exemption) → 0% = ₹0.00`;
    } else {
      formulaText = `${formattedAmount} × ${ratePercent}% = ${formatCurrencyINR(interchangeAmount, true)} (Ecosystem Interchange)`;
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
      applicableMdrDisplayEn: isExempt
        ? '0% (Exempt from ecosystem interchange)'
        : `${ratePercent}% Ecosystem Interchange (Paid between Acquirer & Wallet Issuer)`,
      applicableMdrDisplayTe: isExempt
        ? '0% (ఇంటర్‌ఛేంజ్ నుండి మినహాయింపు)'
        : `${ratePercent}% ఇంటర్‌ఛేంజ్ (బ్యాంకుల మధ్య అంతర్గత రుసుము)`,
      isSettlementDeterminedByAcquirer: !isExempt,
      estimatedMerchantSettlement: isExempt ? safeAmount : null,
      merchantSettlementDisplayEn: isExempt
        ? `${formattedAmount} (₹0 ecosystem interchange for ≤ ₹2,000 / small vendor)`
        : 'Governed by merchant\'s acquiring bank / payment aggregator agreement',
      merchantSettlementDisplayTe: isExempt
        ? `${formattedAmount} (₹2,000 లోపు ఇంటర్‌ఛేంజ్ ₹0)`
        : 'వ్యాపారి బ్యాంక్ / పేమెంట్ గేట్‌వే ఒప్పందం ప్రకారం నిర్ణయించబడుతుంది',
      formulaText,
      whoBearsFeeEn: isExempt
        ? 'Customer and Merchant bear ₹0 fee for wallet transactions up to ₹2,000.'
        : `Customer pays ₹0 extra. The ${formatCurrencyINR(interchangeAmount, true)} ecosystem interchange is an inter-provider fee paid between acquirer and wallet issuer. Merchant actual settlement depends on acquiring agreement.`,
      whoBearsFeeTe: isExempt
        ? '₹2,000 లోపు లావాదేవీలకు కస్టమర్ మరియు వ్యాపారికి ఎటువంటి ఛార్జీ ఉండదు.'
        : `కస్టమర్‌కు ₹0 ఛార్జ్. ఇంటర్‌ఛేంజ్ రుసుము బ్యాంకుల మధ్య అంతర్గతంగా వర్తిస్తుంది. వ్యాపారికి అందే మొత్తం బ్యాంక్ ఒప్పందంపై ఆధారపడి ఉంటుంది.`,
      commercialSettlementDisclaimerEn:
        'NPCI sets this interchange between payment providers. The merchant’s actual net payout is determined by their commercial contract with their acquiring bank or payment aggregator (e.g. blended pricing model).',
      commercialSettlementDisclaimerTe:
        'ఇంటర్‌ఛేంజ్ అనేది బ్యాంకుల మధ్య రుసుము. వ్యాపారికి అందే నికర మొత్తం వారి పేమెంట్ గేట్‌వే ఒప్పందంపై ఆధారపడి ఉంటుంది.',
      officialCircularNoticeEn: 'NPCI Operating Circular on PPI Interchange on UPI (March 2023).',
      officialCircularNoticeTe: 'NPCI PPI ఇంటర్‌ఛేంజ్ సర్క్యులర్ (మార్చి 2023).',
      validationWarning,
    };
  }

  // 4. RUPAY CREDIT CARD ON UPI (NPCI Operating Circular)
  const isQualifyingSmallOffline = category === 'small_offline_merchant' && safeAmount <= 2000;

  let formulaText = '';
  if (isQualifyingSmallOffline) {
    formulaText = safeAmount === 0
      ? `₹0.00 × 0% = ₹0.00`
      : `${formattedAmount} ≤ ₹2,000 (Qualifying Small Offline Merchant) → Nil MDR (0%) mandated by NPCI = ₹0.00`;
  } else if (safeAmount <= 2000) {
    formulaText = `${formattedAmount} (Standard/Online Merchant) → MDR determined by acquiring bank agreement (Nil MDR applies strictly to qualifying Small Offline Merchants)`;
  } else {
    formulaText = `${formattedAmount} > ₹2,000 → MDR determined by acquiring bank agreement (NPCI circular references applicable RuPay interchange)`;
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
    isMdrLegallyZero: isQualifyingSmallOffline,
    statutoryMdrPercent: 0,
    statutoryMdrAmount: 0,
    hasEcosystemInterchange: false,
    interchangeRatePercent: 0,
    estimatedInterchangeAmount: 0,
    isSmallMerchantExempt: isQualifyingSmallOffline,
    applicableMdrDisplayEn: isQualifyingSmallOffline
      ? '0% (Mandated Nil MDR for Small Offline Merchants ≤ ₹2,000)'
      : 'Determined by acquiring bank / payment provider agreement',
    applicableMdrDisplayTe: isQualifyingSmallOffline
      ? '0% Nil MDR (చిన్న వ్యాపారులకు ₹2,000 వరకు ఉచితం)'
      : 'బ్యాంక్ / పేమెంట్ గేట్‌వే ఒప్పందం ప్రకారం నిర్ణయించబడుతుంది',
    isSettlementDeterminedByAcquirer: !isQualifyingSmallOffline,
    estimatedMerchantSettlement: isQualifyingSmallOffline ? safeAmount : null,
    merchantSettlementDisplayEn: isQualifyingSmallOffline
      ? `${formattedAmount} (100% settled under NPCI Nil MDR mandate)`
      : 'Determined by merchant\'s acquiring bank / payment provider agreement',
    merchantSettlementDisplayTe: isQualifyingSmallOffline
      ? `${formattedAmount} (Nil MDR కింద 100% జమ అవుతుంది)`
      : 'వ్యాపారి బ్యాంక్ / పేమెంట్ గేట్‌వే ఒప్పందం ప్రకారం జమ అవుతుంది',
    formulaText,
    whoBearsFeeEn: isQualifyingSmallOffline
      ? 'Nil MDR: Qualifying small offline merchant transactions up to ₹2,000 are 100% exempt from MDR under NPCI operating circular.'
      : 'Customer surcharge is strictly ₹0. Applicable merchant MDR is determined by agreement with acquiring bank/payment provider (NPCI circular references applicable RuPay interchange arrangements rather than establishing a universal 2% MDR).',
    whoBearsFeeTe: isQualifyingSmallOffline
      ? 'చిన్న వ్యాపారులకు ₹2,000 వరకు Nil MDR (100% ఉచితం).'
      : 'కస్టమర్‌కు ఎలాంటి సర్‌ఛార్జ్ ఉండదు (₹0). వ్యాపారికి వర్తించే MDR వారి బ్యాంక్ ఒప్పందం ప్రకారం నిర్ణయించబడుతుంది.',
    commercialSettlementDisclaimerEn:
      'NPCI mandates Nil MDR up to ₹2,000 strictly for qualifying small offline merchants. For transactions > ₹2,000 or general merchants, MDR is not a statutory flat rate; it is determined by the merchant’s contract with their acquiring bank/provider.',
    commercialSettlementDisclaimerTe:
      'చిన్న ఆఫ్లైన్ వ్యాపారులకు మాత్రమే ₹2,000 వరకు Nil MDR వర్తిస్తుంది. ఇతర లావాదేవీలకు బ్యాంక్ ఒప్పందం ప్రకారం ఛార్జీలు ఉంటాయి.',
    officialCircularNoticeEn:
      'NPCI Operating Circular on RuPay Credit Card on UPI (Nil MDR for Small Offline Merchants ≤ ₹2,000).',
    officialCircularNoticeTe: 'NPCI రూపే క్రెడిట్ కార్డ్ UPI ఆపరేటింగ్ సర్క్యులర్.',
    validationWarning,
  };
}
