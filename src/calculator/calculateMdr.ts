/**
 * Calculation Engine for UPI MDR & Merchant Settlement
 * Adheres strictly to the active regulatory rulebook.
 * Sourced from RBI, NPCI Circulars & Ministry of Finance (DFS).
 * Sourced: 30 September 2026.
 */

import {
  findApplicableRule,
  isFutureFrameworkActive,
  MERCHANT_CATEGORIES,
  PAYMENT_INSTRUMENTS,
  UPI_REGULATORY_META,
} from '../rules/upiRules';
import {
  CalculationInput,
  CalculationResult,
  MerchantProjectionInput,
  MerchantProjectionResult,
  PaymentInstrument,
} from '../types/upi';

/**
 * Formats a number in Indian Rupee format safely.
 */
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

/**
 * Rounds a number to a specified number of decimal places safely.
 */
export function roundToDecimals(value: number, decimals = 2): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Primary calculator function for a single UPI transaction.
 * Resilient against negative numbers, blank strings, NaN, Infinity, and edge cases.
 */
export function calculateUpiMdr(input: CalculationInput): CalculationResult {
  // 1. Sanitize and validate input amount
  let parsedAmount = typeof input.amount === 'string' ? parseFloat(input.amount) : input.amount;
  let validationWarning: string | undefined = undefined;

  if (isNaN(parsedAmount) || !isFinite(parsedAmount)) {
    parsedAmount = 0;
  } else if (parsedAmount < 0) {
    validationWarning = 'Transaction amount cannot be negative. Clamped to ₹0.';
    parsedAmount = 0;
  }

  const safeAmount = roundToDecimals(parsedAmount, 2);
  const evaluationDate = input.evaluationDate || new Date().toISOString().slice(0, 10);
  const isFuture = isFutureFrameworkActive(evaluationDate);
  const paymentInstrument: PaymentInstrument = input.paymentInstrument || 'bank_account';
  const categoryKey = input.merchantCategory || 'regular_merchant';

  const matchedRule = findApplicableRule(
    input.transactionType,
    paymentInstrument,
    categoryKey,
    evaluationDate
  );

  const categoryMeta = MERCHANT_CATEGORIES.find((c) => c.key === categoryKey);
  const instrumentMeta = PAYMENT_INSTRUMENTS.find((p) => p.key === paymentInstrument);

  // Customer charge is ALWAYS ₹0 for UPI in India (Section 10A PSS Act)
  const customerCharge = 0;
  const customerTotalPays = safeAmount;

  let applicableMdrRatePercent = 0;
  let rawMdrAmount = 0;
  let estimatedMdr = 0;
  let mdrCapApplied = false;
  let isFlatFee = false;
  let flatFeeAmount = 0;
  let formulaText = '';
  const mdrCapAmount = matchedRule.maximumMdrCap;
  let explanationEn = '';
  let explanationTe = '';

  const formattedAmount = formatCurrencyINR(safeAmount, safeAmount % 1 !== 0);

  // -----------------------------------------------------------------
  // 1. PATH 1: P2P Transaction (Person to Person) - Always ₹0 MDR
  // -----------------------------------------------------------------
  if (input.transactionType === 'P2P') {
    applicableMdrRatePercent = 0;
    rawMdrAmount = 0;
    estimatedMdr = 0;
    mdrCapApplied = false;
    isFlatFee = false;
    flatFeeAmount = 0;
    formulaText = `${formattedAmount} (P2P Transfer) → 0% = ₹0.00`;

    explanationEn =
      'You are sending money directly to another person. Person-to-Person (P2P) transfers are 100% free with zero MDR (₹0 fee) for both sender and receiver under RBI and NPCI guidelines.';
    explanationTe =
      'మీరు మరో వ్యక్తికి నేరుగా డబ్బు పంపుతున్నారు. వ్యక్తుల మధ్య జరిగే బదిలీలకు (P2P) RBI మరియు NPCI నిబంధనల ప్రకారం ఎటువంటి ఛార్జీలు లేదా MDR ఉండవు (100% ఉచితం).';
  } else {
    // -----------------------------------------------------------------
    // P2M Transaction Handling
    // -----------------------------------------------------------------
    if (safeAmount <= matchedRule.threshold) {
      // Threshold check: Amounts <= ₹2,000 are 100% exempt across all categories & instruments
      applicableMdrRatePercent = 0;
      rawMdrAmount = 0;
      estimatedMdr = 0;
      mdrCapApplied = false;
      isFlatFee = false;
      flatFeeAmount = 0;

      if (safeAmount === 0) {
        formulaText = `₹0.00 × 0% = ₹0.00`;
        explanationEn = 'Please enter a valid UPI transaction amount above ₹0 to view calculations.';
        explanationTe = 'లావాదేవీ ఫలితాలను చూడటానికి దయచేసి సరైన UPI మొత్తాన్ని నమోదు చేయండి.';
      } else {
        const thresholdStr = formatCurrencyINR(matchedRule.threshold);
        formulaText = `${formattedAmount} ≤ ${thresholdStr} threshold → 0% = ₹0.00`;
        explanationEn = `Transactions up to ${thresholdStr} have Nil MDR (0% free) across payment instruments. Customer pays ${formattedAmount} (Customer surcharge: ₹0), and the merchant receives the full ${formattedAmount}.`;
        explanationTe = `${thresholdStr} లోపు లావాదేవీలకు MDR నుండి 100% పూర్తి మినహాయింపు ఉంది. కస్టమర్ కేవలం ${formattedAmount} చెల్లిస్తారు (కస్టమర్ ఛార్జ్ ₹0), మరియు వ్యాపారికి ఎలాంటి కోత లేకుండా పూర్తి ${formattedAmount} అందుతుంది.`;
      }
    } else {
      // Exceeds threshold (> ₹2,000)
      if (paymentInstrument === 'rupay_credit_card') {
        // RuPay Credit Card on UPI (NPCI Circular)
        if (matchedRule.isExempt || matchedRule.rateAboveThreshold === 0) {
          estimatedMdr = 0;
          applicableMdrRatePercent = 0;
          rawMdrAmount = 0;
          mdrCapApplied = false;
          formulaText = `${formattedAmount} (RuPay CC Small Merchant Exemption) → 0% = ₹0.00`;
          explanationEn = `Small offline merchants accepting RuPay Credit Card on UPI are exempt from MDR (Nil MDR / 0% fee) as per NPCI circular. Customer surcharge is ₹0.`;
          explanationTe = `NPCI సర్క్యులర్ ప్రకారం చిన్న వ్యాపారులకు రూపే క్రెడిట్ కార్డ్ UPI చెల్లింపులపై పూర్తి మినహాయింపు (0% ఫీజు) ఉంది. కస్టమర్ ఛార్జ్ ₹0.`;
        } else {
          applicableMdrRatePercent = roundToDecimals(matchedRule.rateAboveThreshold * 100, 2);
          rawMdrAmount = roundToDecimals(safeAmount * matchedRule.rateAboveThreshold, 2);
          estimatedMdr = rawMdrAmount;
          mdrCapApplied = false;
          formulaText = `${formattedAmount} × ${applicableMdrRatePercent}% (RuPay CC MDR) = ${formatCurrencyINR(estimatedMdr, true)}`;
          explanationEn = `Transaction is above ₹2,000 using RuPay Credit Card on UPI. As per NPCI circular, standard credit card MDR of ${applicableMdrRatePercent}% (${formatCurrencyINR(estimatedMdr, true)}) is deducted from the merchant payout. Crucially, the customer pays ₹0 surcharge.`;
          explanationTe = `రూపే క్రెడిట్ కార్డ్ ద్వారా ₹2,000 దాటిన లావాదేవీకి NPCI నిబంధనల ప్రకారం వ్యాపారి వైపు ${applicableMdrRatePercent}% (${formatCurrencyINR(estimatedMdr, true)}) రుసుము వర్తిస్తుంది. కస్టమర్ ఎటువంటి అదనపు రుసుము లేకుండా సరిగ్గా ${formattedAmount} మాత్రమే చెల్లిస్తారు.`;
        }
      } else if (paymentInstrument === 'ppi_wallet') {
        // Prepaid Wallet (PPI) on UPI QR (NPCI Circular)
        if (matchedRule.isExempt || matchedRule.rateAboveThreshold === 0) {
          estimatedMdr = 0;
          applicableMdrRatePercent = 0;
          rawMdrAmount = 0;
          mdrCapApplied = false;
          formulaText = `${formattedAmount} (Wallet Small Merchant Exemption) → 0% = ₹0.00`;
          explanationEn = `Small offline merchants accepting wallet UPI payments are fully exempt (0% fee) under NPCI circular. Customer charge is ₹0.`;
          explanationTe = `NPCI సర్క్యులర్ ప్రకారం చిన్న వ్యాపారులకు వాలెట్ UPI చెల్లింపులపై పూర్తి మినహాయింపు (0% ఫీజు) ఉంది. కస్టమర్ ఛార్జ్ ₹0.`;
        } else {
          applicableMdrRatePercent = roundToDecimals(matchedRule.rateAboveThreshold * 100, 2);
          rawMdrAmount = roundToDecimals(safeAmount * matchedRule.rateAboveThreshold, 2);
          estimatedMdr = rawMdrAmount;
          mdrCapApplied = false;
          formulaText = `${formattedAmount} × ${applicableMdrRatePercent}% (Wallet Interchange) = ${formatCurrencyINR(estimatedMdr, true)}`;
          explanationEn = `Transaction is above ₹2,000 using Prepaid Wallet/PPI on UPI QR. As per NPCI rules, a ${applicableMdrRatePercent}% interchange (${formatCurrencyINR(estimatedMdr, true)}) applies on the merchant side. Crucially, the customer pays ₹0 surcharge.`;
          explanationTe = `వాలెట్/PPI ద్వారా ₹2,000 దాటిన లావాదేవీలకు NPCI నిబంధనల ప్రకారం వ్యాపారి వైపు ${applicableMdrRatePercent}% (${formatCurrencyINR(estimatedMdr, true)}) రుసుము వర్తిస్తుంది. కస్టమర్ ఎటువంటి అదనపు రుసుము లేకుండా సరిగ్గా ${formattedAmount} మాత్రమే చెల్లిస్తారు.`;
        }
      } else {
        // Standard Bank Account UPI
        if (matchedRule.isExempt || (matchedRule.rateAboveThreshold === 0 && !matchedRule.isFlatFee)) {
          // Either current rules (until 14 Oct 2026) or small merchant P2PM exempt
          estimatedMdr = 0;
          applicableMdrRatePercent = 0;
          rawMdrAmount = 0;
          mdrCapApplied = false;

          if (categoryKey === 'small_merchant') {
            formulaText = `${formattedAmount} (P2PM QR ≤ ₹1 Lakh/mo) → 0% = ₹0.00`;
            explanationEn = `Small merchants receiving up to ₹1 Lakh/month under the P2PM QR framework are 100% exempt from MDR (0% MDR). Merchant receives full ${formattedAmount}, and customer pays ₹0 extra.`;
            explanationTe = `P2PM QR విధానం కింద నెలకు ₹1 లక్ష లోపు లావాదేవీలు పొందే చిన్న వ్యాపారులకు 0% MDR (పూర్తి ఉచితం). కస్టమర్ ఛార్జ్ ₹0.`;
          } else {
            formulaText = `${formattedAmount} (Active Zero-MDR until 14 Oct 2026) → 0% = ₹0.00`;
            explanationEn = `Transaction is above ₹2,000. Under the currently active zero-MDR directive (effective until 14 October 2026), standard bank-to-bank UPI incurs 0% MDR. Both customer and merchant pay ₹0 fee.`;
            explanationTe = `ప్రస్తుతం అమల్లో ఉన్న మార్గదర్శకాల ప్రకారం (14 అక్టోబర్ 2026 వరకు) ప్రామాణిక బ్యాంక్ UPI కి 0% MDR ఉంటుంది. కస్టమర్ మరియు వ్యాపారి ఇద్దరికీ ₹0 ఫీజు.`;
          }
        } else if (matchedRule.isFlatFee) {
          // Path 3: Essential & Thin-margin Sectors (Flat ₹5 for > ₹2,000)
          isFlatFee = true;
          flatFeeAmount = matchedRule.flatFeeAmount || 5;
          estimatedMdr = flatFeeAmount;
          rawMdrAmount = flatFeeAmount;
          applicableMdrRatePercent = roundToDecimals((flatFeeAmount / safeAmount) * 100, 4);
          mdrCapApplied = false;

          formulaText = `${formattedAmount} > ₹2,000 (Essential Sector) → Statutory Flat ₹${flatFeeAmount}.00`;
          explanationEn = `Transaction is above ₹2,000 in an essential sector (fuel, railways, telecom, utilities, agriculture). A statutory flat ₹5 MDR applies on the merchant side, not a percentage. Customer pays ₹0 extra (Debited ${formattedAmount}).`;
          explanationTe = `నిత్యావసరాలు, ఇంధనం లేదా రైల్వేల లావాదేవీ ₹2,000 దాటినందున, శాతం కాకుండా ఫ్లాట్ ₹5 MDR మాత్రమే వర్తిస్తుంది. కస్టమర్ ఛార్జ్ ₹0.`;
        } else {
          // Percentage with cap:
          // Path 2: Normal P2M Merchant (0.40%, cap ₹300)
          // Path 4: Capital Markets (0.02%, cap ₹300)
          const decimalRate = matchedRule.rateAboveThreshold;
          applicableMdrRatePercent = roundToDecimals(decimalRate * 100, 4);
          rawMdrAmount = roundToDecimals(safeAmount * decimalRate, 2);

          if (mdrCapAmount !== null && rawMdrAmount > mdrCapAmount) {
            estimatedMdr = mdrCapAmount;
            mdrCapApplied = true;
            formulaText = `${formattedAmount} × ${applicableMdrRatePercent}% = ${formatCurrencyINR(rawMdrAmount, true)} → Cap Applied: ${formatCurrencyINR(mdrCapAmount, true)}`;
            explanationEn = `Transaction is above ₹${matchedRule.threshold.toLocaleString('en-IN')}. Calculated MDR is ${formatCurrencyINR(rawMdrAmount, true)} (${applicableMdrRatePercent}%), but the regulatory maximum cap of ${formatCurrencyINR(mdrCapAmount, true)} has been applied. Merchant pays ${formatCurrencyINR(estimatedMdr, true)}. Customer charge is ₹0.`;
            explanationTe = `లావాదేవీ ₹${matchedRule.threshold.toLocaleString('en-IN')} మించింది. లెక్కింపబడిన MDR ${formatCurrencyINR(rawMdrAmount, true)} అయినప్పటికీ, నిబంధనల ప్రకారం గరిష్ట పరిమితి ${formatCurrencyINR(mdrCapAmount, true)} వర్తించబడింది. వ్యాపారి చెల్లించే MDR ${formatCurrencyINR(estimatedMdr, true)}. కస్టమర్ ఛార్జ్ ₹0.`;
          } else {
            estimatedMdr = rawMdrAmount;
            mdrCapApplied = false;
            formulaText = `${formattedAmount} × ${applicableMdrRatePercent}% = ${formatCurrencyINR(estimatedMdr, true)}`;
            explanationEn = `Transaction is above ₹${matchedRule.threshold.toLocaleString('en-IN')}. MDR of ${applicableMdrRatePercent}% (${formatCurrencyINR(estimatedMdr, true)}) applies to the merchant. Customer charge is ₹0.`;
            explanationTe = `లావాదేవీ ₹${matchedRule.threshold.toLocaleString('en-IN')} మించింది. వ్యాపారికి ${applicableMdrRatePercent}% (${formatCurrencyINR(estimatedMdr, true)}) MDR వర్తిస్తుంది. కస్టమర్ ఛార్జ్ ₹0.`;
          }
        }
      }
    }
  }

  const isMdrApplicable = estimatedMdr > 0;
  const estimatedMerchantSettlement = roundToDecimals(safeAmount - estimatedMdr, 2);

  const whoBearsFeeEn = isMdrApplicable
    ? `Merchant/Acquirer bears the estimated ${formatCurrencyINR(estimatedMdr, true)} MDR. Customer is debited exactly ${formattedAmount} with ₹0 surcharge.`
    : `Both Customer and Merchant bear ₹0 MDR (100% free transaction).`;

  const whoBearsFeeTe = isMdrApplicable
    ? `వ్యాపారి/బ్యాంక్ ${formatCurrencyINR(estimatedMdr, true)} MDR భరిస్తుంది. కస్టమర్ ఎటువంటి అదనపు ఛార్జీ లేకుండా సరిగ్గా ${formattedAmount} చెల్లిస్తారు.`
    : `కస్టమర్ మరియు వ్యాపారి ఇద్దరికీ ₹0 MDR (100% ఉచిత లావాదేవీ).`;

  return {
    amount: safeAmount,
    formattedAmount,
    transactionType: input.transactionType,
    paymentInstrument,
    paymentInstrumentLabelEn: instrumentMeta?.labelEn || 'Bank Account UPI',
    merchantCategory: categoryKey,
    merchantCategoryLabelEn: categoryMeta?.labelEn,
    merchantCategoryLabelTe: categoryMeta?.labelTe,
    customerCharge,
    customerTotalPays,
    applicableMdrRatePercent,
    rawMdrAmount,
    estimatedMdr,
    formulaText,
    isFlatFee,
    flatFeeAmount,
    mdrCapApplied,
    mdrCapAmount,
    estimatedMerchantSettlement,
    isMdrApplicable,
    whoBearsFeeEn,
    whoBearsFeeTe,
    appliedRuleId: matchedRule.id,
    ruleEffectiveFrom: matchedRule.effectiveFrom,
    ruleEffectiveUntil: matchedRule.effectiveUntil,
    isFutureFrameworkActive: isFuture,
    explanationEn,
    explanationTe,
    sourceNotice: `${matchedRule.source} (${matchedRule.sourceDate})`,
    validationWarning,
  };
}

