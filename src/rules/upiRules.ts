/**
 * Central Regulatory Configuration for UPI MDR Rules
 * Sourced strictly from:
 * 1. Reserve Bank of India (RBI)
 * 2. National Payments Corporation of India (NPCI) Circulars (including RuPay Credit Card on UPI & PPI guidelines)
 * 3. Department of Financial Services (DFS), Ministry of Finance, Government of India
 * 4. Press Information Bureau (PIB), Government of India
 *
 * Sourced: 30 September 2026
 * Framework Effective Date: 15 October 2026
 */

import {
  MerchantCategoryConfig,
  MerchantCategoryKey,
  PaymentInstrument,
  PaymentInstrumentConfig,
  TransactionType,
  UpiRegulatoryRule,
} from '../types/upi';

export const UPI_REGULATORY_META = {
  lastUpdated: '30 September 2026',
  lastUpdatedTe: '30 సెప్టెంబర్ 2026',
  futureEffectiveDate: '2026-10-15',
  sources: 'Reserve Bank of India (RBI) / National Payments Corporation of India (NPCI) / Ministry of Finance (DFS) / PIB',
  sourcesTe: 'భారత రిజర్వ్ బ్యాంక్ (RBI) / NPCI / ఆర్థిక మంత్రిత్వ శాఖ (DFS) / PIB',
  educationalDisclaimerEn:
    'This calculator is an independent simulation tool for educational and informational purposes. Actual charges may vary based on merchant category code (MCC), acquiring bank/payment aggregator agreements, payment instrument used, and operational circulars issued by NPCI and RBI. It is not an official tool of RBI, NPCI, or the Government of India.',
  educationalDisclaimerTe:
    'ఈ కాలిక్యులేటర్ విద్యా మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే రూపొందించబడిన స్వతంత్ర సాధనం. వాస్తవ ఛార్జీలు వ్యాపారి కేటగిరీ (MCC), బ్యాంక్ లేదా పేమెంట్ గేట్‌వే ఒప్పందాలు మరియు NPCI/RBI సర్క్యులర్ల ప్రకారం మారవచ్చు. ఇది RBI, NPCI లేదా భారత ప్రభుత్వ అధికారిక సాధనం కాదు.',
  disclaimerEn:
    'This calculator is an independent simulation tool for educational and informational purposes. Sourced from official RBI/NPCI notifications.',
  disclaimerTe:
    'ఈ కాలిక్యులేటర్ విద్యా మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే రూపొందించబడిన స్వతంత్ర సాధనం.',
  officialCircularsUrl: 'https://www.npci.org.in/what-we-do/upi/circulars',
  officialLinks: [
    { label: 'NPCI UPI Circulars (Official Listing)', url: 'https://www.npci.org.in/what-we-do/upi/circulars' },
    { label: 'Department of Financial Services (DFS) MDR FAQ', url: 'https://financialservices.gov.in/' },
    { label: 'Government/PIB UPI MDR Explanation', url: 'https://pib.gov.in/' },
  ],
  independentStatementEn:
    'This is an independent tool and is not affiliated with, endorsed by, or operated by RBI, NPCI or the Government of India.',
  independentStatementTe:
    'ఇది ఒక స్వతంత్ర సాధనం మరియు RBI, NPCI లేదా భారత ప్రభుత్వంతో ఎటువంటి అధికారిక సంబంధం లేదా ఆమోదం లేదు.',
};

