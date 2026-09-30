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
 * Rounds a number to a specified number of decimal places safely.
 */
export function roundToDecimals(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Primary calculator function for a single UPI transaction.
 */
export function calculateUpiMdr(input: CalculationInput): CalculationResult {
  const safeAmount = Math.max(0, isNaN(input.amount) ? 0 : input.amount);
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

  // Customer charge is ALWAYS ₹0 for UPI in India (Section 10A PSS Act)
  const customerCharge = 0;
  const customerTotalPays = safeAmount;

  let applicableMdrRatePercent = 0;
  let rawMdrAmount = 0;
  let estimatedMdr = 0;
  let mdrCapApplied = false;
  let isFlatFee = false;
  let flatFeeAmount = 0;
  const mdrCapAmount = matchedRule.maximumMdrCap;
  let explanationEn = '';
  let explanationTe = '';

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

    explanationEn =
      'You are sending money directly to another person. Person-to-Person (P2P) transfers are 100% free with zero MDR (₹0 fee) for both sender and receiver under RBI and NPCI guidelines.';
    explanationTe =
      'మీరు మరో వ్యక్తికి నేరుగా డబ్బు పంపుతున్నారు. వ్యక్తుల మధ్య జరిగే బదిలీలకు (P2P) RBI మరియు NPCI నిబంధనల ప్రకారం ఎటువంటి ఛార్జీలు లేదా MDR ఉండవు (100% ఉచితం).';
  } else {
    // -----------------------------------------------------------------
    // P2M Transaction Handling
    // -----------------------------------------------------------------
    if (safeAmount <= matchedRule.threshold) {
      // Threshold check: Amounts <= ₹2,000 are 100% exempt across all categories
      applicableMdrRatePercent = 0;
      rawMdrAmount = 0;
      estimatedMdr = 0;
      mdrCapApplied = false;
      isFlatFee = false;
      flatFeeAmount = 0;

      if (safeAmount === 0) {
        explanationEn = 'Please enter a valid UPI transaction amount to view calculations.';
        explanationTe = 'లావాదేవీ ఫలితాలను చూడటానికి దయచేసి సరైన UPI మొత్తాన్ని నమోదు చేయండి.';
      } else {
        explanationEn = `Transactions up to ₹${matchedRule.threshold.toLocaleString('en-IN')} are 100% exempt from MDR across all merchants. Customer pays ₹${safeAmount.toLocaleString('en-IN')}, customer fee is ₹0, and the merchant receives the full ₹${safeAmount.toLocaleString('en-IN')}.`;
        explanationTe = `₹${matchedRule.threshold.toLocaleString('en-IN')} లోపు లావాదేవీలకు వ్యాపారులందరికీ MDR నుండి 100% పూర్తి మినహాయింపు ఉంది. కస్టమర్ కేవలం ₹${safeAmount.toLocaleString('en-IN')} చెల్లిస్తారు (కస్టమర్ ఛార్జ్ ₹0), మరియు వ్యాపారికి ఎలాంటి కోత లేకుండా పూర్తి ₹${safeAmount.toLocaleString('en-IN')} అందుతుంది.`;
      }
    } else {
      // Exceeds threshold (> ₹2,000)
      if (paymentInstrument === 'ppi_wallet') {
        // Prepaid Wallet (PPI) on UPI QR
        if (matchedRule.isExempt || matchedRule.rateAboveThreshold === 0) {
          estimatedMdr = 0;
          applicableMdrRatePercent = 0;
          rawMdrAmount = 0;
          mdrCapApplied = false;
          explanationEn = `Small offline merchants accepting wallet UPI payments are fully exempt (0% fee) under NPCI circular. Customer charge is ₹0.`;
          explanationTe = `NPCI సర్క్యులర్ ప్రకారం చిన్న వ్యాపారులకు వాలెట్ UPI చెల్లింపులపై పూర్తి మినహాయింపు (0% ఫీజు) ఉంది. కస్టమర్ ఛార్జ్ ₹0.`;
        } else {
          applicableMdrRatePercent = roundToDecimals(matchedRule.rateAboveThreshold * 100, 2);
          rawMdrAmount = roundToDecimals(safeAmount * matchedRule.rateAboveThreshold, 2);
          estimatedMdr = rawMdrAmount;
          mdrCapApplied = false;
          explanationEn = `Transaction is above ₹2,000 using Prepaid Wallet/PPI on UPI QR. As per NPCI rules, a ${applicableMdrRatePercent}% interchange (₹${estimatedMdr.toFixed(2)}) applies on the merchant side. Crucially, the customer still pays ₹0 extra.`;
          explanationTe = `వాలెట్/PPI ద్వారా ₹2,000 దాటిన లావాదేవీలకు NPCI నిబంధనల ప్రకారం వ్యాపారి వైపు ${applicableMdrRatePercent}% (₹${estimatedMdr.toFixed(2)}) రుసుము వర్తిస్తుంది. ముఖ్యంగా: కస్టమర్ ఎటువంటి అదనపు రుసుము లేకుండా సరిగ్గా ₹${safeAmount.toLocaleString('en-IN')} మాత్రమే చెల్లిస్తారు.`;
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
            explanationEn = `Small merchants receiving up to ₹1 Lakh/month under the P2PM QR framework are 100% exempt from MDR (0% MDR). Merchant receives full ₹${safeAmount.toLocaleString('en-IN')}, and customer pays ₹0 extra.`;
            explanationTe = `P2PM QR విధానం కింద నెలకు ₹1 లక్ష లోపు లావాదేవీలు పొందే చిన్న వ్యాపారులకు 0% MDR (పూర్తి ఉచితం). కస్టమర్ ఛార్జ్ ₹0.`;
          } else {
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

          explanationEn = `Transaction is above ₹2,000 in an essential sector (fuel, railways, telecom, utilities, agriculture). A statutory flat ₹5 MDR applies on the merchant side, not a percentage. Customer pays ₹0 extra (Debited ₹${safeAmount.toLocaleString('en-IN')}).`;
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
            explanationEn = `Transaction is above ₹${matchedRule.threshold.toLocaleString('en-IN')}. Calculated MDR is ₹${rawMdrAmount.toFixed(2)} (${applicableMdrRatePercent}%), but the regulatory maximum cap of ₹${mdrCapAmount.toFixed(2)} has been applied. Merchant pays ₹${estimatedMdr.toFixed(2)}. Customer charge is ₹0.`;
            explanationTe = `లావాదేవీ ₹${matchedRule.threshold.toLocaleString('en-IN')} మించింది. లెక్కింపబడిన MDR ₹${rawMdrAmount.toFixed(2)} అయినప్పటికీ, నిబంధనల ప్రకారం గరిష్ట పరిమితి ₹${mdrCapAmount.toFixed(2)} వర్తించబడింది. వ్యాపారి చెల్లించే MDR ₹${estimatedMdr.toFixed(2)}. కస్టమర్ ఛార్జ్ ₹0.`;
          } else {
            estimatedMdr = rawMdrAmount;
            mdrCapApplied = false;
            explanationEn = `Transaction is above ₹${matchedRule.threshold.toLocaleString('en-IN')}. MDR of ${applicableMdrRatePercent}% (₹${estimatedMdr.toFixed(2)}) applies to the merchant. Customer charge is ₹0.`;
            explanationTe = `లావాదేవీ ₹${matchedRule.threshold.toLocaleString('en-IN')} మించింది. వ్యాపారికి ${applicableMdrRatePercent}% (₹${estimatedMdr.toFixed(2)}) MDR వర్తిస్తుంది. కస్టమర్ ఛార్జ్ ₹0.`;
          }
        }
      }
    }
  }

  const isMdrApplicable = estimatedMdr > 0;
  const estimatedMerchantSettlement = roundToDecimals(safeAmount - estimatedMdr, 2);

  return {
    amount: safeAmount,
    transactionType: input.transactionType,
    paymentInstrument,
    merchantCategory: categoryKey,
    merchantCategoryLabelEn: categoryMeta?.labelEn,
    merchantCategoryLabelTe: categoryMeta?.labelTe,
    customerCharge,
    customerTotalPays,
    applicableMdrRatePercent,
    rawMdrAmount,
    estimatedMdr,
    isFlatFee,
    flatFeeAmount,
    mdrCapApplied,
    mdrCapAmount,
    estimatedMerchantSettlement,
    isMdrApplicable,
    appliedRuleId: matchedRule.id,
    ruleEffectiveFrom: matchedRule.effectiveFrom,
    ruleEffectiveUntil: matchedRule.effectiveUntil,
    isFutureFrameworkActive: isFuture,
    explanationEn,
    explanationTe,
    sourceNotice: `${matchedRule.source} (${matchedRule.sourceDate})`,
  };
}

/**
 * Calculates business projections for merchants (monthly/annual settlement estimates).
 */
export function calculateMerchantProjections(input: MerchantProjectionInput): MerchantProjectionResult {
  const safeAvg = Math.max(0, isNaN(input.averageAmount) ? 0 : input.averageAmount);
  const safeDaily = Math.max(0, isNaN(input.dailyTransactions) ? 0 : input.dailyTransactions);
  const safeDays = Math.max(1, isNaN(input.businessDaysPerMonth) ? 30 : input.businessDaysPerMonth);

  const monthlyTransactions = Math.round(safeDaily * safeDays);
  const monthlySalesVolume = roundToDecimals(monthlyTransactions * safeAvg, 2);

  // Single transaction MDR result
  const singleTxnResult = calculateUpiMdr({
    amount: safeAvg,
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
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
