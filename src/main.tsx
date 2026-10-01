import { createRoot } from 'react-dom/client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Store,
  Languages,
  Download,
  Check,
  User,
  ExternalLink,
  CreditCard,
  Wallet,
  AlertTriangle,
  Building2,
  HelpCircle,
  TrendingDown,
  Info,
} from 'lucide-react';
import './index.css';
import { calculateUpiMdr, formatCurrencyINR } from './calculator/calculateMdr';
import { MerchantCategoryKey, PaymentInstrument, TransactionType } from './types/upi';
import { REGULATORY_FRAMEWORKS, UPI_REGULATORY_META } from './rules/upiRules';

// =========================================================================
// 1. LANGUAGES (9 Indian Languages with Odia / Oriya clearly labeled)
// =========================================================================
export type SupportedLanguage = 'en' | 'te' | 'hi' | 'mr' | 'gu' | 'ta' | 'bn' | 'or' | 'kn';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'or', name: 'Odia / Oriya', nativeName: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const TRANSLATIONS: Record<SupportedLanguage, any> = {
  en: {
    appTitle: 'UPI Charges & Settlement Calculator',
    subtitle: 'Official RBI Zero-MDR Directive & NPCI Circular Framework',
    statutoryBannerTitle: 'Bank Account UPI: Official 0% Zero-MDR Framework',
    statutoryBannerSubtext:
      'Under Section 10A of the Payment & Settlement Systems Act and Government/RBI directives, standard bank-account UPI incurs 0% MDR for merchants and ₹0 fee for customers at any amount.',
    installApp: 'Install App',
    selectLanguage: 'Language',
    disclaimerBannerTitle: 'Informational & Educational Simulation Tool',
    disclaimerBannerText:
      'Bank-account UPI is legally 0% MDR under Section 10A PSS Act. For PPI Wallets and RuPay Credit Cards, charges depend on NPCI interchange rules and merchant acquiring contracts.',
    txnStepTitle: '1. Select Transaction & Payment Instrument',
    amountLabel: 'Transaction Amount (in ₹)',
    amountPlaceholder: 'Enter amount (e.g. 5000)',
    txnTypeLabel: 'Transaction Type',
    p2pPersonToPerson: 'P2P (Person to Person Transfer)',
    p2mMerchant: 'P2M (Merchant / Shop Payment)',
    paymentModeLabel: 'Payment Instrument (3 Distinct Regulatory Frameworks)',
    modeBank: 'Bank Account UPI',
    modeBankSub: 'Sec 10A PSS Act • 0% MDR',
    modeWallet: 'Prepaid Wallet / PPI',
    modeWalletSub: 'NPCI Interchange • ₹0 Customer',
    modeRupayCC: 'RuPay Credit Card',
    modeRupayCCSub: 'Nil ≤ ₹2k • Acquirer Pricing',
    merchantCatLabel: 'Merchant Category',
    catGeneral: 'General Merchant / Retail Shop',
    catSmallOffline: 'Qualifying Small Offline Merchant (Turnover ≤ ₹20 Lakhs)',
    catFuelUtilities: 'Fuel, Railways, Telecom & Utilities',
    calculationsTitle: 'Transaction Breakdown & Charge Bearer',
    formulaTitle: 'Calculation Formula',
    zeroMdrBadge: 'Statutory 0% Zero-MDR',
    ecosystemFeeBadge: 'Ecosystem Interchange Applicable',
    acquirerFeeBadge: 'Commercial Acquirer Pricing',
    boxCustomerPaid: 'Customer Scanned Amount',
    boxCustomerExtra: 'Customer Surcharge',
    boxZeroCustomer: '₹0 (Always Free)',
    boxCustomerDesc: 'Customer NEVER pays extra fee (Sec 10A PSS Act)',
    boxBankMdr: 'Statutory MDR / Ecosystem Fee',
    boxMerchantGets: 'Estimated Net Merchant Settlement',
    receiptTitle: 'Transaction Summary Receipt',
    customerScanned: 'Customer debited amount:',
    noExtraFee: 'Zero convenience fee for customer (100% free)',
    bankDeduction: 'Deduction / Interchange:',
    netShopCredit: 'Net amount credited to merchant account:',
    acquirerContractHeading: 'Important Merchant Settlement Notice:',
    officialRulesHeading: 'Regulatory Frameworks by Payment Instrument',
    rule1Title: '1. Bank Account UPI (Standard Bank-to-Bank)',
    rule1Desc:
      'Operates under the statutory zero-MDR directive (Section 10A PSS Act). No MDR is collected from merchants, and no surcharge can be charged to customers, regardless of amount.',
    rule2Title: '2. Prepaid Wallet / PPI on UPI (Paytm/PhonePe Wallet)',
    rule2Desc:
      'NPCI March 2023 Circular: Customers pay ₹0 extra. Transactions up to ₹2,000 are Nil (0%). For > ₹2,000, up to 1.10% ecosystem interchange is paid between payment providers; merchant deduction depends on acquiring contract.',
    rule3Title: '3. RuPay Credit Card on UPI',
    rule3Desc:
      'NPCI Operating Circular: Customer surcharge is strictly ₹0. Transactions up to ₹2,000 for qualifying small offline merchants have Nil MDR (0%). Beyond ₹2,000, commercial credit card MDR is set by the acquiring bank (~1.5% - 2.0%).',
    rule4Title: '4. Person-to-Person (P2P) Transfers',
    rule4Desc:
      'P2P transfers between individuals are 100% free with ₹0 fee for both sender and receiver at all amounts.',
    lastVerified: 'Regulations verified: Current 2026 Directives',
    officialSources: 'Official Government & Regulatory Directives:',
    source1: 'NPCI UPI Official Circulars',
    source2: 'NPCI FAQs on PPI-on-UPI Charges',
    source3: 'NPCI RuPay Credit Card on UPI Guidelines',
    source4: 'RBI Zero-MDR Notification (PSS Act Sec 10A)',
  },
  or: {
    appTitle: 'UPI ଶୁଳ୍କ ଏବଂ ସେଟଲମେଣ୍ଟ କ୍ୟାଲକୁଲେଟର',
    subtitle: 'RBI ସରକାରୀ ଜିରୋ-MDR ନିର୍ଦ୍ଦେଶ ଏବଂ NPCI ପରିପତ୍ର ଫ୍ରେମୱାର୍କ',
    statutoryBannerTitle: 'ବ୍ୟାଙ୍କ ଖାତା UPI: ସରକାରୀ ୦% ଜିରୋ-MDR ନିୟମ',
    statutoryBannerSubtext:
      'ପେମେଣ୍ଟ ଆଣ୍ଡ ସେଟଲମେଣ୍ଟ ସିଷ୍ଟମ୍ ଆକ୍ଟ (ସେକ୍ସନ ୧୦A) ଏବଂ RBI/ଅର୍ଥ ମନ୍ତ୍ରଣାଳୟର ନିର୍ଦ୍ଦେଶ ଅନୁଯାୟୀ, ବ୍ୟାଙ୍କ ଖାତା UPI ରେ ବ୍ୟବସାୟୀଙ୍କ ପାଇଁ ୦% MDR ଏବଂ ଗ୍ରାହକଙ୍କ ପାଇଁ ₹୦ ଶୁଳ୍କ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା।',
    installApp: 'ଆପ୍ ଇନଷ୍ଟଲ କରନ୍ତୁ',
    selectLanguage: 'ଭାଷା',
    disclaimerBannerTitle: 'ସୂଚନା ଏବଂ ଶିକ୍ଷାମୂଳକ ସାଧନ',
    disclaimerBannerText:
      'ବ୍ୟାଙ୍କ ଖାତା UPI ଚଟ୍ଟବଦ୍ଧ ଭାବେ ୦% MDR। ୱାଲେଟ୍ ଏବଂ ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ ପାଇଁ ଚାର୍ଜ NPCI ନିୟମ ଏବଂ ବ୍ୟାଙ୍କ ଚୁକ୍ତି ଉପରେ ନିର୍ଭର କରେ।',
    txnStepTitle: '୧. କାରବାର ଏବଂ ପେମେଣ୍ଟ ମାଧ୍ୟମ ଚୟନ କରନ୍ତୁ',
    amountLabel: 'କାରବାର ରାଶି (₹ ରେ)',
    amountPlaceholder: 'ରାଶି ଲେଖନ୍ତୁ (ଯଥା: 5000)',
    txnTypeLabel: 'କାରବାର ପ୍ରକାର (Transaction Type)',
    p2pPersonToPerson: 'P2P (ବ୍ୟକ୍ତିଗତ ସ୍ଥାନାନ୍ତର - ୧୦୦% ମାଗଣା)',
    p2mMerchant: 'P2M (ଦୋକାନୀ / ବ୍ୟବସାୟୀଙ୍କୁ ଦେୟ)',
    paymentModeLabel: 'ପେମେଣ୍ଟ ମାଧ୍ୟମ (Payment Instrument)',
    modeBank: 'ବ୍ୟାଙ୍କ ଖାତା UPI',
    modeBankSub: 'ସେକ୍ସନ ୧୦A • ୦% MDR',
    modeWallet: 'ପ୍ରିପେଡ୍ ୱାଲେଟ୍ / PPI',
    modeWalletSub: 'NPCI ଇଣ୍ଟରଚେଞ୍ଜ • ₹୦ ଗ୍ରାହକ',
    modeRupayCC: 'ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ',
    modeRupayCCSub: '≤ ₹୨ହଜାର ୦% • ବ୍ୟାଙ୍କ ଚାର୍ଜ',
    merchantCatLabel: 'ବ୍ୟବସାୟୀ ବର୍ଗ (Merchant Category)',
    catGeneral: 'ସାଧାରଣ ବ୍ୟବସାୟୀ / ଖୁଚୁରା ଦୋକାନ',
    catSmallOffline: 'କ୍ଷୁଦ୍ର ଅଫଲାଇନ୍ ବ୍ୟବସାୟୀ (ଟର୍ଣ୍ଣଓଭର ≤ ₹୨୦ ଲକ୍ଷ)',
    catFuelUtilities: 'ଇନ୍ଧନ, ରେଳବାଇ, ଟେଲିକମ୍ ଏବଂ ୟୁଟିଲିଟି',
    calculationsTitle: 'କାରବାର ହିସାବ ଏବଂ ଶୁଳ୍କ କିଏ ବହନ କରିବ?',
    formulaTitle: 'ଗଣନା ସୂତ୍ର (Calculation Formula)',
    zeroMdrBadge: 'ସରକାରୀ ୦% ଜିରୋ-MDR',
    ecosystemFeeBadge: 'NPCI ଇଣ୍ଟରଚେଞ୍ଜ ଫିସ୍ ପ୍ରଯୁଜ୍ୟ',
    acquirerFeeBadge: 'ବ୍ୟାଙ୍କ କ୍ରେଡିଟ୍ କାର୍ଡ ଚାର୍ଜ',
    boxCustomerPaid: 'ଗ୍ରାହକ ଦେଉଥିବା ରାଶି',
    boxCustomerExtra: 'ଗ୍ରାହକ ସରଚାର୍ଜ',
    boxZeroCustomer: '₹୦ (ସର୍ବଦା ମାଗଣା)',
    boxCustomerDesc: 'ଗ୍ରାହକଙ୍କ ଠାରୁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନିଆଯିବ ନାହିଁ (Sec 10A PSS Act)',
    boxBankMdr: 'ସରକାରୀ MDR / ଇଣ୍ଟରଚେଞ୍ଜ',
    boxMerchantGets: 'ବ୍ୟବସାୟୀଙ୍କୁ ମିଳୁଥିବା ନିଟ୍ ରାଶି',
    receiptTitle: 'କାରବାର ରସିଦ ବିବରଣୀ',
    customerScanned: 'ଗ୍ରାହକଙ୍କ ଖାତାରୁ କଟାଯାଇଥିବା ରାଶି:',
    noExtraFee: 'ଗ୍ରାହକଙ୍କ ପାଇଁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନାହିଁ (୧୦୦% ମାଗଣା)',
    bankDeduction: 'କଟନ / ଇଣ୍ଟରଚେଞ୍ଜ:',
    netShopCredit: 'ବ୍ୟବସାୟୀଙ୍କ ଖାତାରେ ଜମା ହେବାକୁ ଥିବା ନିଟ୍ ରାଶି:',
    acquirerContractHeading: 'ବ୍ୟବସାୟୀ ସେଟଲମେଣ୍ଟ ସୂଚନା:',
    officialRulesHeading: 'ପେମେଣ୍ଟ ମାଧ୍ୟମ ଅନୁସାରେ ସରକାରୀ ନିୟମ',
    rule1Title: '୧. ବ୍ୟାଙ୍କ ଖାତା UPI (ସାଧାରଣ ବ୍ୟାଙ୍କ-ଟୁ-ବ୍ୟାଙ୍କ)',
    rule1Desc:
      'ସେକ୍ସନ ୧୦A PSS ଆକ୍ଟ ଅନୁସାରେ ୦% MDR। ଯେକୌଣସି ରାଶି ପାଇଁ ବ୍ୟବସାୟୀ କିମ୍ବା ଗ୍ରାହକଙ୍କ ଠାରୁ କୌଣସି ଶୁଳ୍କ ନିଆଯିବ ନାହିଁ।',
    rule2Title: '୨. ପ୍ରିପେଡ୍ ୱାଲେଟ୍ / PPI UPI (Paytm/PhonePe ୱାଲେଟ୍)',
    rule2Desc:
      'NPCI ମାର୍ଚ୍ଚ ୨୦୨୩ ସର୍କୁଲାର୍: ଗ୍ରାହକଙ୍କ ପାଇଁ ₹୦। ₹୨,୦୦୦ ପର୍ଯ୍ୟନ୍ତ ୦%। ₹୨,୦୦୦ ଉପରେ ୧.୧୦% ପର୍ଯ୍ୟନ୍ତ ଇଣ୍ଟରଚେଞ୍ଜ ବ୍ୟାଙ୍କଗୁଡ଼ିକ ମଧ୍ୟରେ ଲାଗୁ ହୁଏ।',
    rule3Title: '୩. ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ UPI',
    rule3Desc:
      'NPCI ନିୟମ: ଗ୍ରାହକଙ୍କ ପାଇଁ ₹୦। ଛୋଟ ଅଫଲାଇନ୍ ବ୍ୟବସାୟୀଙ୍କ ପାଇଁ ₹୨,୦୦୦ ପର୍ଯ୍ୟନ୍ତ Nil MDR (୦%)। ₹୨,୦୦୦ ଉପରେ ବ୍ୟାଙ୍କ ଚୁକ୍ତି ଅନୁସାରେ ଚାର୍ଜ ଲାଗେ।',
    rule4Title: '୪. ବ୍ୟକ୍ତିଗତ (P2P) ସ୍ଥାନାନ୍ତର',
    rule4Desc:
      'P2P ସ୍ଥାନାନ୍ତର ସର୍ବଦା ୧୦୦% ମାଗଣା, ପଠାଉଥିବା ଏବଂ ଗ୍ରହଣ କରୁଥିବା ଉଭୟଙ୍କ ପାଇଁ ₹୦ ଶୁଳ୍କ।',
    lastVerified: 'ନିୟମାବଳୀ ଯାଞ୍ଚ: ବର୍ତ୍ତମାନର ସରକାରୀ ନିର୍ଦ୍ଦେଶ',
    officialSources: 'ସରକାରୀ ଏବଂ ନିୟାମକ ଉତ୍ସ:',
    source1: 'NPCI UPI ସର୍କୁଲାର୍ (ଅଫିସିଆଲ୍ ତାଲିକା)',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ UPI ନିର୍ଦ୍ଦେଶାବଳୀ',
    source4: 'RBI ଜିରୋ-MDR ନୋଟିଫିକେସନ୍ (PSS Act Sec 10A)',
  },
  te: {
    appTitle: 'UPI ఛార్జీలు & సెటిల్‌మెంట్ కాలిక్యులేటర్',
    subtitle: 'RBI అధికారిక జీరో-MDR ఉత్తర్వులు & NPCI సర్క్యులర్ ఫ్రేమ్‌వర్క్',
    statutoryBannerTitle: 'బ్యాంక్ ఖాతా UPI: చట్టబద్ధమైన 0% జీరో-MDR విధానం',
    statutoryBannerSubtext:
      'సెక్షన్ 10A PSS చట్టం మరియు కేంద్ర ప్రభుత్వం/RBI ఉత్తర్వుల ప్రకారం, ప్రామాణిక బ్యాంక్ UPI లావాదేవీలపై వ్యాపారులకు 0% MDR మరియు కస్టమర్లకు ₹0 ఛార్జ్ వర్తిస్తుంది.',
    installApp: 'యాప్ ఇన్‌స్టాల్',
    selectLanguage: 'భాష',
    disclaimerBannerTitle: 'సమాచార మరియు విద్యా ప్రయోజనాల సాధనం',
    disclaimerBannerText:
      'బ్యాంక్ ఖాతా UPI కి చట్టబద్ధంగా 0% MDR వర్తిస్తుంది. వాలెట్లు మరియు రూపే క్రెడిట్ కార్డులకు సంబంధించి వాస్తవ ఛార్జీలు NPCI నిబంధనలు మరియు బ్యాంక్ ఒప్పందాలపై ఆధారపడి ఉంటాయి.',
    txnStepTitle: '1. లావాదేవీ మరియు చెల్లింపు సాధనం ఎంచుకోండి',
    amountLabel: 'చెల్లింపు మొత్తం (₹ లలో)',
    amountPlaceholder: 'మొత్తం నమోదు చేయండి (ఉదా: 5000)',
    txnTypeLabel: 'లావాదేవీ రకం (Transaction Type)',
    p2pPersonToPerson: 'P2P (వ్యక్తి నుండి వ్యక్తికి బదిలీ - 100% ఉచితం)',
    p2mMerchant: 'P2M (షాపులు / వ్యాపారులకు చెల్లింపు)',
    paymentModeLabel: 'చెల్లింపు సాధనం (Payment Instrument)',
    modeBank: 'బ్యాంక్ ఖాతా UPI',
    modeBankSub: 'సెక్షన్ 10A • 0% MDR',
    modeWallet: 'వాలెట్ / PPI UPI',
    modeWalletSub: 'NPCI ఇంటర్‌ఛేంజ్ • ₹0 కస్టమర్',
    modeRupayCC: 'రూపే క్రెడిట్ కార్డ్',
    modeRupayCCSub: '≤ ₹2,000 0% • బ్యాంక్ ఫీజు',
    merchantCatLabel: 'వ్యాపారి కేటగిరీ (Merchant Category)',
    catGeneral: 'సాధారణ వ్యాపారి / రిటైల్ దుకాణం',
    catSmallOffline: 'చిన్న వ్యాపారులు (టర్నోవర్ ≤ ₹20 లక్షలు)',
    catFuelUtilities: 'ఇంధనం, రైల్వేలు, టెలికాం & నిత్యావసరాలు',
    calculationsTitle: 'లావాదేవీ రసీదు & ఛార్జీ ఎవరు భరిస్తారు?',
    formulaTitle: 'గణన సూత్రం (Calculation Formula)',
    zeroMdrBadge: 'చట్టబద్ధమైన 0% జీరో-MDR',
    ecosystemFeeBadge: 'NPCI ఇంటర్‌ఛేంజ్ వర్తింపు',
    acquirerFeeBadge: 'బ్యాంక్ క్రెడిట్ కార్డ్ ఛార్జీ',
    boxCustomerPaid: 'కస్టమర్ చెల్లించిన మొత్తం',
    boxCustomerExtra: 'కస్టమర్ సర్‌ఛార్జ్',
    boxZeroCustomer: '₹0 (ఎప్పటికీ ఉచితం)',
    boxCustomerDesc: 'కస్టమర్ నుండి అదనపు ఫీజు తీసుకోకూడదు (Sec 10A PSS చట్టం)',
    boxBankMdr: 'చట్టబద్ధ MDR / ఇంటర్‌ఛేంజ్',
    boxMerchantGets: 'వ్యాపారికి జమయ్యే నికర మొత్తం',
    receiptTitle: 'లావాదేవీ రసీదు సారాంశం',
    customerScanned: 'కస్టమర్ ఖాతా నుండి కట్ అయిన మొత్తం:',
    noExtraFee: 'కస్టమర్‌కు ఎలాంటి అదనపు రుసుము లేదు (100% ఉచితం)',
    bankDeduction: 'కోత / ఇంటర్‌ఛేంజ్:',
    netShopCredit: 'వ్యాపారి ఖాతాలో జమ అయ్యే నికర మొత్తం:',
    acquirerContractHeading: 'వ్యాపారి సెటిల్‌మెంట్ ముఖ్య గమనిక:',
    officialRulesHeading: 'చెల్లింపు సాధనాల వారీగా అధికారిక నిబంధనలు',
    rule1Title: '1. బ్యాంక్ ఖాతా UPI (ప్రామాణికం)',
    rule1Desc:
      'సెక్షన్ 10A PSS చట్టం ప్రకారం 0% MDR. ఎంత మొత్తానికైనా వ్యాపారుల నుండి లేదా కస్టమర్ల నుండి ఎటువంటి MDR వసూలు చేయకూడదు.',
    rule2Title: '2. వాలెట్ / PPI UPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI సర్క్యులర్: కస్టమర్లకు ₹0. ₹2,000 వరకు 0%. ₹2,000 దాటితే 1.10% వరకు ఇంటర్‌ఛేంజ్ బ్యాంకుల మధ్య వర్తిస్తుంది.',
    rule3Title: '3. రూపే క్రెడిట్ కార్డ్ UPI',
    rule3Desc:
      'NPCI నిబంధన: కస్టమర్లకు ₹0. చిన్న వ్యాపారులకు ₹2,000 వరకు Nil MDR (0%). ₹2,000 దాటితే బ్యాంక్ ఒప్పందం ప్రకారం క్రెడిట్ కార్డ్ ఛార్జీలు ఉంటాయి.',
    rule4Title: '4. వ్యక్తి నుండి వ్యక్తికి (P2P) బదిలీలు',
    rule4Desc:
      'P2P బదిలీలకు ఏ మొత్తానికైనా 100% పూర్తి ఉచితం (పంపేవారికి, స్వీకరించేవారికి ₹0 ఫీజు).',
    lastVerified: 'నిబంధనల ధృవీకరణ: ప్రస్తుత అధికారిక మార్గదర్శకాలు',
    officialSources: 'అధికారిక ప్రభుత్వ & నియంత్రణ వనరులు:',
    source1: 'NPCI UPI అధికారిక సర్క్యులర్లు',
    source2: 'NPCI PPI-on-UPI తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    source3: 'NPCI రూపే క్రెడిట్ కార్డ్ UPI గైడ్‌లైన్స్',
    source4: 'RBI జీరో-MDR నోటిఫికేషన్ (PSS Act Sec 10A)',
  },
  hi: {
    appTitle: 'यूपीआई शुल्क एवं सेटलमेंट कैलकुलेटर',
    subtitle: 'आरबीआई आधिकारिक जीरो-एमडीआर निर्देश एवं एनपीसीआई फ्रेमवर्क',
    statutoryBannerTitle: 'बैंक खाता यूपीआई: आधिकारिक 0% जीरो-एमडीआर नियम',
    statutoryBannerSubtext:
      'पेमेंट एंड सेटलमेंट सिस्टम्स एक्ट (धारा 10A) एवं वित्त मंत्रालय के निर्देशों के तहत बैंक खाता यूपीआई पर व्यापारियों के लिए 0% MDR और ग्राहकों के लिए ₹0 शुल्क पूरी तरह लागू है।',
    installApp: 'ऐप इंस्टॉल करें',
    selectLanguage: 'भाषा',
    disclaimerBannerTitle: 'सूचनात्मक एवं शैक्षिक टूल',
    disclaimerBannerText:
      'बैंक खाता यूपीआई कानूनी रूप से 0% MDR है। वॉलेट और रुपे क्रेडिट कार्ड पर शुल्क एनपीसीआई नियमों और बैंक अनुबंधों पर निर्भर करते हैं।',
    txnStepTitle: '1. लेनदेन एवं भुगतान माध्यम चुनें',
    amountLabel: 'लेनदेन राशि (₹ में)',
    amountPlaceholder: 'राशि दर्ज करें (जैसे: 5000)',
    txnTypeLabel: 'लेनदेन का प्रकार',
    p2pPersonToPerson: 'P2P (व्यक्ति से व्यक्ति ट्रांसफर - 100% मुफ़्त)',
    p2mMerchant: 'P2M (दुकानदार / मर्चेंट को भुगतान)',
    paymentModeLabel: 'भुगतान माध्यम (3 अलग नियामक नियम)',
    modeBank: 'बैंक खाता यूपीआई',
    modeBankSub: 'धारा 10A • 0% MDR',
    modeWallet: 'वॉलेट / पीपीआई यूपीआई',
    modeWalletSub: 'NPCI इंटरचेंज • ₹0 ग्राहक',
    modeRupayCC: 'रुपे क्रेडिट कार्ड',
    modeRupayCCSub: '≤ ₹2,000 0% • बैंक शुल्क',
    merchantCatLabel: 'व्यापारी श्रेणी',
    catGeneral: 'सामान्य व्यापारी / खुदरा दुकान',
    catSmallOffline: 'छोटे ऑफलाइन व्यापारी (टर्नओवर ≤ ₹20 लाख)',
    catFuelUtilities: 'ईंधन, रेलवे, टेलीकॉम एवं आवश्यक सेवाएं',
    calculationsTitle: 'लेनदेन विवरण एवं शुल्क वहनकर्ता',
    formulaTitle: 'गणना सूत्र (Calculation Formula)',
    zeroMdrBadge: 'कानूनी 0% जीरो-एमडीआर',
    ecosystemFeeBadge: 'NPCI इंटरचेंज लागू',
    acquirerFeeBadge: 'बैंक क्रेडिट कार्ड शुल्क',
    boxCustomerPaid: 'ग्राहक द्वारा भुगतान',
    boxCustomerExtra: 'ग्राहक अधिभार (Surcharge)',
    boxZeroCustomer: '₹0 (हमेशा मुफ़्त)',
    boxCustomerDesc: 'ग्राहकों पर कोई अतिरिक्त शुल्क नहीं लगता (Sec 10A PSS Act)',
    boxBankMdr: 'कानूनी MDR / इंटरचेंज',
    boxMerchantGets: 'दुकानदार को बैंक में शुद्ध जमा',
    receiptTitle: 'लेनदेन रसीद विवरण',
    customerScanned: 'ग्राहक के खाते से कटी राशि:',
    noExtraFee: 'ग्राहक के लिए कोई अतिरिक्त सुविधा शुल्क नहीं (100% मुफ़्त)',
    bankDeduction: 'कटौती / इंटरचेंज:',
    netShopCredit: 'दुकानदार के खाते में शुद्ध जमा:',
    acquirerContractHeading: 'व्यापारी सेटलमेंट महत्वपूर्ण सूचना:',
    officialRulesHeading: 'भुगतान माध्यम अनुसार आधिकारिक नियम',
    rule1Title: '1. बैंक खाता यूपीआई (सामान्य)',
    rule1Desc:
      'धारा 10A PSS एक्ट के तहत 0% MDR। किसी भी राशि पर व्यापारी या ग्राहक से कोई MDR शुल्क नहीं लिया जा सकता।',
    rule2Title: '2. प्रीपेड वॉलेट / पीपीआई (Paytm/PhonePe)',
    rule2Desc:
      'NPCI परिपत्र: ग्राहकों के लिए ₹0। ₹2,000 तक 0%। ₹2,000 से अधिक पर 1.10% तक इंटरचेंज बैंकों के बीच लागू होता है।',
    rule3Title: '3. रुपे क्रेडिट कार्ड ऑन यूपीआई',
    rule3Desc:
      'NPCI नियम: ग्राहकों पर ₹0 शुल्क। छोटे व्यापारियों को ₹2,000 तक Nil MDR (0%)। उससे अधिक पर बैंक अनुबंध अनुसार क्रेडिट कार्ड दरें लागू होती हैं।',
    rule4Title: '4. व्यक्ति से व्यक्ति (P2P) ट्रांसफर',
    rule4Desc:
      'व्यक्तियों के बीच ट्रांसफर किसी भी राशि पर हमेशा 100% मुफ़्त है।',
    lastVerified: 'नियम सत्यापन: वर्तमान 2026 आधिकारिक निर्देश',
    officialSources: 'आधिकारिक सरकारी और नियामक स्रोत:',
    source1: 'NPCI UPI आधिकारिक परिपत्र',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI रुपे क्रेडिट कार्ड दिशानिर्देश',
    source4: 'RBI जीरो-एमडीआर अधिसूचना (PSS Act Sec 10A)',
  },
  mr: {
    appTitle: 'UPI शुल्क व सेटलमेंट कॅल्क्युलेटर',
    subtitle: 'RBI अधिकृत झिरो-MDR निर्देश व NPCI परिपत्रक फ्रेमवर्क',
    statutoryBannerTitle: 'बँक खाते UPI: कायदेशीर 0% झिरो-MDR पद्धत',
    statutoryBannerSubtext:
      'पेमेंट अँड सेटलमेंट सिस्टीम्स अ‍ॅक्ट (कलम 10A) आणि केंद्र सरकारच्या निर्देशानुसार बँक खाते UPI वर व्यापाऱ्यांसाठी 0% MDR व ग्राहकांसाठी ₹0 शुल्क आहे.',
    installApp: 'अॅप इंस्टॉल करा',
    selectLanguage: 'भाषा',
    disclaimerBannerTitle: 'माहिती व शैक्षणिक साधन',
    disclaimerBannerText:
      'बँक खाते UPI कायदेशीररीत्या 0% MDR आहे. वॉलेट आणि रुपे क्रेडिट कार्डवरील शुल्क बँक करारांवर अवलंबून असतात.',
    txnStepTitle: '1. व्यवहार व पेमेंट साधन निवडा',
    amountLabel: 'व्यवहार रक्कम (₹ मध्ये)',
    amountPlaceholder: 'रक्कम प्रविष्ट करा',
    txnTypeLabel: 'व्यवहार प्रकार',
    p2pPersonToPerson: 'P2P (व्यक्ती ते व्यक्ती हस्तांतरण - 100% मोफत)',
    p2mMerchant: 'P2M (दुकानदार / व्यापारी पेमेंट)',
    paymentModeLabel: 'पेमेंट साधन',
    modeBank: 'बँक खाते UPI',
    modeBankSub: 'कलम 10A • 0% MDR',
    modeWallet: 'वॉलेट / PPI UPI',
    modeWalletSub: 'NPCI इंटरचेंज • ₹0 ग्राहक',
    modeRupayCC: 'रुपे क्रेडिट कार्ड',
    modeRupayCCSub: '≤ ₹2,000 0% • बँक दर',
    merchantCatLabel: 'व्यापारी वर्ग',
    catGeneral: 'सामान्य व्यापारी / रिटेल दुकान',
    catSmallOffline: 'लहान ऑफलाइन व्यापारी (टर्नओव्हर ≤ ₹20 लाख)',
    catFuelUtilities: 'इंधन, रेल्वे, टेलिकॉम व अत्यावश्यक सेवा',
    calculationsTitle: 'व्यवहार पावती व शुल्क कोणावर?',
    formulaTitle: 'गणना सूत्र (Calculation Formula)',
    zeroMdrBadge: 'कायदेशीर 0% झिरो-MDR',
    ecosystemFeeBadge: 'NPCI इंटरचेंज लागू',
    acquirerFeeBadge: 'बँक क्रेडिट कार्ड शुल्क',
    boxCustomerPaid: 'ग्राहकाने भरलेली रक्कम',
    boxCustomerExtra: 'ग्राहक सरचार्ज',
    boxZeroCustomer: '₹0 (नेहमी मोफत)',
    boxCustomerDesc: 'ग्राहकावर कोणताही अतिरिक्त भार नाही (Sec 10A PSS Act)',
    boxBankMdr: 'कायदेशीर MDR / इंटरचेंज',
    boxMerchantGets: 'दुकानदाराला खात्यात मिळणारी रक्कम',
    receiptTitle: 'व्यवहार पावती सारांश',
    customerScanned: 'ग्राहकाच्या खात्यातून कापलेली रक्कम:',
    noExtraFee: 'ग्राहकासाठी शून्य अतिरिक्त शुल्क (100% मोफत)',
    bankDeduction: 'कपात / इंटरचेंज:',
    netShopCredit: 'दुकानदाराच्या खात्यात जमा झालेली रक्कम:',
    acquirerContractHeading: 'व्यापारी सेटलमेंट महत्त्वाची सूचना:',
    officialRulesHeading: 'पेमेंट साधनानुसार अधिकृत नियम',
    rule1Title: '1. बँक खाते UPI (मानक)',
    rule1Desc:
      'कलम 10A PSS अ‍ॅक्ट अंतर्गत 0% MDR. कोणत्याही रकमेसाठी व्यापाऱ्याकडून शुल्क आकारले जात नाही.',
    rule2Title: '2. प्रीपेड वॉलेट / PPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI परिपत्रक: ग्राहकांसाठी ₹0. ₹2,000 पर्यंत 0%. ₹2,000 च्या वर 1.10% पर्यंत इंटरचेंज लागू होते.',
    rule3Title: '3. रुपे क्रेडिट कार्ड ऑन UPI',
    rule3Desc:
      'NPCI नियम: ग्राहकांसाठी ₹0. लहान व्यापाऱ्यांना ₹2,000 पर्यंत 0% Nil MDR. त्यापुढे बँक कराराप्रमाणे शुल्क.',
    rule4Title: '4. व्यक्ती ते व्यक्ती (P2P)',
    rule4Desc: 'P2P हस्तांतरण कोणत्याही रकमेसाठी 100% मोफत आहे.',
    lastVerified: 'नियम पडताळणी: सध्याचे अधिकृत निर्देश',
    officialSources: 'अधिकृत सरकारी आणि नियामक स्रोत:',
    source1: 'NPCI UPI अधिकृत परिपत्रके',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI रुपे क्रेडिट कार्ड मार्गदर्शक तत्त्वे',
    source4: 'RBI झिरो-MDR अधिसूचना (PSS Act Sec 10A)',
  },
  gu: {
    appTitle: 'UPI ચાર્જ અને સેટલમેન્ટ કેલ્ક્યુલેટર',
    subtitle: 'RBI સત્તાવાર ઝીરો-MDR નિર્દેશ અને NPCI ફ્રેમવર્ક',
    statutoryBannerTitle: 'બેંક ખાતું UPI: કાયદેસર 0% ઝીરો-MDR પદ્ધતિ',
    statutoryBannerSubtext:
      'પેમેન્ટ એન્ડ સેટલમેન્ટ સિસ્ટમ્સ એક્ટ (કલમ 10A) અને સરકારના નિર્દેશો હેઠળ બેંક ખાતા UPI પર વેપારીઓ માટે 0% MDR અને ગ્રાહકો માટે ₹0 ચાર્જ છે.',
    installApp: 'એપ્લિકેશન ઇન્સ્ટોલ કરો',
    selectLanguage: 'ભાષા',
    disclaimerBannerTitle: 'માહિતી અને શૈક્ષણિક સાધન',
    disclaimerBannerText:
      'બેંક ખાતું UPI કાયદેસર 0% MDR છે. વોલેટ અને રૂપે ક્રેડિટ કાર્ડ પર ચાર્જ બેંક કરાર પર આધાર રાખે છે.',
    txnStepTitle: '1. વ્યવહાર અને ચુકવણી સાધન પસંદ કરો',
    amountLabel: 'ચુકવણી રકમ (₹ માં)',
    amountPlaceholder: 'રકમ દાખલ કરો',
    txnTypeLabel: 'ટ્રાન્ઝેક્શન પ્રકાર',
    p2pPersonToPerson: 'P2P (વ્યક્તિ થી વ્યક્તિ ટ્રાન્સફર - 100% મફત)',
    p2mMerchant: 'P2M (વેપારી / દુકાનદારને ચુકવણી)',
    paymentModeLabel: 'ચુકવણી સાધન',
    modeBank: 'બેંક ખાતું UPI',
    modeBankSub: 'કલમ 10A • 0% MDR',
    modeWallet: 'વોલેટ / PPI UPI',
    modeWalletSub: 'NPCI ઇન્ટરચેન્જ • ₹0 ગ્રાહક',
    modeRupayCC: 'રૂપે ક્રેડિટ કાર્ડ',
    modeRupayCCSub: '≤ ₹2,000 0% • બેંક દર',
    merchantCatLabel: 'વેપારી શ્રેણી',
    catGeneral: 'સામાન્ય વેપારી / રિટેલ દુકાન',
    catSmallOffline: 'નાના ઓફલાઇન વેપારીઓ (ટર્નઓવર ≤ ₹20 લાખ)',
    catFuelUtilities: 'ઇંધણ, રેલવે, ટેલિકોમ અને આવશ્યક સેવાઓ',
    calculationsTitle: 'ચુકવણી હિસાબ અને ફી કોણ ભોગવે છે?',
    formulaTitle: 'ગણતરી સૂત્ર (Calculation Formula)',
    zeroMdrBadge: 'કાયદેસર 0% ઝીરો-MDR',
    ecosystemFeeBadge: 'NPCI ઇન્ટરચેન્જ લાગુ',
    acquirerFeeBadge: 'બેંક ક્રેડિટ કાર્ડ ચાર્જ',
    boxCustomerPaid: 'ગ્રાહકે ચૂકવેલ રકમ',
    boxCustomerExtra: 'ગ્રાહક સરચાર્જ',
    boxZeroCustomer: '₹0 (હંમેશા મફત)',
    boxCustomerDesc: 'ગ્રાહક પર કોઈ વધારાનો ચાર્જ નહીં (Sec 10A PSS Act)',
    boxBankMdr: 'કાયદેસર MDR / ઇન્ટરચેન્જ',
    boxMerchantGets: 'વેપારીને બેંકમાં જમા રકમ',
    receiptTitle: 'ટ્રાન્ઝેક્શન રસીદ સારાંશ',
    customerScanned: 'ગ્રાહકના ખાતામાંથી ડેબિટ થયેલ રકમ:',
    noExtraFee: 'ગ્રાહક માટે કોઈ વધારાનો ચાર્જ નથી (100% મફત)',
    bankDeduction: 'કપાત / ઇન્ટરચેન્જ:',
    netShopCredit: 'વેપારી ખાતામાં જમા ચોખ્ખી રકમ:',
    acquirerContractHeading: 'વેપારી સેટલમેન્ટ મહત્વપૂર્ણ સૂચના:',
    officialRulesHeading: 'ચુકવણી સાધન મુજબ સત્તાવાર નિયમો',
    rule1Title: '1. બેંક ખાતું UPI (સ્ટાન્ડર્ડ)',
    rule1Desc:
      'કલમ 10A PSS એક્ટ હેઠળ 0% MDR. કોઈપણ રકમ માટે વેપારી કે ગ્રાહક પાસેથી કોઈ ચાર્જ લેવાતો નથી.',
    rule2Title: '2. પ્રીપેડ વોલેટ / PPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI પરિપત્ર: ગ્રાહકો માટે ₹0. ₹2,000 સુધી 0%. ₹2,000 થી વધુ પર 1.10% સુધી ઇન્ટરચેન્જ લાગુ થાય છે.',
    rule3Title: '3. રૂપે ક્રેડિટ કાર્ડ UPI',
    rule3Desc:
      'NPCI નિયમ: ગ્રાહકો માટે ₹0. નાના વેપારીઓ માટે ₹2,000 સુધી Nil MDR (0%). તે પછી બેંક કરાર મુજબ ચાર્જ.',
    rule4Title: '4. વ્યક્તિ થી વ્યક્તિ (P2P)',
    rule4Desc: 'P2P ટ્રાન્સફર કોઈપણ રકમ માટે 100% મફત છે.',
    lastVerified: 'નિયમો ચકાસણી: વર્તમાન સત્તાવાર નિર્દેશો',
    officialSources: 'સત્તાવાર સરકારી સ્ત્રોતો:',
    source1: 'NPCI UPI પરિપત્રો (સત્તાવાર યાદી)',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI રૂપે ક્રેડિટ કાર્ડ માર્ગદર્શિકા',
    source4: 'RBI ઝીરો-MDR સૂચના (PSS Act Sec 10A)',
  },
  ta: {
    appTitle: 'UPI கட்டணங்கள் மற்றும் தீர்வு கால்குலேட்டர்',
    subtitle: 'RBI அதிகாரப்பூர்வ ஜீரோ-MDR உத்தரவு & NPCI சுற்றறிக்கை',
    statutoryBannerTitle: 'வங்கி கணக்கு UPI: சட்டப்பூர்வ 0% ஜீரோ-MDR முறை',
    statutoryBannerSubtext:
      'செட்டில்மென்ட் அமைப்புகள் சட்டம் (பிரிவு 10A) மற்றும் அரசாங்க வழிகாட்டுதல்களின்படி, வங்கி கணக்கு UPI வணிகர்களுக்கு 0% MDR மற்றும் வாடிக்கையாளர்களுக்கு ₹0 கட்டணம் ஆகும்.',
    installApp: 'செயலியை நிறுவு',
    selectLanguage: 'மொழி',
    disclaimerBannerTitle: 'தகவல் மற்றும் கல்வி கருவி',
    disclaimerBannerText:
      'வங்கி கணக்கு UPI சட்டப்பூர்வமாக 0% MDR ஆகும். வாலட் மற்றும் ரூபே கிரெடிட் கார்டு கட்டணங்கள் வங்கி ஒப்பந்தங்களைப் பொறுத்தது.',
    txnStepTitle: '1. பரிவர்த்தனை மற்றும் கட்டண முறையைத் தேர்வுசெய்க',
    amountLabel: 'பரிவர்த்தனை தொகை (₹ இல்)',
    amountPlaceholder: 'தொகையை உள்ளிடவும்',
    txnTypeLabel: 'பரிவர்த்தனை வகை',
    p2pPersonToPerson: 'P2P (நபர் முதல் நபர் வரை - 100% இலவசம்)',
    p2mMerchant: 'P2M (கடை / வணிகருக்கு செலுத்துதல்)',
    paymentModeLabel: 'கட்டண முறை',
    modeBank: 'வங்கி கணக்கு UPI',
    modeBankSub: 'பிரிவு 10A • 0% MDR',
    modeWallet: 'வாலட் / PPI UPI',
    modeWalletSub: 'NPCI இன்டர்சேஞ்ச் • ₹0 வாடிக்கையாளர்',
    modeRupayCC: 'ரூபே கிரெடிட் கார்டு',
    modeRupayCCSub: '≤ ₹2,000 0% • வங்கி கட்டணம்',
    merchantCatLabel: 'வணிகர் பிரிவு',
    catGeneral: 'பொது வணிகர் / சில்லறை கடை',
    catSmallOffline: 'சிறு வணிகர்கள் (வருவாய் ≤ ₹20 லட்சம்)',
    catFuelUtilities: 'எரிபொருள், ரயில்வே, தொலைத்தொடர்பு & பயன்பாடுகள்',
    calculationsTitle: 'பரிவர்த்தனை ரசீது & கட்டணம் யார் செலுத்துவது?',
    formulaTitle: 'கணக்கீட்டு சூத்திரம் (Calculation Formula)',
    zeroMdrBadge: 'சட்டப்பூர்வ 0% ஜீரோ-MDR',
    ecosystemFeeBadge: 'NPCI இன்டர்சேஞ்ச் பொருந்தும்',
    acquirerFeeBadge: 'வங்கி கிரெடிட் கார்டு கட்டணம்',
    boxCustomerPaid: 'வாடிக்கையாளர் செலுத்தியது',
    boxCustomerExtra: 'வாடிக்கையாளர் கூடுதல் கட்டணம்',
    boxZeroCustomer: '₹0 (எப்போதும் இலவசம்)',
    boxCustomerDesc: 'வாடிக்கையாளரிடம் கூடுதல் கட்டணம் வசூலிக்கக் கூடாது (Sec 10A PSS Act)',
    boxBankMdr: 'சட்டப்பூர்வ MDR / இன்டர்சேஞ்ச்',
    boxMerchantGets: 'வணிகருக்கு வங்கியில் சேருவது',
    receiptTitle: 'பரிவர்த்தனை ரசீது சுருக்கம்',
    customerScanned: 'வாடிக்கையாளர் கணக்கிலிருந்து கழிக்கப்பட்ட தொகை:',
    noExtraFee: 'வாடிக்கையாளருக்கு கூடுதல் கட்டணம் இல்லை (100% இலவசம்)',
    bankDeduction: 'பிடித்தம் / இன்டர்சேஞ்ச்:',
    netShopCredit: 'வணிகரின் வங்கி கணக்கில் சேரும் நிகர தொகை:',
    acquirerContractHeading: 'வணிகர் தீர்வு முக்கிய குறிப்பு:',
    officialRulesHeading: 'கட்டண முறை வாரியாக அதிகாரப்பூர்வ விதிகள்',
    rule1Title: '1. வங்கி கணக்கு UPI (வழக்கமான)',
    rule1Desc:
      'பிரிவு 10A PSS சட்டத்தின் கீழ் 0% MDR. எந்தத் தொகைக்கும் வணிகர்களிடமிருந்து கட்டணம் வசூலிக்கப்படாது.',
    rule2Title: '2. வாலட் / PPI UPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI சுற்றறிக்கை: வாடிக்கையாளருக்கு ₹0. ₹2,000 வரை 0%. ₹2,000க்கு மேல் 1.10% வரை இன்டர்சேஞ்ச் வங்கிகளுக்கு இடையே பொருந்தும்.',
    rule3Title: '3. ரூபே கிரெடிட் கார்டு UPI',
    rule3Desc:
      'NPCI விதி: வாடிக்கையாளருக்கு ₹0. சிறு வணிகர்களுக்கு ₹2,000 வரை 0% Nil MDR. அதற்கு மேல் வங்கி ஒப்பந்தப்படி கட்டணம்.',
    rule4Title: '4. நபர் முதல் நபர் (P2P)',
    rule4Desc: 'P2P பரிவர்த்தனைகள் எந்தத் தொகைக்கும் எப்போதும் 100% இலவசம்.',
    lastVerified: 'விதிகள் சரிபார்ப்பு: தற்போதைய அதிகாரப்பூர்வ உத்தரவுகள்',
    officialSources: 'அதிகாரப்பூர்வ அரசு மற்றும் ஒழுங்குமுறை ஆதாரங்கள்:',
    source1: 'NPCI UPI அதிகாரப்பூர்வ சுற்றறிக்கைகள்',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI ரூபே கிரெடிட் கார்டு வழிகாட்டுதல்கள்',
    source4: 'RBI ஜீரோ-MDR அறிவிப்பு (PSS Act Sec 10A)',
  },
  bn: {
    appTitle: 'UPI চার্জ ও সেটেলমেন্ট ক্যালকুলেটর',
    subtitle: 'RBI সরকারি জিরো-MDR নির্দেশিকা ও NPCI সার্কুলার ফ্রেমওয়ার্ক',
    statutoryBannerTitle: 'ব্যাংক একাউন্ট UPI: সরকারি ০% জিরো-MDR নিয়ম',
    statutoryBannerSubtext:
      'পেমেন্ট অ্যান্ড সেটেলমেন্ট সিস্টেমস অ্যাক্ট (ধারা 10A) ও সরকারি নির্দেশিকা অনুসারে ব্যাংক একাউন্ট UPI-তে ব্যবসায়ীদের জন্য ০% MDR এবং গ্রাহকদের জন্য ₹০ ফি প্রযোজ্য।',
    installApp: 'অ্যাপ ইনস্টল করুন',
    selectLanguage: 'ভাষা',
    disclaimerBannerTitle: 'তথ্য ও শিক্ষামূলক টুল',
    disclaimerBannerText:
      'ব্যাংক একাউন্ট UPI আইনগতভাবে ০% MDR। ওয়ালেট এবং রুপে ক্রেডিট কার্ডের চার্জ ব্যাংক চুক্তির উপর নির্ভর করে।',
    txnStepTitle: '১. লেনদেন এবং পেমেন্ট মাধ্যম নির্বাচন করুন',
    amountLabel: 'লেনদেনের পরিমাণ (₹ তে)',
    amountPlaceholder: 'পরিমাণ লিখুন',
    txnTypeLabel: 'লেনদেনের ধরন',
    p2pPersonToPerson: 'P2P (ব্যক্তি থেকে ব্যক্তি স্থানান্তর - ১০০% বিনামূল্যে)',
    p2mMerchant: 'P2M (দোকানদার / ব্যবসায়ীকে পেমেন্ট)',
    paymentModeLabel: 'পেমেন্ট মাধ্যম',
    modeBank: 'ব্যাংক একাউন্ট UPI',
    modeBankSub: 'ধারা 10A • ০% MDR',
    modeWallet: 'ওয়ালেট / PPI UPI',
    modeWalletSub: 'NPCI ইন্টারচেঞ্জ • ₹০ গ্রাহক',
    modeRupayCC: 'রুপে ক্রেডিট কার্ড',
    modeRupayCCSub: '≤ ₹২,০০০ ০% • ব্যাংক চার্জ',
    merchantCatLabel: 'ব্যবসায়ী বিভাগ',
    catGeneral: 'সাধারণ ব্যবসায়ী / খুচরা দোকান',
    catSmallOffline: 'ক্ষুদ্র অফলাইন ব্যবসায়ী (টার্নওভার ≤ ₹২০ লাখ)',
    catFuelUtilities: 'জ্বালানি, রেলপথ, টেলিকম ও জরুরি পরিষেবা',
    calculationsTitle: 'লেনদেনের রসিদ ও চার্জ কে বহন করবে?',
    formulaTitle: 'গণনা সূত্র (Calculation Formula)',
    zeroMdrBadge: 'আইনগত ০% জিরো-MDR',
    ecosystemFeeBadge: 'NPCI ইন্টারচেঞ্জ প্রযোজ্য',
    acquirerFeeBadge: 'ব্যাংক ক্রেডিট কার্ড চার্জ',
    boxCustomerPaid: 'গ্রাহকের পরিশোধিত টাকা',
    boxCustomerExtra: 'গ্রাহক সারচার্জ',
    boxZeroCustomer: '₹০ (সর্বদা বিনামূল্যে)',
    boxCustomerDesc: 'গ্রাহকদের উপর কোনো অতিরিক্ত চার্জ নেই (Sec 10A PSS Act)',
    boxBankMdr: 'আইনগত MDR / ইন্টারচেঞ্জ',
    boxMerchantGets: 'ব্যবসায়ীর ব্যাংকে জমা হবে',
    receiptTitle: 'লেনদেনের রসিদ বিবরণ',
    customerScanned: 'গ্রাহকের অ্যাকাউন্ট থেকে কাটা টাকা:',
    noExtraFee: 'গ্রাহকের জন্য শূন্য অতিরিক্ত ফি (১০০% বিনামূল্যে)',
    bankDeduction: 'কর্তন / ইন্টারচেঞ্জ:',
    netShopCredit: 'দোকানদারের ব্যাংক অ্যাকাউন্টে জমা হওয়া নিট পরিমাণ:',
    acquirerContractHeading: 'ব্যবসায়ী সেটেলমেন্ট গুরুত্বপূর্ণ বিজ্ঞপ্তি:',
    officialRulesHeading: 'পেমেন্ট মাধ্যম অনুযায়ী সরকারি নিয়মাবলী',
    rule1Title: '১. ব্যাংক একাউন্ট UPI (সাধারণ)',
    rule1Desc:
      'ধারা 10A PSS অ্যাক্টের অধীনে ০% MDR। যেকোনো পরিমাণের জন্য ব্যবসায়ী বা গ্রাহকের থেকে কোনো চার্জ নেওয়া হয় না।',
    rule2Title: '২. প্রিপেইড ওয়ালেট / PPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI সার্কুলার: গ্রাহকদের জন্য ₹০। ₹২,০০০ পর্যন্ত ০%। ₹২,০০০ এর উপরে ১.১০% পর্যন্ত ইন্টারচেঞ্জ প্রযোজ্য।',
    rule3Title: '৩. রুপে ক্রেডিট কার্ড UPI',
    rule3Desc:
      'NPCI নিয়ম: গ্রাহকদের জন্য ₹০। ক্ষুদ্র ব্যবসায়ীদের জন্য ₹২,০০০ পর্যন্ত ০% Nil MDR। এর উপরে ব্যাংক চুক্তি অনুযায়ী চার্জ।',
    rule4Title: '৪. ব্যক্তি থেকে ব্যক্তি (P2P)',
    rule4Desc: 'P2P লেনদেন যেকোনো পরিমাণের জন্য সর্বদা ১০০% বিনামূল্যে।',
    lastVerified: 'নিয়ম যাচাই: বর্তমান সরকারি নির্দেশিকা',
    officialSources: 'সরকারি ও নিয়ন্ত্রক সূত্র:',
    source1: 'NPCI UPI সার্কুলার (অফিসিয়াল তালিকা)',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI রুপে ক্রেডিট কার্ড নির্দেশিকা',
    source4: 'RBI জিরো-MDR বিজ্ঞপ্তি (PSS Act Sec 10A)',
  },
  kn: {
    appTitle: 'UPI ಶುಲ್ಕಗಳು ಮತ್ತು ಸೆಟಲ್‌ಮೆಂಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    subtitle: 'RBI ಅಧಿಕೃತ ಜೀರೋ-MDR ನಿರ್ದೇಶನ ಮತ್ತು NPCI ಫ್ರೇಮ್‌ವರ್ಕ್',
    statutoryBannerTitle: 'ಬ್ಯಾಂಕ್ ಖಾತೆ UPI: ಅಧಿಕೃತ 0% ಜೀರೋ-MDR ನಿಯಮ',
    statutoryBannerSubtext:
      'ಪಾವತಿ ಮತ್ತು ಇತ್ಯರ್ಥ ವ್ಯವಸ್ಥೆಗಳ ಕಾಯ್ದೆ (ಸೆಕ್ಷನ್ 10A) ಮತ್ತು ಸರ್ಕಾರದ ನಿರ್ದೇಶನಗಳ ಪ್ರಕಾರ ಬ್ಯಾಂಕ್ ಖಾತೆ UPI ಮೇಲೆ ವ್ಯಾಪಾರಿಗಳಿಗೆ 0% MDR ಮತ್ತು ಗ್ರಾಹಕರಿಗೆ ₹0 ಶುಲ್ಕ ಅನ್ವಯಿಸುತ್ತದೆ.',
    installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
    selectLanguage: 'ಭಾಷೆ',
    disclaimerBannerTitle: 'ಮಾಹಿತಿ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಸಾಧನ',
    disclaimerBannerText:
      'ಬ್ಯಾಂಕ್ ಖಾತೆ UPI ಕಾನೂನುಬದ್ಧವಾಗಿ 0% MDR ಆಗಿದೆ. ವಾಲೆಟ್ ಮತ್ತು ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಮೇಲಿನ ಶುಲ್ಕಗಳು ಬ್ಯಾಂಕ್ ಒಪ್ಪಂದಗಳನ್ನು ಅವಲಂಬಿಸಿರುತ್ತವೆ.',
    txnStepTitle: '1. ವಹಿವಾಟು ಮತ್ತು ಪಾವತಿ ವಿಧಾನ ಆಯ್ಕೆಮಾಡಿ',
    amountLabel: 'ವಹಿವಾಟು ಮೊತ್ತ (₹ ಗಳಲ್ಲಿ)',
    amountPlaceholder: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    txnTypeLabel: 'ವಹಿವಾಟಿನ ಪ್ರಕಾರ',
    p2pPersonToPerson: 'P2P (ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ ವರ್ಗಾವಣೆ - 100% ಉಚಿತ)',
    p2mMerchant: 'P2M (ವ್ಯಾಪಾರಿ / ಅಂಗಡಿಗೆ ಪಾವತಿ)',
    paymentModeLabel: 'ಪಾವತಿ ವಿಧಾನ',
    modeBank: 'ಬ್ಯಾಂಕ್ ಖಾತೆ UPI',
    modeBankSub: 'ಸೆಕ್ಷನ್ 10A • 0% MDR',
    modeWallet: 'ವಾಲೆಟ್ / PPI UPI',
    modeWalletSub: 'NPCI ಇಂಟರ್‌ಚೇಂಜ್ • ₹0 ಗ್ರಾಹಕ',
    modeRupayCC: 'ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್',
    modeRupayCCSub: '≤ ₹2,000 0% • ಬ್ಯಾಂಕ್ ಶುಲ್ಕ',
    merchantCatLabel: 'ವ್ಯಾಪಾರಿ ವರ್ಗ',
    catGeneral: 'ಸಾಮಾನ್ಯ ವ್ಯಾಪಾರಿ / ಚಿಲ್ಲರೆ ಅಂಗಡಿ',
    catSmallOffline: 'ಸಣ್ಣ ಆಫ್‌ಲೈನ್ ವ್ಯಾಪಾರಿಗಳು (ಟರ್ನ್‌ಓವರ್ ≤ ₹20 ಲಕ್ಷ)',
    catFuelUtilities: 'ಇಂಧನ, ರೈಲ್ವೆ, ಟೆಲಿಕಾಂ & ಅಗತ್ಯ ಸೇವೆಗಳು',
    calculationsTitle: 'ವಹಿವಾಟಿನ ರಸೀದಿ ಮತ್ತು ಶುಲ್ಕ ಯಾರ ಮೇಲೆ?',
    formulaTitle: 'ಲೆಕ್ಕಾಚಾರ ಸೂತ್ರ (Calculation Formula)',
    zeroMdrBadge: 'ಕಾನೂನುಬದ್ಧ 0% ಜೀರೋ-MDR',
    ecosystemFeeBadge: 'NPCI ಇಂಟರ್‌ಚೇಂಜ್ ಅನ್ವಯಿಸುತ್ತದೆ',
    acquirerFeeBadge: 'ಬ್ಯಾಂಕ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ದರ',
    boxCustomerPaid: 'ಗ್ರಾಹಕರು ಪಾವತಿಸುವ ಮೊತ್ತ',
    boxCustomerExtra: 'ಗ್ರಾಹಕ ಸರ್‌ಚಾರ್ಜ್',
    boxZeroCustomer: '₹0 (ಯಾವಾಗಲೂ ಉಚಿತ)',
    boxCustomerDesc: 'ಗ್ರಾಹಕರಿಗೆ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವಿಲ್ಲ (Sec 10A PSS Act)',
    boxBankMdr: 'ಕಾನೂನುಬದ್ಧ MDR / ಇಂಟರ್‌ಚೇಂಜ್',
    boxMerchantGets: 'ವ್ಯಾಪಾರಿಗೆ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಜಮೆಯಾಗುವ ಮೊತ್ತ',
    receiptTitle: 'ವಹಿವಾಟಿನ ರಸೀದಿ ಸಾರಾಂಶ',
    customerScanned: 'ಗ್ರಾಹಕರ ಖಾತೆಯಿಂದ ಕಡಿತವಾದ ಮೊತ್ತ:',
    noExtraFee: 'ಗ್ರಾಹಕರಿಗೆ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವಿಲ್ಲ (100% ಉಚಿತ)',
    bankDeduction: 'ಕಡಿತ / ಇಂಟರ್‌ಚೇಂಜ್:',
    netShopCredit: 'ವ್ಯಾಪಾರಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುವ ನಿವ್ವಳ ಮೊತ್ತ:',
    acquirerContractHeading: 'ವ್ಯಾಪಾರಿ ಸೆಟಲ್‌ಮೆಂಟ್ ಪ್ರಮುಖ ಸೂಚನೆ:',
    officialRulesHeading: 'ಪಾವತಿ ವಿಧಾನವಾರು ಅಧಿಕೃತ ನಿಯಮಗಳು',
    rule1Title: '1. ಬ್ಯಾಂಕ್ ಖಾತೆ UPI (ಸಾಮಾನ್ಯ)',
    rule1Desc:
      'ಸೆಕ್ಷನ್ 10A PSS ಕಾಯ್ದೆಯಡಿ 0% MDR. ಯಾವುದೇ ಮೊತ್ತಕ್ಕೂ ವ್ಯಾಪಾರಿಗಳಿಂದ ಅಥವಾ ಗ್ರಾಹಕರಿಂದ ಯಾವುದೇ ಶುಲ್ಕ ವಿಧಿಸಲಾಗುವುದಿಲ್ಲ.',
    rule2Title: '2. ಪ್ರಿಪೇಯ್ಡ್ ವಾಲೆಟ್ / PPI (Paytm/PhonePe)',
    rule2Desc:
      'NPCI ಸುತ್ತೋಲೆ: ಗ್ರಾಹಕರಿಗೆ ₹0. ₹2,000 ವರೆಗೆ 0%. ₹2,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೊತ್ತಕ್ಕೆ 1.10% ವರೆಗೆ ಇಂಟರ್‌ಚೇಂಜ್ ಅನ್ವಯಿಸುತ್ತದೆ.',
    rule3Title: '3. ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ UPI',
    rule3Desc:
      'NPCI ನಿಯಮ: ಗ್ರಾಹಕರಿಗೆ ₹0. ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳಿಗೆ ₹2,000 ವರೆಗೆ 0% Nil MDR. ನಂತರ ಬ್ಯಾಂಕ್ ಒಪ್ಪಂದದಂತೆ ದರಗಳು.',
    rule4Title: '4. ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ (P2P)',
    rule4Desc: 'P2P ವರ್ಗಾವಣೆಗಳು ಯಾವುದೇ ಮೊತ್ತಕ್ಕೂ ಯಾವಾಗಲೂ 100% ಉಚಿತ.',
    lastVerified: 'ನಿಯಮಗಳ ಪರಿಶೀಲನೆ: ಪ್ರಸ್ತುತ ಅಧಿಕೃತ ನಿರ್ದೇಶನಗಳು',
    officialSources: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮತ್ತು ನಿಯಂತ್ರಕ ಮೂಲಗಳು:',
    source1: 'NPCI UPI ಅಧಿಕೃತ ಸುತ್ತೋಲೆಗಳು',
    source2: 'NPCI PPI-on-UPI FAQ',
    source3: 'NPCI ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಮಾರ್ಗಸೂಚಿಗಳು',
    source4: 'RBI ಜೀರೋ-MDR ಅಧಿಸೂಚನೆ (PSS Act Sec 10A)',
  },
};