export const PAYMENT_INSTRUMENTS: PaymentInstrumentConfig[] = [
  {
    key: 'bank_account',
    labelEn: 'Bank Account UPI (Standard)',
    labelTe: 'బ్యాంక్ ఖాతా UPI (సాధారణం)',
    shortDescEn: 'Direct bank-to-bank UPI via Google Pay, PhonePe, Paytm, BHIM, etc.',
    shortDescTe: 'బ్యాంక్ నుండి నేరుగా బ్యాంక్‌కు బదిలీ (Google Pay, PhonePe, Paytm, BHIM).',
    regulatoryNoteEn: '≤ ₹2,000 is 100% Free. Above ₹2,000: 0.40% on standard P2M (capped at ₹300), flat ₹5 on essential services, 0% on P2PM small merchants.',
  },
  {
    key: 'rupay_credit_card',
    labelEn: 'RuPay Credit Card on UPI',
    labelTe: 'రూపే క్రెడిట్ కార్డ్ UPI (RuPay CC)',
    shortDescEn: 'Credit card linked to UPI app (NPCI Circular on RuPay CC on UPI).',
    shortDescTe: 'UPI యాప్‌కు లింక్ చేయబడిన రూపే క్రెడిట్ కార్డ్ (NPCI నిబంధనలు).',
    regulatoryNoteEn: 'Nil MDR (0%) for transactions up to ₹2,000 & small offline merchants. For > ₹2,000 at regular merchants, standard credit card MDR (~2.0%) applies. Customer fee is strictly ₹0.',
  },
  {
    key: 'ppi_wallet',
    labelEn: 'Prepaid Wallet / PPI on UPI',
    labelTe: 'వాలెట్ / PPI UPI (Paytm/PhonePe Wallet)',
    shortDescEn: 'Wallet balance scanned on merchant QR (NPCI PPI Interchange Circular).',
    shortDescTe: 'వ్యాపారి QR కోడ్ వద్ద వాలెట్ బ్యాలెన్స్ ద్వారా చెల్లింపు.',
    regulatoryNoteEn: '0% fee for transactions ≤ ₹2,000 and offline small merchants. Up to 1.10% interchange for regular merchants > ₹2,000. Customer fee is ₹0.',
  },
];

export const MERCHANT_CATEGORIES: MerchantCategoryConfig[] = [
  {
    key: 'regular_merchant',
    labelEn: 'Normal P2M Merchant / Retail (0.40%, Cap ₹300)',
    labelTe: 'సాధారణ దుకాణం / వాణిజ్య వ్యాపారి (0.40%, గరిష్ట పరిమితి ₹300)',
    descriptionEn: 'Standard retail stores, apparel, consumer electronics, supermarkets, dining restaurants.',
    descriptionTe: 'రిటైల్ బట్టల దుకాణాలు, ఎలక్ట్రానిక్స్, హోటళ్లు/రెస్టారెంట్లు, సూపర్ మార్కెట్లు.',
    typicalExamplesEn: 'Retail stores, clothing, electronics, dining restaurants, commercial outlets',
    typicalExamplesTe: 'బట్టల షాపులు, రెస్టారెంట్లు, హార్డ్‌వేర్, ఎలక్ట్రానిక్స్, రిటైల్ స్టోర్స్',
  },
  {
    key: 'small_merchant',
    labelEn: 'Small Merchant / P2PM QR (≤ ₹1 Lakh/month: 0% Free)',
    labelTe: 'చిన్న వ్యాపారులు / వీధి వ్యాపారులు (నెలకు ≤ ₹1 లక్ష: 0% ఉచితం)',
    descriptionEn: 'Qualifying small merchants under P2PM framework receiving up to ₹1 Lakh per month through UPI QR.',
    descriptionTe: 'P2PM విధానం కింద నెలకు ₹1 లక్ష లోపు UPI QR ద్వారా స్వీకరించే చిన్న వ్యాపారులు/కిరాణా దుకాణాలు.',
    typicalExamplesEn: 'Neighbourhood Kirana shops, tea stalls, vegetable vendors, street kiosks',
    typicalExamplesTe: 'స్థానిక కిరాణా, టీ కొట్లు, కూరగాయల బండ్లు, చిన్న వ్యాపారాలు',
  },
  {
    key: 'essential_services',
    labelEn: 'Essential & Thin-Margin (Railways, Fuel, Telecom: Flat ₹5)',
    labelTe: 'నిత్యావసరాలు, ఇంధనం & రైల్వేలు (ఫ్లాట్ ₹5 ఫీజు)',
    descriptionEn: 'Railways, telecommunications, insurance, fuel pumps, agricultural inputs, and utilities.',
    descriptionTe: 'రైల్వేలు, టెలికాం, ఇన్సూరెన్స్, పెట్రోల్ బంకులు, ఎరువులు/విత్తనాలు, విద్యుత్ బిల్లులు.',
    typicalExamplesEn: 'Petrol pumps, rail ticket bookings, telecom recharges, utility bills, fertilizers',
    typicalExamplesTe: 'పెట్రోల్ బంకులు, రైలు టికెట్లు, ఫోన్ రీఛార్జ్లు, కరెంట్ బిల్లులు, వ్యవసాయ ఉత్పత్తులు',
  },
  {
    key: 'capital_markets',
    labelEn: 'Capital Markets (Mutual Funds, Stocks: 0.02%, Cap ₹300)',
    labelTe: 'క్యాపిటల్ మార్కెట్లు (మ్యూచువల్ ఫండ్స్, షేర్లు: 0.02%, గరిష్ట పరిమితి ₹300)',
    descriptionEn: 'Mutual funds investments, securities, stockbrokers and authorized depository dealers.',
    descriptionTe: 'మ్యూచువల్ ఫండ్ పెట్టుబడులు, స్టాక్ బ్రోకర్లు, సెక్యూరిటీస్ కొనుగోళ్లు.',
    typicalExamplesEn: 'Mutual fund investments, stock trading apps, AMC subscriptions',
    typicalExamplesTe: 'మ్యూచువల్ ఫండ్స్, డిమాట్ ట్రేడింగ్, షేర్ బ్రోకర్లు',
  },
];