/**
 * Calculates business projections for merchants (monthly/annual settlement estimates).
 */
export function calculateMerchantProjections(input: MerchantProjectionInput): MerchantProjectionResult {
  let avg = typeof input.averageAmount === 'string' ? parseFloat(input.averageAmount) : input.averageAmount;
  let daily = typeof input.dailyTransactions === 'string' ? parseFloat(input.dailyTransactions) : input.dailyTransactions;
  let days = typeof input.businessDaysPerMonth === 'string' ? parseFloat(input.businessDaysPerMonth) : input.businessDaysPerMonth;

  const safeAvg = Math.max(0, isNaN(avg) || !isFinite(avg) ? 0 : avg);
  const safeDaily = Math.max(0, isNaN(daily) || !isFinite(daily) ? 0 : daily);
  const safeDays = Math.max(1, isNaN(days) || !isFinite(days) ? 30 : days);

  const monthlyTransactions = Math.round(safeDaily * safeDays);
  const monthlySalesVolume = roundToDecimals(monthlyTransactions * safeAvg, 2);

  // Single transaction MDR result
  const singleTxnResult = calculateUpiMdr({
    amount: safeAvg,
    transactionType: 'P2M',
    paymentInstrument: input.paymentInstrument || 'bank_account',
    merchantCategory: input.merchantCategory,
    evaluationDate: input.evaluationDate,
  });

  const estimatedMdrPerTransaction = singleTxnResult.estimatedMdr;
  const transactionsSubjectToMdr = singleTxnResult.isMdrApplicable ? monthlyTransactions : 0;
  const estimatedMonthlyMdr = roundToDecimals(transactionsSubjectToMdr * estimatedMdrPerTransaction, 2);
  const estimatedAnnualMdr = roundToDecimals(estimatedMonthlyMdr * 12, 2);
  const estimatedNetMonthlySettlement = roundToDecimals(monthlySalesVolume - estimatedMonthlyMdr, 2);

  return {
    monthlyTransactions,
    monthlySalesVolume,
    transactionsSubjectToMdr,
    applicableMdrRatePercent: singleTxnResult.applicableMdrRatePercent,
    estimatedMdrPerTransaction,
    estimatedMonthlyMdr,
    estimatedAnnualMdr,
    estimatedNetMonthlySettlement,
    isMdrApplicable: singleTxnResult.isMdrApplicable,
  };
}