// =========================================================================
// 2. MAIN REACT COMPONENT
// =========================================================================
export function App() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [amountInput, setAmountInput] = useState<string>('5000');
  const [txnType, setTxnType] = useState<TransactionType>('P2M');
  const [paymentInstrument, setPaymentInstrument] = useState<PaymentInstrument>('bank_account');
  const [merchantCategory, setMerchantCategory] = useState<MerchantCategoryKey>('general_merchant');

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Single source of truth calculation engine based strictly on verified regulations:
  const result = useMemo(() => {
    return calculateUpiMdr({
      amount: amountInput,
      transactionType: txnType,
      paymentInstrument,
      merchantCategory,
    });
  }, [amountInput, txnType, paymentInstrument, merchantCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* 1. Header with App Title & Language Switcher */}
      <header className="sticky top-0 z-40 border-b border-blue-900/20 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-900 font-black shadow-md text-xl">
              ₹
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {t.appTitle}
              </h1>
              <p className="text-[11px] text-blue-200 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {deferredPrompt && !isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-2xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.installApp}
              </button>
            )}

            <div className="relative flex items-center bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 px-2 py-1 transition">
              <Languages className="w-4 h-4 text-blue-200 mr-1.5 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
              >
                {LANGUAGES.map((item) => (
                  <option key={item.code} value={item.code} className="text-slate-900 bg-white font-medium">
                    {item.nativeName} — {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 1-Tap Language Quick Switcher Bar with clear Odia / Oriya badge */}
        <div className="border-t border-white/10 bg-black/20 px-4 py-1.5 overflow-x-auto no-scrollbar">
          <div className="mx-auto flex max-w-5xl items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-blue-300 mr-1 shrink-0 hidden sm:inline">
              {t.selectLanguage}:
            </span>
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code as SupportedLanguage)}
                className={
                  lang === item.code
                    ? 'rounded-lg bg-white px-2.5 py-0.5 text-xs font-black text-blue-950 shadow-2xs shrink-0 cursor-pointer'
                    : 'rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-blue-100 hover:bg-white/20 shrink-0 cursor-pointer'
                }
              >
                {item.nativeName}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Top Statutory Zero-MDR Directive Banner (Section 10A PSS Act) */}
      <div className="border-b border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-950 shadow-2xs">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-emerald-950 block text-sm sm:inline mr-1">
                {t.statutoryBannerTitle}
              </span>
              <span className="text-emerald-800 font-medium block sm:inline">
                {t.statutoryBannerSubtext}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 text-white px-3 py-1 font-extrabold text-[11px] shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sec 10A PSS Act Active
            </span>
          </div>
        </div>
      </div>

      {/* 3. Educational & Acquirer Disclaimer */}
      <div className="border-b border-blue-200 bg-blue-50/70 px-4 py-2.5 text-blue-950 text-xs">
        <div className="mx-auto max-w-5xl flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-black text-blue-900 mr-1">{t.disclaimerBannerTitle}:</strong>
            <span className="text-slate-700">{t.disclaimerBannerText}</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">

        {/* ========================================================================= */}
        {/* STEP 1: TRANSACTION & PAYMENT INSTRUMENT INPUT                            */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-2 border-blue-300 bg-white p-5 sm:p-7 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block">
                {t.txnStepTitle}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {t.amountLabel}
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              Current Statutory Framework
            </span>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-blue-700">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50/20 py-3.5 pl-10 pr-4 text-2xl sm:text-3xl font-black text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-hidden transition shadow-inner"
                placeholder={t.amountPlaceholder}
                autoFocus
              />
            </div>

            {/* Validation warning if negative */}
            {result.validationWarning && (
              <div className="text-xs text-amber-700 font-bold flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{result.validationWarning}</span>
              </div>
            )}

            {/* Quick Boundary Preset Helper Buttons */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold">
                {paymentInstrument === 'bank_account' ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Bank Account UPI: 100% Free at any amount
                  </span>
                ) : result.amount > 0 && result.amount <= 2000 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ≤ ₹2,000: Nil Fee / Free
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-900 border border-blue-200">
                    <Info className="w-3.5 h-3.5 text-blue-700" />
                    &gt; ₹2,000: Acquirer / Interchange applies
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700">Preset:</span>
                <button
                  type="button"
                  onClick={() => setAmountInput('500')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹500
                </button>
                <button
                  type="button"
                  onClick={() => setAmountInput('2000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹2,000
                </button>
                <button
                  type="button"
                  onClick={() => setAmountInput('5000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹5,000
                </button>
                <button
                  type="button"
                  onClick={() => setAmountInput('10000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹10,000
                </button>
                <button
                  type="button"
                  onClick={() => setAmountInput('100000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer hidden sm:inline"
                >
                  ₹1,00,000
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Type: P2P vs P2M */}
          <div className="pt-2">
            <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
              {t.txnTypeLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTxnType('P2P')}
                className={
                  txnType === 'P2P'
                    ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                    : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" />
                    {t.p2pPersonToPerson}
                  </span>
                  {txnType === 'P2P' && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                </div>
                <span className="block text-[10px] text-slate-500 font-semibold mt-1">
                  100% Free at any amount (₹0 MDR for sender & receiver)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTxnType('P2M')}
                className={
                  txnType === 'P2M'
                    ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/20'
                    : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-blue-700" />
                    {t.p2mMerchant}
                  </span>
                  {txnType === 'P2M' && <Check className="w-4 h-4 text-blue-700 shrink-0" />}
                </div>
                <span className="block text-[10px] text-slate-500 font-semibold mt-1">
                  Payment to merchants, shops, QR codes and online checkouts
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Options for P2M */}
          {txnType === 'P2M' && (
            <div className="space-y-4 pt-3 border-t border-slate-100">
              {/* Payment Instrument (3 Distinct Regulatory Frameworks) */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
                  {t.paymentModeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* 1. Bank Account UPI (Golden Standard) */}
                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('bank_account')}
                    className={
                      paymentInstrument === 'bank_account'
                        ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/20'
                        : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span className="truncate">{t.modeBank}</span>
                      </span>
                      {paymentInstrument === 'bank_account' && (
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-emerald-800 font-bold mt-1">
                      {t.modeBankSub}
                    </span>
                  </button>

                  {/* 2. Prepaid Wallet / PPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('ppi_wallet')}
                    className={
                      paymentInstrument === 'ppi_wallet'
                        ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/20'
                        : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-indigo-700" />
                        <span className="truncate">{t.modeWallet}</span>
                      </span>
                      {paymentInstrument === 'ppi_wallet' && (
                        <Check className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-indigo-800 font-bold mt-1">
                      {t.modeWalletSub}
                    </span>
                  </button>

                  {/* 3. RuPay Credit Card on UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('rupay_credit_card')}
                    className={
                      paymentInstrument === 'rupay_credit_card'
                        ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-purple-600 bg-purple-50 text-purple-950 ring-2 ring-purple-600/20'
                        : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-purple-700" />
                        <span className="truncate">{t.modeRupayCC}</span>
                      </span>
                      {paymentInstrument === 'rupay_credit_card' && (
                        <Check className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-purple-800 font-bold mt-1">
                      {t.modeRupayCCSub}
                    </span>
                  </button>
                </div>
              </div>

              {/* Merchant Category (Relevant for Wallets and Cards) */}
              {paymentInstrument !== 'bank_account' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
                    {t.merchantCatLabel}
                  </label>
                  <select
                    value={merchantCategory}
                    onChange={(e) => setMerchantCategory(e.target.value as MerchantCategoryKey)}
                    className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden cursor-pointer"
                  >
                    <option value="general_merchant">{t.catGeneral}</option>
                    <option value="small_offline_merchant">{t.catSmallOffline}</option>
                    <option value="fuel_and_utilities">{t.catFuelUtilities}</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: RESULTS - BREAKDOWN & LEGAL STATUS                                */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-3 border-emerald-500/80 bg-white p-5 sm:p-7 shadow-xl overflow-hidden space-y-5">
          {/* Header */}
          <div
            className={
              result.isMdrLegallyZero
                ? 'p-4 sm:p-5 flex items-center justify-between text-white -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700'
                : 'p-4 sm:p-5 flex items-center justify-between text-white -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700'
            }
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-full bg-white/20 p-2 text-white">
                <Store className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                  {REGULATORY_FRAMEWORKS[paymentInstrument].titleEn}
                </span>
                <h3 className="text-base sm:text-xl font-black">
                  {t.calculationsTitle}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-extrabold backdrop-blur-xs">
              {result.isMdrLegallyZero ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  {t.zeroMdrBadge}
                </>
              ) : paymentInstrument === 'ppi_wallet' ? (
                <>
                  <TrendingDown className="w-4 h-4 text-indigo-200" />
                  {t.ecosystemFeeBadge}
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-purple-200" />
                  {t.acquirerFeeBadge}
                </>
              )}
            </span>
          </div>

          {/* ULTRA-PROMINENT STATUTORY SUMMARY STRIP */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-bold">
                <span className="text-slate-300">
                  Customer debited: <strong className="text-white text-base font-black">{result.formattedAmount}</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-emerald-300">
                  Customer Surcharge: <strong className="text-emerald-400 text-base font-black">₹0 (Prohibited by Law)</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-amber-300">
                  Merchant Net: <strong className="text-amber-400 text-base font-black">{formatCurrencyINR(result.estimatedMerchantSettlement, true)}</strong>
                </span>
              </div>
              <div className="shrink-0 rounded-xl bg-white/10 px-3 py-1 text-xs font-black text-emerald-200 border border-white/20">
                {result.isMdrLegallyZero ? 'Statutory 0% Zero-MDR' : `${result.interchangeRatePercent}% Interchange/Fee`}
              </div>
            </div>
          </div>

          {/* TRANSPARENT STEP-BY-STEP CALCULATION FORMULA */}
          <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/70 p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-indigo-900 font-black">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                {t.formulaTitle}:
              </span>
              <span className="text-[11px] font-bold text-indigo-700">
                {result.isMdrLegallyZero ? 'Statutory Mandate' : 'Calculated Rule'}
              </span>
            </div>
            <p className="font-mono text-sm sm:text-base font-black text-indigo-950 bg-white/80 rounded-xl p-2.5 border border-indigo-200">
              {result.formulaText}
            </p>
          </div>

          {/* 4 Cards: Customer Paid | Customer Surcharge | Statutory/Ecosystem Fee | Net Merchant Credit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-4">
            {/* 1. Customer Scanned Amount */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-extrabold uppercase text-slate-500 block">
                {t.boxCustomerPaid}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
                {result.formattedAmount}
              </span>
              <span className="mt-2 text-xs font-semibold text-slate-500 block">
                Debited from customer account
              </span>
            </div>

            {/* 2. Customer Surcharge (ALWAYS ₹0) */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/80 p-4 ring-2 ring-emerald-500/20">
              <span className="text-[11px] font-extrabold uppercase text-emerald-800 block">
                {t.boxCustomerExtra}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 block mt-1">
                {t.boxZeroCustomer}
              </span>
              <span className="mt-2 text-xs font-bold text-emerald-800 flex items-center gap-1 leading-snug">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {t.boxCustomerDesc}
              </span>
            </div>

            {/* 3. Statutory MDR / Ecosystem Interchange */}
            <div
              className={
                result.isMdrLegallyZero
                  ? 'rounded-2xl border-2 p-4 border-emerald-200 bg-emerald-50/70'
                  : 'rounded-2xl border-2 p-4 border-amber-300 bg-amber-50/80'
              }
            >
              <span
                className={
                  result.isMdrLegallyZero
                    ? 'text-[11px] font-extrabold uppercase block text-emerald-800'
                    : 'text-[11px] font-extrabold uppercase block text-amber-900'
                }
              >
                {t.boxBankMdr}
              </span>
              <span
                className={
                  result.isMdrLegallyZero
                    ? 'text-2xl sm:text-3xl font-black block mt-1 text-emerald-700'
                    : 'text-2xl sm:text-3xl font-black block mt-1 text-amber-950'
                }
              >
                {result.isMdrLegallyZero
                  ? '₹0'
                  : formatCurrencyINR(result.estimatedInterchangeAmount, true)}
              </span>
              <span
                className={
                  result.isMdrLegallyZero
                    ? 'mt-2 text-xs font-bold block text-emerald-800'
                    : 'mt-2 text-xs font-bold block text-amber-900'
                }
              >
                {result.isMdrLegallyZero
                  ? 'Statutory 0% MDR'
                  : paymentInstrument === 'ppi_wallet'
                  ? `${result.interchangeRatePercent}% Ecosystem Interchange`
                  : `~${result.interchangeRatePercent}% Indicative Acquirer MDR`}
              </span>
            </div>

            {/* 4. Net Settlement */}
            <div className="rounded-2xl border-2 border-blue-400 bg-blue-50/90 p-4">
              <span className="text-[11px] font-extrabold uppercase text-blue-900 block">
                {t.boxMerchantGets}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-blue-950 block mt-1">
                {formatCurrencyINR(result.estimatedMerchantSettlement, true)}
              </span>
              <span className="mt-2 text-xs font-bold text-blue-800 block">
                {result.isMdrLegallyZero ? 'Full 100% payout' : 'Net indicative settlement'}
              </span>
            </div>
          </div>

          {/* Commercial Acquirer Notice Box */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4 space-y-2">
            <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">
              {'📢 ' + t.acquirerContractHeading}
            </span>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {lang === 'te'
                ? result.commercialSettlementDisclaimerTe
                : lang === 'or'
                ? REGULATORY_FRAMEWORKS[paymentInstrument].acquirerCommercialNoteTe
                : result.commercialSettlementDisclaimerEn}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: OFFICIAL REGULATORY FRAMEWORKS (100% TRANSLATED)                   */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-black">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm sm:text-base">
              {t.officialRulesHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Rule 1: Bank Account UPI */}
            <div className="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200 space-y-1.5">
              <span className="font-black text-emerald-900 block flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4 text-emerald-700" />
                {t.rule1Title}
              </span>
              <p className="text-emerald-950 font-medium leading-relaxed">
                {t.rule1Desc}
              </p>
            </div>

            {/* Rule 2: Prepaid Wallet */}
            <div className="rounded-2xl bg-indigo-50/80 p-4 border border-indigo-200 space-y-1.5">
              <span className="font-black text-indigo-900 block flex items-center gap-1.5 text-sm">
                <Wallet className="w-4 h-4 text-indigo-700" />
                {t.rule2Title}
              </span>
              <p className="text-indigo-950 font-medium leading-relaxed">
                {t.rule2Desc}
              </p>
            </div>

            {/* Rule 3: RuPay Credit Card */}
            <div className="rounded-2xl bg-purple-50/80 p-4 border border-purple-200 space-y-1.5">
              <span className="font-black text-purple-900 block flex items-center gap-1.5 text-sm">
                <CreditCard className="w-4 h-4 text-purple-700" />
                {t.rule3Title}
              </span>
              <p className="text-purple-950 font-medium leading-relaxed">
                {t.rule3Desc}
              </p>
            </div>

            {/* Rule 4: P2P */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-1.5">
              <span className="font-black text-slate-900 block flex items-center gap-1.5 text-sm">
                <User className="w-4 h-4 text-slate-700" />
                {t.rule4Title}
              </span>
              <p className="text-slate-700 font-medium leading-relaxed">
                {t.rule4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 4: VERIFIED REGULATORY CITATIONS & SOURCES                           */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-slate-200 bg-slate-100/90 p-4 text-xs space-y-2 text-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] font-bold text-slate-800 border-b border-slate-200 pb-2">
            <span>{t.lastVerified}</span>
            <span className="text-emerald-700 font-extrabold">Section 10A PSS Act Compliant (Zero Customer Surcharge)</span>
          </div>

          <div className="pt-1">
            <span className="font-black text-slate-900 block mb-1.5">
              {t.officialSources}
            </span>
            <div className="flex flex-wrap gap-3 text-xs text-blue-700 font-bold">
              <a
                href={UPI_REGULATORY_META.officialLinks[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source1}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={UPI_REGULATORY_META.officialLinks[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source2}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={UPI_REGULATORY_META.officialLinks[2].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source3}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={UPI_REGULATORY_META.officialLinks[3].url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source4}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const formatINR = formatCurrencyINR;

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
export default App;