export const UPI_RULES: UpiRegulatoryRule[] = [
  // -------------------------------------------------------------
  // PATH 1: PERSON TO PERSON (P2P) - Always ₹0 MDR across all dates & instruments
  // -------------------------------------------------------------
  {
    id: 'p2p_active_rule',
    titleEn: 'Person to Person (P2P) Transfer',
    titleTe: 'వ్యక్తి నుండి వ్యక్తికి చెల్లింపు (P2P)',
    effectiveFrom: '2020-01-01',
    effectiveUntil: null,
    transactionType: 'P2P',
    threshold: 0,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'RBI / NPCI UPI Guidelines & Ministry of Finance',
    sourceDate: '30 September 2026',
    ruleSummaryEn: 'Person-to-Person transfers between individuals are 100% free with 0% MDR.',
    ruleSummaryTe: 'వ్యక్తుల మధ్య జరిగే బదిలీలకు ఎటువంటి MDR లేదా ఛార్జీలు ఉండవు (100% ఉచితం).',
    reasonEn:
      'Person-to-Person (P2P) transfers are 100% free with zero MDR at any amount for both sender and receiver.',
    reasonTe:
      'P2P బదిలీలకు ఏ మొత్తానికైనా 100% ఉచితం. పంపేవారికి లేదా స్వీకరించేవారికి ఎటువంటి MDR ఛార్జీలు వర్తించవు.',
  },

  // -------------------------------------------------------------
  // CURRENT RULES (Until 14 October 2026) - Bank UPI (Section 10A 0% MDR)
  // -------------------------------------------------------------
  {
    id: 'current_bank_small_merchant',
    titleEn: 'Bank UPI - Small Merchant (Current Framework)',
    titleTe: 'బ్యాంక్ UPI - చిన్న వ్యాపారి (ప్రస్తుత నిబంధనలు)',
    effectiveFrom: '2020-01-01',
    effectiveUntil: '2026-10-14',
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'small_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'Ministry of Finance (DFS) Section 10A PSS Act',
    sourceDate: 'Until 14 October 2026',
    ruleSummaryEn: '0% MDR active under Ministry of Finance zero-MDR directive.',
    ruleSummaryTe: 'ఆర్థిక మంత్రిత్వ శాఖ జీరో-MDR ఉత్తర్వుల ప్రకారం 0% MDR.',
    reasonEn: 'Under the current rules until 14 October 2026, standard bank UPI has 0% MDR.',
    reasonTe: '14 అక్టోబర్ 2026 వరకు ప్రామాణిక బ్యాంక్ UPI కి 0% MDR వర్తిస్తుంది.',
  },
  {
    id: 'current_bank_regular_merchant',
    titleEn: 'Bank UPI - Normal Merchant (Current Framework)',
    titleTe: 'బ్యాంక్ UPI - సాధారణ వ్యాపారి (ప్రస్తుత నిబంధనలు)',
    effectiveFrom: '2020-01-01',
    effectiveUntil: '2026-10-14',
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'regular_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'Ministry of Finance (DFS) Section 10A PSS Act',
    sourceDate: 'Until 14 October 2026',
    ruleSummaryEn: '0% MDR active under Ministry of Finance zero-MDR directive.',
    ruleSummaryTe: 'ఆర్థిక మంత్రిత్వ శాఖ జీరో-MDR ఉత్తర్వుల ప్రకారం 0% MDR.',
    reasonEn: 'Under the current rules until 14 October 2026, standard bank UPI has 0% MDR.',
    reasonTe: '14 అక్టోబర్ 2026 వరకు ప్రామాణిక బ్యాంక్ UPI కి 0% MDR వర్తిస్తుంది.',
  },
  {
    id: 'current_bank_essential_services',
    titleEn: 'Bank UPI - Essential Services (Current Framework)',
    titleTe: 'బ్యాంక్ UPI - నిత్యావసరాలు (ప్రస్తుత నిబంధనలు)',
    effectiveFrom: '2020-01-01',
    effectiveUntil: '2026-10-14',
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'essential_services',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'Ministry of Finance (DFS) Section 10A PSS Act',
    sourceDate: 'Until 14 October 2026',
    ruleSummaryEn: '0% MDR active under Ministry of Finance zero-MDR directive.',
    ruleSummaryTe: 'ఆర్థిక మంత్రిత్వ శాఖ జీరో-MDR ఉత్తర్వుల ప్రకారం 0% MDR.',
    reasonEn: 'Under the current rules until 14 October 2026, standard bank UPI has 0% MDR.',
    reasonTe: '14 అక్టోబర్ 2026 వరకు ప్రామాణిక బ్యాంక్ UPI కి 0% MDR వర్తిస్తుంది.',
  },
  {
    id: 'current_bank_capital_markets',
    titleEn: 'Bank UPI - Capital Markets (Current Framework)',
    titleTe: 'బ్యాంక్ UPI - క్యాపిటల్ మార్కెట్లు (ప్రస్తుత నిబంధనలు)',
    effectiveFrom: '2020-01-01',
    effectiveUntil: '2026-10-14',
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'capital_markets',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'Ministry of Finance (DFS) Section 10A PSS Act',
    sourceDate: 'Until 14 October 2026',
    ruleSummaryEn: '0% MDR active under Ministry of Finance zero-MDR directive.',
    ruleSummaryTe: 'ఆర్థిక మంత్రిత్వ శాఖ జీరో-MDR ఉత్తర్వుల ప్రకారం 0% MDR.',
    reasonEn: 'Under the current rules until 14 October 2026, standard bank UPI has 0% MDR.',
    reasonTe: '14 అక్టోబర్ 2026 వరకు ప్రామాణిక బ్యాంక్ UPI కి 0% MDR వర్తిస్తుంది.',
  },

  // -------------------------------------------------------------
  // NEW OFFICIAL RULES (Effective 15 October 2026) - Bank UPI
  // -------------------------------------------------------------
  // Path 2: Normal P2M Merchant (<= 2000: 0%, > 2000: 0.40%, Cap: ₹300)
  {
    id: 'new_bank_regular_merchant',
    titleEn: 'Bank UPI - Normal P2M Merchant (Effective 15 Oct 2026)',
    titleTe: 'బ్యాంక్ UPI - సాధారణ వ్యాపారి (15 అక్టోబర్ 2026 నుండి)',
    effectiveFrom: '2026-10-15',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'regular_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.004, // 0.40%
    maximumMdrCap: 300, // Capped at ₹300 (at ₹75,000+)
    customerCharge: 0,
    isExempt: false,
    source: 'RBI / NPCI Revised P2M Framework (PIB & DFS FAQ)',
    sourceDate: 'Effective 15 October 2026',
    ruleSummaryEn: 'Up to ₹2,000: ₹0. Above ₹2,000: 0.40% capped at ₹300.',
    ruleSummaryTe: '₹2,000 వరకు ₹0. ₹2,000 దాటితే 0.40% (గరిష్ట పరిమితి ₹300).',
    reasonEn:
      'Effective 15 October 2026: Transactions up to ₹2,000 are 0% MDR. Above ₹2,000, MDR is 0.40% on entire amount, capped at ₹300 for ₹75,000 and above. Customer fee is strictly ₹0.',
    reasonTe:
      '15 అక్టోబర్ 2026 నుండి: ₹2,000 వరకు 0% MDR. ₹2,000 మించినప్పుడు పూర్తి మొత్తంపై 0.40% MDR, ₹75,000 దాటినప్పుడు గరిష్ట పరిమితి ₹300. కస్టమర్ ఛార్జ్ ₹0.',
  },

  // Path 3: Essential / Thin-margin Sectors (<= 2000: 0%, > 2000: Flat ₹5 MDR)
  {
    id: 'new_bank_essential_services',
    titleEn: 'Bank UPI - Essential Services & Fuel (Effective 15 Oct 2026)',
    titleTe: 'బ్యాంక్ UPI - నిత్యావసరాలు & ఇంధనం (15 అక్టోబర్ 2026 నుండి)',
    effectiveFrom: '2026-10-15',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'essential_services',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0, // Flat fee applied
    isFlatFee: true,
    flatFeeAmount: 5,
    maximumMdrCap: 5,
    customerCharge: 0,
    isExempt: false,
    source: 'RBI / NPCI Revised P2M Framework (PIB & DFS FAQ)',
    sourceDate: 'Effective 15 October 2026',
    ruleSummaryEn: 'Up to ₹2,000: ₹0. Above ₹2,000: Flat ₹5 MDR.',
    ruleSummaryTe: '₹2,000 వరకు ₹0. ₹2,000 దాటితే ఫ్లాట్ ₹5 MDR.',
    reasonEn:
      'Effective 15 October 2026: Railways, telecom, fuel, insurance, and utilities have a flat ₹5 MDR for transactions exceeding ₹2,000. Customer fee is strictly ₹0.',
    reasonTe:
      '15 అక్టోబర్ 2026 నుండి: రైల్వేలు, టెలికాం, పెట్రోల్/డీజిల్, ఇన్సూరెన్స్ రంగాలకు ₹2,000 దాటిన లావాదేవీలపై ఫ్లాట్ ₹5 MDR వర్తిస్తుంది. కస్టమర్ ఛార్జ్ ₹0.',
  },

  // Path 4: Capital Markets (<= 2000: 0%, > 2000: 0.02%, Cap: ₹300)
  {
    id: 'new_bank_capital_markets',
    titleEn: 'Bank UPI - Capital Markets (Effective 15 Oct 2026)',
    titleTe: 'బ్యాంక్ UPI - క్యాపిటల్ మార్కెట్లు (15 అక్టోబర్ 2026 నుండి)',
    effectiveFrom: '2026-10-15',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'capital_markets',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.0002, // 0.02%
    maximumMdrCap: 300,
    customerCharge: 0,
    isExempt: false,
    source: 'RBI / NPCI Revised P2M Framework (PIB & DFS FAQ)',
    sourceDate: 'Effective 15 October 2026',
    ruleSummaryEn: 'Up to ₹2,000: ₹0. Above ₹2,000: 0.02% capped at ₹300.',
    ruleSummaryTe: '₹2,000 వరకు ₹0. ₹2,000 దాటితే 0.02% (గరిష్ట పరిమితి ₹300).',
    reasonEn:
      'Effective 15 October 2026: Mutual funds, securities, and stockbrokers have a concessional 0.02% MDR, capped at ₹300. Customer fee is strictly ₹0.',
    reasonTe:
      '15 అక్టోబర్ 2026 నుండి: మ్యూచువల్ ఫండ్స్, షేర్లు మరియు సెక్యూరిటీస్ చెల్లింపులకు 0.02% MDR వర్తిస్తుంది (గరిష్ట పరిమితి ₹300). కస్టమర్ ఛార్జ్ ₹0.',
  },

  // Path 5: Small Merchants / P2PM (0% MDR across all amounts within ₹1 Lakh/month)
  {
    id: 'new_bank_small_merchant',
    titleEn: 'Bank UPI - Small Merchant / P2PM QR (Effective 15 Oct 2026)',
    titleTe: 'బ్యాంక్ UPI - చిన్న వ్యాపారి / P2PM QR (15 అక్టోబర్ 2026 నుండి)',
    effectiveFrom: '2026-10-15',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'bank_account',
    merchantCategory: 'small_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'RBI / NPCI Revised P2M Framework (PIB & DFS FAQ)',
    sourceDate: 'Effective 15 October 2026',
    ruleSummaryEn: '0% MDR for qualifying small merchants receiving up to ₹1 Lakh/month under P2PM QR.',
    ruleSummaryTe: 'P2PM QR కింద నెలకు ₹1 లక్ష వరకు లావాదేవీలు పొందే చిన్న వ్యాపారులకు 0% పూర్తి ఉచితం.',
    reasonEn:
      'Qualifying small merchants receiving up to ₹1 Lakh per month via UPI QR under P2PM continue to get 0% MDR on all transactions. Customer fee is strictly ₹0.',
    reasonTe:
      'P2PM నిబంధనల ప్రకారం నెలకు ₹1 లక్ష వరకు UPI QR చెల్లింపులు అందుకునే చిన్న వ్యాపారులకు అన్ని లావాదేవీలపై 0% MDR (పూర్తి ఉచితం). కస్టమర్ ఛార్జ్ ₹0.',
  },

  // -------------------------------------------------------------
  // RUPAY CREDIT CARD ON UPI (NPCI Circular on RuPay CC on UPI)
  // -------------------------------------------------------------
  {
    id: 'rupay_cc_small_merchant',
    titleEn: 'RuPay CC on UPI - Small Merchant / Offline QR',
    titleTe: 'రూపే క్రెడిట్ కార్డ్ UPI - చిన్న వ్యాపారి',
    effectiveFrom: '2022-10-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'rupay_credit_card',
    merchantCategory: 'small_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'NPCI Circular on RuPay Credit Card on UPI (Nil MDR for Small Offline Merchants)',
    sourceDate: 'October 2022 onwards',
    ruleSummaryEn: 'Nil MDR (0%) for qualifying small offline merchants on RuPay Credit Card on UPI.',
    ruleSummaryTe: 'చిన్న వ్యాపారులకు రూపే క్రెడిట్ కార్డ్ UPI చెల్లింపులపై 0% MDR (పూర్తి ఉచితం).',
    reasonEn:
      'As per NPCI guidelines for RuPay Credit Card on UPI, small merchants receiving payments on UPI QR are exempt from MDR (0% Nil MDR). Customer fee is strictly ₹0.',
    reasonTe:
      'NPCI మార్గదర్శకాల ప్రకారం, UPI QR ద్వారా చెల్లింపులు స్వీకరించే చిన్న వ్యాపారులకు రూపే క్రెడిట్ కార్డ్ చెల్లింపులపై 0% Nil MDR వర్తిస్తుంది. కస్టమర్‌పై ఎలాంటి ఛార్జీ ఉండదు.',
  },
  {
    id: 'rupay_cc_regular_merchant',
    titleEn: 'RuPay CC on UPI - Normal Merchant',
    titleTe: 'రూపే క్రెడిట్ కార్డ్ UPI - సాధారణ వ్యాపారి',
    effectiveFrom: '2022-10-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'rupay_credit_card',
    merchantCategory: 'regular_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0, // Nil MDR up to ₹2,000 as per NPCI circular!
    rateAboveThreshold: 0.02, // 2.0% standard credit card MDR above ₹2,000
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular on RuPay Credit Card on UPI (Nil MDR ≤ ₹2,000; Standard CC MDR > ₹2,000)',
    sourceDate: 'October 2022 onwards',
    ruleSummaryEn: 'Up to ₹2,000: Nil MDR (0%). Above ₹2,000: Standard ~2.0% Credit Card MDR applies to merchant.',
    ruleSummaryTe: '₹2,000 వరకు Nil MDR (0%). ₹2,000 దాటితే సాధారణ ~2.0% క్రెడిట్ కార్డ్ MDR వ్యాపారికి వర్తిస్తుంది.',
    reasonEn:
      'Under NPCI RuPay-credit-card-on-UPI rules, transactions up to ₹2,000 have Nil MDR (0%). For transactions exceeding ₹2,000 at normal merchants, standard credit card MDR (~2.0%) is deducted from the merchant payout. Crucially, customer charge is strictly ₹0.',
    reasonTe:
      'NPCI నిబంధనల ప్రకారం రూపే క్రెడిట్ కార్డ్ లావాదేవీలకు ₹2,000 వరకు Nil MDR (0%). ₹2,000 దాటినప్పుడు వ్యాపారికి ~2.0% MDR కట్ అవుతుంది. కస్టమర్ ఎటువంటి అదనపు రుసుము చెల్లించరు (కస్టమర్ ఛార్జ్ ₹0).',
  },
  {
    id: 'rupay_cc_essential_services',
    titleEn: 'RuPay CC on UPI - Essential Services & Fuel',
    titleTe: 'రూపే క్రెడిట్ కార్డ్ UPI - నిత్యావసరాలు & ఇంధనం',
    effectiveFrom: '2022-10-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'rupay_credit_card',
    merchantCategory: 'essential_services',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.015, // 1.5% concessional credit card MDR
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular on RuPay Credit Card on UPI (Special Category Interchange)',
    sourceDate: 'October 2022 onwards',
    ruleSummaryEn: 'Up to ₹2,000: Nil MDR (0%). Above ₹2,000: ~1.5% concessional CC MDR.',
    ruleSummaryTe: '₹2,000 వరకు 0%. ₹2,000 దాటితే ~1.5% రాయితీ MDR.',
    reasonEn:
      'Transactions up to ₹2,000 have Nil MDR (0%). Above ₹2,000, concessional CC MDR (~1.5%) applies to the merchant. Customer pays strictly ₹0 extra.',
    reasonTe:
      '₹2,000 వరకు 0% ఫీజు. ₹2,000 దాటితే రాయితీ MDR (~1.5%) వ్యాపారికి వర్తిస్తుంది. కస్టమర్‌కు ఎలాంటి అదనపు రుసుము ఉండదు.',
  },
  {
    id: 'rupay_cc_capital_markets',
    titleEn: 'RuPay CC on UPI - Capital Markets (Mutual Funds & Stocks)',
    titleTe: 'రూపే క్రెడిట్ కార్డ్ UPI - క్యాపిటల్ మార్కెట్లు (మ్యూచువల్ ఫండ్స్ & షేర్లు)',
    effectiveFrom: '2022-10-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'rupay_credit_card',
    merchantCategory: 'capital_markets',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.0002, // 0.02%
    maximumMdrCap: 300, // Capped at ₹300
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular & Capital Markets Guidelines',
    sourceDate: 'October 2022 onwards',
    ruleSummaryEn: 'Up to ₹2,000: Nil MDR (0%). Above ₹2,000: 0.02% capped at ₹300.',
    ruleSummaryTe: '₹2,000 వరకు 0%. ₹2,000 దాటితే 0.02% (గరిష్ట పరిమితి ₹300).',
    reasonEn:
      'Capital Markets (Mutual Funds, Stocks, Securities) have a concessional 0.02% MDR, capped at ₹300. Customer pays ₹0 extra.',
    reasonTe:
      'క్యాపిటల్ మార్కెట్లకు (మ్యూచువల్ ఫండ్స్, షేర్లు) 0.02% MDR వర్తిస్తుంది (గరిష్ట పరిమితి ₹300). కస్టమర్‌కు ఎలాంటి ఛార్జీ ఉండదు.',
  },

  // -------------------------------------------------------------
  // PREPAID PAYMENT INSTRUMENTS (PPI / Wallets on UPI QR) - NPCI Circular
  // -------------------------------------------------------------
  {
    id: 'ppi_wallet_small_merchant',
    titleEn: 'Wallet/PPI on UPI - Small Merchant (NPCI Circular)',
    titleTe: 'వాలెట్/PPI UPI - చిన్న వ్యాపారి (NPCI సర్క్యులర్)',
    effectiveFrom: '2023-04-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'ppi_wallet',
    merchantCategory: 'small_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0,
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: true,
    source: 'NPCI Circular on PPI Interchange on UPI',
    sourceDate: 'Active since April 2023',
    ruleSummaryEn: '0% fee for small merchants accepting wallet UPI payments.',
    ruleSummaryTe: 'చిన్న వ్యాపారులకు వాలెట్ UPI చెల్లింపులపై 0% ఛార్జ్.',
    reasonEn:
      'Offline small merchants under P2PM are exempt from wallet interchange fees. Customer pays strictly ₹0 extra.',
    reasonTe:
      'చిన్న వ్యాపారులకు వాలెట్ UPI చెల్లింపులపై పూర్తి మినహాయింపు (0% ఫీజు) ఉంది. కస్టమర్‌కు ఎలాంటి అదనపు ఛార్జీ ఉండదు.',
  },
  {
    id: 'ppi_wallet_regular_merchant',
    titleEn: 'Wallet/PPI on UPI - Normal Merchant (NPCI Circular)',
    titleTe: 'వాలెట్/PPI UPI - సాధారణ వ్యాపారి (NPCI సర్క్యులర్)',
    effectiveFrom: '2023-04-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'ppi_wallet',
    merchantCategory: 'regular_merchant',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.011, // 1.10%
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular on PPI Interchange on UPI',
    sourceDate: 'Active since April 2023',
    ruleSummaryEn: 'Free up to ₹2,000. Above ₹2,000, up to 1.10% interchange applies.',
    ruleSummaryTe: '₹2,000 వరకు ఉచితం. ₹2,000 దాటితే 1.10% వరకు ఇంటర్‌ఛేంజ్ ఫీజు.',
    reasonEn:
      'Transactions above ₹2,000 using prepaid wallets on merchant QR incur 1.10% interchange fee. Customer pays strictly ₹0 extra.',
    reasonTe:
      'వాలెట్ ద్వారా ₹2,000 మించిన లావాదేవీలకు 1.10% రుసుము వర్తిస్తుంది. కస్టమర్ ఎటువంటి అదనపు రుసుము చెల్లించరు.',
  },
  {
    id: 'ppi_wallet_essential_services',
    titleEn: 'Wallet/PPI on UPI - Essential Services (NPCI Circular)',
    titleTe: 'వాలెట్/PPI UPI - నిత్యావసరాలు (NPCI సర్క్యులర్)',
    effectiveFrom: '2023-04-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'ppi_wallet',
    merchantCategory: 'essential_services',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.005, // 0.50%
    maximumMdrCap: null,
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular on PPI Interchange on UPI',
    sourceDate: 'Active since April 2023',
    ruleSummaryEn: 'Free up to ₹2,000. Above ₹2,000, 0.50% interchange for fuel & utilities.',
    ruleSummaryTe: '₹2,000 వరకు ఉచితం. ₹2,000 దాటితే ఇంధనం, నిత్యావసరాలపై 0.50% ఫీజు.',
    reasonEn:
      'Fuel and utility transactions above ₹2,000 via prepaid wallet have 0.50% interchange. Customer pays strictly ₹0 extra.',
    reasonTe:
      'ఇంధనం మరియు యుటిలిటీస్ లావాదేవీలకు వాలెట్ ద్వారా ₹2,000 దాటినప్పుడు 0.50% రుసుము. కస్టమర్‌కు ₹0 ఛార్జ్.',
  },
  {
    id: 'ppi_wallet_capital_markets',
    titleEn: 'Wallet/PPI on UPI - Capital Markets (Mutual Funds & Stocks)',
    titleTe: 'వాలెట్/PPI UPI - క్యాపిటల్ మార్కెట్లు (మ్యూచువల్ ఫండ్స్ & షేర్లు)',
    effectiveFrom: '2023-04-01',
    effectiveUntil: null,
    transactionType: 'P2M',
    paymentInstrument: 'ppi_wallet',
    merchantCategory: 'capital_markets',
    threshold: 2000,
    rateBelowOrEqualThreshold: 0,
    rateAboveThreshold: 0.0002, // 0.02%
    maximumMdrCap: 300, // Capped at ₹300
    customerCharge: 0,
    isExempt: false,
    source: 'NPCI Circular on PPI Interchange & Capital Markets Framework',
    sourceDate: 'Active',
    ruleSummaryEn: 'Up to ₹2,000: ₹0. Above ₹2,000: 0.02% capped at ₹300.',
    ruleSummaryTe: '₹2,000 వరకు ₹0. ₹2,000 దాటితే 0.02% (గరిష్ట పరిమితి ₹300).',
    reasonEn:
      'Capital Markets (Mutual Funds, Stocks, Securities) have a concessional 0.02% rate, capped at ₹300. Customer fee is strictly ₹0.',
    reasonTe:
      'క్యాపిటల్ మార్కెట్లకు (మ్యూచువల్ ఫండ్స్, షేర్లు) 0.02% రేటు వర్తిస్తుంది (గరిష్ట పరిమితి ₹300). కస్టమర్‌కు ₹0 ఛార్జ్.',
  },
];

export function isFutureFrameworkActive(evaluationDate?: string): boolean {
  const target = evaluationDate || new Date().toISOString().slice(0, 10);
  return target >= UPI_REGULATORY_META.futureEffectiveDate;
}

export function findApplicableRule(
  transactionType: TransactionType,
  paymentInstrument: PaymentInstrument = 'bank_account',
  merchantCategory: MerchantCategoryKey = 'regular_merchant',
  evaluationDate?: string
): UpiRegulatoryRule {
  const targetDate = evaluationDate || new Date().toISOString().slice(0, 10);

  if (transactionType === 'P2P') {
    return UPI_RULES.find((r) => r.transactionType === 'P2P') || UPI_RULES[0];
  }

  const matchingRule = UPI_RULES.find((rule) => {
    if (rule.transactionType !== 'P2M') return false;
    if (rule.paymentInstrument !== paymentInstrument) return false;
    if (rule.merchantCategory !== merchantCategory) return false;

    const startsOk = rule.effectiveFrom <= targetDate;
    const endsOk = rule.effectiveUntil === null || rule.effectiveUntil >= targetDate;
    return startsOk && endsOk;
  });

  if (matchingRule) return matchingRule;

  return UPI_RULES.find(
    (r) =>
      r.transactionType === 'P2M' &&
      r.paymentInstrument === paymentInstrument &&
      r.merchantCategory === 'regular_merchant'
  ) || UPI_RULES[0];
}
