import { createRoot } from 'react-dom/client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Store,
  Languages,
  Download,
  Check,
  Calendar,
  User,
  Fuel,
  TrendingUp,
  ExternalLink,
  CreditCard,
  Wallet,
  AlertTriangle,
  Building2,
  HelpCircle,
} from 'lucide-react';
import './index.css';
import { calculateUpiMdr, formatCurrencyINR } from './calculator/calculateMdr';
import { MerchantCategoryKey, PaymentInstrument, TransactionType } from './types/upi';
import { UPI_REGULATORY_META } from './rules/upiRules';

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
    appTitle: 'UPI MDR Calculator India',
    subtitle: 'Independent Educational Tool • RBI, NPCI & DFS Circulars',
    bannerTitle: 'New UPI MDR Rules — Effective 15 October 2026',
    bannerSubtext: 'Calculations shown for the new MDR framework apply from 15 October 2026. Until 14 Oct 2026, standard bank UPI continues at 0% MDR.',
    viewNewRules: 'New rules — From 15 Oct 2026',
    viewCurrentRules: 'Current rules — Until 14 Oct 2026',
    installApp: 'Install App',
    selectLanguage: 'Language',
    disclaimerBannerTitle: 'Informational & Educational Tool',
    disclaimerBannerText:
      'Actual charges may depend on merchant category (MCC), acquiring bank/payment provider agreements, payment instrument, and applicable NPCI/RBI circulars. This calculator is not an official tool of RBI, NPCI, or the Government of India.',
    txnStepTitle: '1. Enter Payment Details',
    amountLabel: 'Transaction Amount (in ₹)',
    amountPlaceholder: 'Enter amount (e.g. 5000)',
    txnTypeLabel: 'Transaction Type',
    p2pPersonToPerson: 'P2P (Person to Person Transfer)',
    p2mMerchant: 'P2M (Shop / Merchant Payment)',
    paymentModeLabel: 'Payment Instrument (3 Explicit Modes)',
    modeBank: 'Bank Account UPI (Standard)',
    modeRupayCC: 'RuPay Credit Card on UPI',
    modeWallet: 'Prepaid Wallet / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'Merchant Category',
    catNormal: 'Normal P2M Merchant (0.40%, Cap ₹300)',
    catSmall: 'Small Merchant / P2PM QR (≤ ₹1L/month: 0% Free)',
    catEssential: 'Essential & Fuel (Railways, Telecom, Fuel: Flat ₹5)',
    catCapital: 'Capital Markets (Mutual Funds, Stocks: 0.02%, Cap ₹300)',
    formulaTitle: 'Calculation Formula',
    calculationsTitle: 'Transaction Breakdown & Charge Bearer',
    freeBadge: '100% Free / ₹0 Fee',
    feeBadge: 'Merchant MDR Applicable',
    boxCustomerPaid: 'Customer Pays (Scanned)',
    boxCustomerExtra: 'Customer Surcharge',
    boxZeroCustomer: '₹0 (Always Free)',
    boxCustomerDesc: 'Customer NEVER pays extra fee (Sec 10A PSS Act)',
    boxBankMdr: 'Merchant MDR / Ecosystem Fee',
    boxMerchantGets: 'Merchant Net Settlement',
    receiptTitle: 'Transaction Summary Receipt',
    customerScanned: 'Customer debited amount:',
    noExtraFee: 'Zero convenience fee for customer (100% free)',
    bankDeduction: 'Payment system MDR deduction:',
    netShopCredit: 'Net amount credited to merchant account:',
    whoBearsNotice: 'Who bears this charge?',
    step3Title: 'Official Calculation Paths & Payment Instrument Rules',
    card1Title: '1. P2P (Person to Person)',
    card1Desc: '₹0 MDR at any amount. Sending ₹1,000, ₹10,000 or ₹1 Lakh to friends or family is 100% free with zero fees.',
    card2Title: '2. Normal P2M Merchant (Bank UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. Above ₹2,000 → 0.40% on total amount, capped at ₹300 (at ₹75,000+).',
    card3Title: '3. RuPay Credit Card on UPI',
    card3Desc: '≤ ₹2,000 & Small Vendors → Nil MDR (0%). Above ₹2,000 at regular merchants → ~2.0% standard credit card MDR.',
    card4Title: '4. Essential / Fuel / Railways',
    card4Desc: 'Railways, telecom, fuel, insurance, and utilities pay a Flat ₹5 MDR above ₹2,000, NOT a percentage (e.g. ₹10,000 fuel = ₹5 fee).',
    card5Title: '5. Capital Markets',
    card5Desc: 'Mutual funds, stocks, and securities pay only 0.02% (Capped at ₹300). E.g. ₹10,000 payment = ₹2 MDR.',
    card6Title: '6. Small Merchants (P2PM QR)',
    card6Desc: 'Small shops & street vendors receiving ≤ ₹1 Lakh/month via UPI QR continue to get 0% Zero MDR on all transactions!',
    lastVerified: 'Rules last verified: 30 September 2026',
    officialSources: 'Official Government & Regulatory Sources:',
    source1: 'NPCI UPI Circulars (Official Listing)',
    source2: 'Department of Financial Services — UPI MDR FAQ',
    source3: 'Government/PIB explanation of the new UPI MDR framework',
  },
  or: {
    appTitle: 'UPI MDR କ୍ୟାଲକୁଲେଟର (ଭାରତ)',
    subtitle: 'ସ୍ୱତନ୍ତ୍ର ଶିକ୍ଷାମୂଳକ ସାଧନ • RBI, NPCI ଏବଂ ଅର୍ଥ ମନ୍ତ୍ରଣାଳୟ ନିର୍ଦ୍ଦେଶାବଳୀ',
    bannerTitle: 'ନୂତନ UPI MDR ନିୟମ — ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ ଲାଗୁ',
    bannerSubtext: 'ନୂତନ ନିୟମ ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ ଲାଗୁ ହେବ। ୧୪ ଅକ୍ଟୋବର ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ ସାଧାରଣ ବ୍ୟାଙ୍କ UPI ରେ ୦% MDR ଜାରି ରହିବ।',
    viewNewRules: 'ନୂତନ ନିୟମ — ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ',
    viewCurrentRules: 'ବର୍ତ୍ତମାନର ନିୟମ — ୧୪ ଅକ୍ଟୋବର ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ',
    installApp: 'ଆପ୍ ଇନଷ୍ଟଲ କରନ୍ତୁ',
    selectLanguage: 'ଭାଷା',
    disclaimerBannerTitle: 'ସୂଚନା ଏବଂ ଶିକ୍ଷାମୂଳକ ଉଦ୍ଦେଶ୍ୟ ପାଇଁ',
    disclaimerBannerText:
      'ପ୍ରକୃତ ଶୁଳ୍କ ବ୍ୟବସାୟୀ ବର୍ଗ (MCC), ବ୍ୟାଙ୍କ ଚୁକ୍ତିନାମା ଏବଂ NPCI/RBI ପରିପତ୍ର ଉପରେ ନିର୍ଭର କରେ। ଏହା ସରକାର କିମ୍ବା RBI/NPCI ର ସରକାରୀ ଟୁଲ୍ ନୁହେଁ।',
    txnStepTitle: '୧. ପେମେଣ୍ଟ ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ',
    amountLabel: 'କାରବାର ରାଶି (₹ ରେ)',
    amountPlaceholder: 'ରାଶି ଲେଖନ୍ତୁ (ଯଥା: 5000)',
    txnTypeLabel: 'କାରବାର ପ୍ରକାର (Transaction Type)',
    p2pPersonToPerson: 'P2P (ବ୍ୟକ୍ତିଗତ ସ୍ଥାନାନ୍ତର - ୧୦୦% ମାଗଣା)',
    p2mMerchant: 'P2M (ଦୋକାନୀ / ବ୍ୟବସାୟୀଙ୍କୁ ଦେୟ)',
    paymentModeLabel: 'ପେମେଣ୍ଟ ମାଧ୍ୟମ (Payment Instrument)',
    modeBank: 'ବ୍ୟାଙ୍କ ଖାତା UPI (ସାଧାରଣ)',
    modeRupayCC: 'ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ UPI (RuPay CC)',
    modeWallet: 'ପ୍ରିପେଡ୍ ୱାଲେଟ୍ / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'ବ୍ୟବସାୟୀ ବର୍ଗ (Merchant Category)',
    catNormal: 'ସାଧାରଣ ବ୍ୟବସାୟୀ / ଦୋକାନ (୦.୪୦%, ସର୍ବାଧିକ ₹୩୦୦)',
    catSmall: 'କ୍ଷୁଦ୍ର ବ୍ୟବସାୟୀ / P2PM QR (ମାସିକ ≤ ₹୧ ଲକ୍ଷ: ୦% ମାଗଣା)',
    catEssential: 'ଅତ୍ୟାବଶ୍ୟକ ସେବା ଓ ଇନ୍ଧନ (ଫ୍ଲାଟ୍ ₹୫)',
    catCapital: 'ପୁଞ୍ଜି ବଜାର, ମ୍ୟୁଚୁଆଲ୍ ଫଣ୍ଡ (୦.୦୨%, ସର୍ବାଧିକ ₹୩୦୦)',
    formulaTitle: 'ଗଣନା ସୂତ୍ର (Calculation Formula)',
    calculationsTitle: 'କାରବାର ହିସାବ ଏବଂ ଶୁଳ୍କ କିଏ ବହନ କରିବ?',
    freeBadge: '୧୦୦% ମାଗଣା (₹୦ ଶୁଳ୍କ)',
    feeBadge: 'ବ୍ୟବସାୟୀ MDR କଟାଯିବ',
    boxCustomerPaid: 'ଗ୍ରାହକ ଦେଉଥିବା ରାଶି',
    boxCustomerExtra: 'ଗ୍ରାହକ MDR ଶୁଳ୍କ',
    boxZeroCustomer: '₹୦ (ସର୍ବଦା ମାଗଣା)',
    boxCustomerDesc: 'ଗ୍ରାହକଙ୍କ ଠାରୁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନିଆଯିବ ନାହିଁ (Sec 10A PSS Act)',
    boxBankMdr: 'ବ୍ୟବସାୟୀ MDR (ବ୍ୟାଙ୍କ କଟନ)',
    boxMerchantGets: 'ବ୍ୟବସାୟୀଙ୍କ ବ୍ୟାଙ୍କରେ ଜମା',
    receiptTitle: 'କାରବାର ରସିଦ ବିବରଣୀ',
    customerScanned: 'ଗ୍ରାହକଙ୍କ ଖାତାରୁ କଟାଯାଇଥିବା ରାଶି:',
    noExtraFee: 'ଗ୍ରାହକଙ୍କ ପାଇଁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନାହିଁ (୧୦୦% ମାଗଣା)',
    bankDeduction: 'ବ୍ୟାଙ୍କ MDR କଟନ:',
    netShopCredit: 'ବ୍ୟବସାୟୀଙ୍କ ଖାତାରେ ଜମା ହେବାକୁ ଥିବା ନିଟ୍ ରାଶି:',
    whoBearsNotice: 'ଏହି ଶୁଳ୍କ କିଏ ବହନ କରେ?',
    step3Title: 'ଅଫିସିଆଲ୍ ଗଣନା ମାର୍ଗ ଏବଂ ନିୟମାବଳୀ',
    card1Title: '୧. P2P (ବ୍ୟକ୍ତିଗତ ସ୍ଥାନାନ୍ତର)',
    card1Desc: 'ଯେକୌଣସି ରାଶି ପାଇଁ ₹୦ MDR। ସାଙ୍ଗ ବା ପରିବାରକୁ ଟଙ୍କା ପଠାଇବା ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା।',
    card2Title: '୨. ସାଧାରଣ ବ୍ୟବସାୟୀ (ବ୍ୟାଙ୍କ UPI)',
    card2Desc: '₹୨,୦୦୦ ପର୍ଯ୍ୟନ୍ତ ₹୦। ₹୨,୦୦୦ ଉପରେ ୦.୪୦% (ସର୍ବାଧିକ ₹୩୦୦ କ୍ୟାପ୍)।',
    card3Title: '୩. ରୁପେ କ୍ରେଡିଟ୍ କାର୍ଡ UPI',
    card3Desc: '₹୨,୦୦୦ ପର୍ଯ୍ୟନ୍ତ ୦% (Nil MDR)। ₹୨,୦୦୦ ଉପରେ ସାଧାରଣ ~୨.୦% କ୍ରେଡିଟ୍ କାର୍ଡ MDR।',
    card4Title: '୪. ଅତ୍ୟାବଶ୍ୟକ ସେବା ଓ ଇନ୍ଧନ',
    card4Desc: 'ରେଳବାଇ, ପେଟ୍ରୋଲ, ଟେଲିକମ୍ ପାଇଁ ₹୨,୦୦୦ ଉପରେ ଫ୍ଲାଟ୍ ₹୫ MDR, କୌଣସି ଶତକଡ଼ା ନୁହେଁ।',
    card5Title: '୫. ପୁଞ୍ଜି ବଜାର ଓ ମ୍ୟୁଚୁଆଲ୍ ଫଣ୍ଡ',
    card5Desc: 'ମ୍ୟୁଚୁଆଲ୍ ଫଣ୍ଡ ଏବଂ ଶେୟାର ବଜାର ପାଇଁ ମାତ୍ର ୦.୦୨% (ସର୍ବାଧିକ ₹୩୦୦ କ୍ୟାପ୍)।',
    card6Title: '୬. କ୍ଷୁଦ୍ର ବ୍ୟବସାୟୀ (P2PM QR)',
    card6Desc: 'ମାସିକ ≤ ₹୧ ଲକ୍ଷ ଗ୍ରହଣ କରୁଥିବା ଛୋଟ ଦୋକାନୀଙ୍କ ପାଇଁ ସବୁବେଳେ ୦% ମାଗଣା।',
    lastVerified: 'ଶେଷ ଯାଞ୍ଚ ତାରିଖ: ୩୦ ସେପ୍ଟେମ୍ବର ୨୦୨୬',
    officialSources: 'ସରକାରୀ ଓ ନିୟାମକ ଉତ୍ସ:',
    source1: 'NPCI UPI ସର୍କୁଲାର୍ (ଅଫିସିଆଲ୍ ତାଲିକା)',
    source2: 'ଆର୍ଥିକ ସେବା ବିଭାଗ (DFS) FAQ',
    source3: 'ପ୍ରେସ୍ ଇନଫରମେସନ୍ ବ୍ୟୁରୋ (PIB)',
  },
  te: {
    appTitle: 'UPI MDR కాలిక్యులేటర్ (భారత్)',
    subtitle: 'స్వతంత్ర విద్యా సాధనం • RBI, NPCI & ఆర్థిక మంత్రిత్వ శాఖ మార్గదర్శకాలు',
    bannerTitle: 'కొత్త UPI MDR నిబంధనలు — 15 అక్టోబర్ 2026 నుండి అమలు',
    bannerSubtext: 'కొత్త MDR నిబంధనలు 15 అక్టోబర్ 2026 నుండి వర్తిస్తాయి. 14 అక్టోబర్ 2026 వరకు సాధారణ బ్యాంక్ UPI 0% MDR తో కొనసాగుతుంది.',
    viewNewRules: 'కొత్త నిబంధనలు — 15 అక్టోబర్ 2026 నుండి',
    viewCurrentRules: 'ప్రస్తుత నిబంధనలు — 14 అక్టోబర్ 2026 వరకు',
    installApp: 'యాప్ ఇన్‌స్టాల్',
    selectLanguage: 'భాష',
    disclaimerBannerTitle: 'విద్యా మరియు సమాచార ప్రయోజనాల కోసం మాత్రమే',
    disclaimerBannerText:
      'వాస్తవ ఛార్జీలు వ్యాపారి కేటగిరీ, బ్యాంక్ లేదా పేమెంట్ గేట్‌వే ఒప్పందాలు మరియు NPCI/RBI సర్క్యులర్ల ప్రకారం మారవచ్చు. ఇది RBI, NPCI లేదా ప్రభుత్వ అధికారిక సాధనం కాదు.',
    txnStepTitle: '1. చెల్లింపు వివరాలు నమోదు చేయండి',
    amountLabel: 'చెల్లింపు మొత్తం (₹ లలో)',
    amountPlaceholder: 'మొత్తం నమోదు చేయండి (ఉదా: 5000)',
    txnTypeLabel: 'లావాదేవీ రకం (Transaction Type)',
    p2pPersonToPerson: 'P2P (వ్యక్తి నుండి వ్యక్తికి బదిలీ)',
    p2mMerchant: 'P2M (షాపులు / వ్యాపారులకు చెల్లింపు)',
    paymentModeLabel: 'చెల్లింపు సాధనం (Payment Instrument)',
    modeBank: 'బ్యాంక్ ఖాతా UPI (ప్రామాణికం)',
    modeRupayCC: 'రూపే క్రెడిట్ కార్డ్ UPI (RuPay CC)',
    modeWallet: 'వాలెట్ / PPI (Paytm/PhonePe Wallet)',
    merchantCatLabel: 'వ్యాపారి కేటగిరీ',
    catNormal: 'సాధారణ వ్యాపారి / దుకాణం (0.40%, గరిష్ట పరిమితి ₹300)',
    catSmall: 'చిన్న వ్యాపారులు / P2PM QR (నెలకు ≤ ₹1 లక్ష: 0% ఉచితం)',
    catEssential: 'నిత్యావసరాలు & ఇంధనం (రైల్వేలు, పెట్రోల్: ఫ్లాట్ ₹5)',
    catCapital: 'క్యాపిటల్ మార్కెట్లు (మ్యూచువల్ ఫండ్స్, షేర్లు: 0.02%, గరిష్ట పరిమితి ₹300)',
    formulaTitle: 'గణన సూత్రం (Calculation Formula)',
    calculationsTitle: 'లావాదేవీ రసీదు & ఛార్జీ ఎవరు భరిస్తారు?',
    freeBadge: '100% ఉచితం (₹0 ఫీజు)',
    feeBadge: 'వ్యాపారి MDR వర్తిస్తుంది',
    boxCustomerPaid: 'కస్టమర్ చెల్లించేది',
    boxCustomerExtra: 'కస్టమర్ MDR',
    boxZeroCustomer: '₹0 (పూర్తిగా ఉచితం)',
    boxCustomerDesc: 'కస్టమర్ నుండి అదనపు ఫీజు తీసుకోకూడదు (సెక్షన్ 10A PSS చట్టం)',
    boxBankMdr: 'వ్యాపారి MDR (బ్యాంక్ కట్)',
    boxMerchantGets: 'వ్యాపారి బ్యాంకులో జమయ్యేది',
    receiptTitle: 'లావాదేవీ రసీదు సారాంశం',
    customerScanned: 'కస్టమర్ ఖాతా నుండి కట్ అయిన మొత్తం:',
    noExtraFee: 'కస్టమర్‌కు ఎలాంటి అదనపు రుసుము లేదు',
    bankDeduction: 'బ్యాంక్ MDR కటింగ్:',
    netShopCredit: 'షాపు యజమాని బ్యాంక్ ఖాతాలో జమ అయ్యే నికర మొత్తం:',
    whoBearsNotice: 'ఈ ఛార్జీని ఎవరు భరిస్తారు?',
    step3Title: 'అధికారిక గణన మార్గాలు & సాధనాల నిబంధనలు',
    card1Title: '1. P2P (వ్యక్తి నుండి వ్యక్తికి బదిలీ)',
    card1Desc: 'ఏ మొత్తానికైనా ₹0 MDR. స్నేహితులు, కుటుంబ సభ్యులకు పంపే నగదు బదిలీలకు 100% ఉచితం.',
    card2Title: '2. సాధారణ వ్యాపారి (బ్యాంక్ UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. ₹2,000 దాటితే 0.40% (గరిష్ట పరిమితి ₹300).',
    card3Title: '3. రూపే క్రెడిట్ కార్డ్ UPI',
    card3Desc: '≤ ₹2,000 & చిన్న వ్యాపారులకు Nil MDR (0%). ₹2,000 దాటితే ~2.0% క్రెడిట్ కార్డ్ MDR.',
    card4Title: '4. నిత్యావసరాలు & ఇంధనం',
    card4Desc: 'రైల్వేలు, పెట్రోల్, టెలికాం రంగానికి ₹2,000 దాటినప్పుడు ఫ్లాట్ ₹5 MDR మాత్రమే.',
    card5Title: '5. క్యాపిటల్ మార్కెట్లు',
    card5Desc: 'మ్యూచువల్ ఫండ్స్, షేర్లకు కేవలం 0.02% MDR (గరిష్ట పరిమితి ₹300).',
    card6Title: '6. చిన్న వ్యాపారులు (P2PM QR)',
    card6Desc: 'నెలకు ≤ ₹1 లక్ష UPI QR ద్వారా అందుకునే చిన్న దుకాణదారులకు ఎప్పటికీ 0% ఉచితం!',
    lastVerified: 'నిబంధనలు ధృవీకరించిన తేదీ: 30 సెప్టెంబర్ 2026',
    officialSources: 'అధికారిక ప్రభుత్వ & నియంత్రణ వనరులు:',
    source1: 'NPCI UPI సర్క్యులర్లు (అధికారిక జాబితా)',
    source2: 'ఆర్థిక సేవల విభాగం (DFS) తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    source3: 'ప్రెస్ ఇన్ఫర్మేషన్ బ్యూరో (PIB) అధికారిక ప్రకటన',
  },
  hi: {
    appTitle: 'यूपीआई एमडीआर कैलकुलेटर भारत',
    subtitle: 'स्वतंत्र शैक्षिक टूल • आरबीआई, एनपीसीआई और वित्त मंत्रालय दिशानिर्देश',
    bannerTitle: 'नए यूपीआई एमडीआर नियम — 15 अक्टूबर 2026 से प्रभावी',
    bannerSubtext: 'नए नियम 15 अक्टूबर 2026 से प्रभावी होंगे। 14 अक्टूबर 2026 तक सामान्य बैंक यूपीआई पर 0% MDR जारी है।',
    viewNewRules: 'नए नियम — 15 अक्टूबर 2026 से',
    viewCurrentRules: 'वर्तमान नियम — 14 अक्टूबर 2026 तक',
    installApp: 'ऐप इंस्टॉल करें',
    selectLanguage: 'भाषा',
    disclaimerBannerTitle: 'सूचनात्मक एवं शैक्षिक उद्देश्य के लिए',
    disclaimerBannerText:
      'वास्तविक शुल्क मर्चेंट श्रेणी (MCC), बैंक/पेमेंट गेटवे समझौते और NPCI/RBI परिपत्रों पर निर्भर करते हैं। यह RBI या NPCI का आधिकारिक टूल नहीं है।',
    txnStepTitle: '1. भुगतान विवरण दर्ज करें',
    amountLabel: 'लेनदेन राशि (₹ में)',
    amountPlaceholder: 'राशि दर्ज करें (जैसे 5000)',
    txnTypeLabel: 'लेनदेन का प्रकार',
    p2pPersonToPerson: 'P2P (मित्रों / परिवार को ट्रांसफर)',
    p2mMerchant: 'P2M (दुकानदार / मर्चेंट को भुगतान)',
    paymentModeLabel: 'भुगतान माध्यम (Payment Instrument)',
    modeBank: 'बैंक खाता यूपीआई (सामान्य)',
    modeRupayCC: 'रुपे क्रेडिट कार्ड ऑन यूपीआई (RuPay CC)',
    modeWallet: 'वॉलेट / पीपीआई (Paytm/PhonePe)',
    merchantCatLabel: 'व्यापारी श्रेणी',
    catNormal: 'सामान्य व्यापारी / दुकान (0.40%, अधिकतम ₹300)',
    catSmall: 'छोटे व्यापारी / P2PM QR (≤ ₹1 लाख/माह: 0% मुफ़्त)',
    catEssential: 'आवश्यक सेवाएं एवं ईंधन (पेट्रोल, रेलवे: फ्लैट ₹5)',
    catCapital: 'शेयर बाजार, म्यूचुअल फंड (0.02%, अधिकतम ₹300)',
    formulaTitle: 'गणना सूत्र (Calculation Formula)',
    calculationsTitle: 'लेनदेन विवरण एवं शुल्क वहनकर्ता',
    freeBadge: '100% मुफ़्त (₹0 शुल्क)',
    feeBadge: 'व्यापारी MDR शुल्क लागू',
    boxCustomerPaid: 'ग्राहक देता है',
    boxCustomerExtra: 'ग्राहक MDR',
    boxZeroCustomer: '₹0 (हमेशा मुफ़्त)',
    boxCustomerDesc: 'ग्राहकों पर कभी कोई अतिरिक्त शुल्क नहीं लगता (Sec 10A PSS Act)',
    boxBankMdr: 'व्यापारी MDR (बैंक कटौती)',
    boxMerchantGets: 'दुकानदार को बैंक में मिलेगा',
    receiptTitle: 'लेनदेन रसीद विवरण',
    customerScanned: 'ग्राहक के खाते से कटी राशि:',
    noExtraFee: 'ग्राहक के लिए कोई अतिरिक्त सुविधा शुल्क नहीं',
    bankDeduction: 'बैंक MDR कटौती:',
    netShopCredit: 'दुकानदार के बैंक खाते में जमा शुद्ध राशि:',
    whoBearsNotice: 'यह शुल्क कौन वहन करता है?',
    step3Title: 'आधिकारिक गणना मार्ग एवं नियम',
    card1Title: '1. P2P (व्यक्ति से व्यक्ति ट्रांसफर)',
    card1Desc: 'किसी भी राशि पर ₹0 MDR। दोस्तों या परिवार को पैसे भेजना 100% मुफ़्त है।',
    card2Title: '2. सामान्य व्यापारी (बैंक यूपीआई)',
    card2Desc: '₹2,000 तक → ₹0। ₹2,000 से अधिक पर 0.40% (अधिकतम सीमा ₹300)।',
    card3Title: '3. रुपे क्रेडिट कार्ड ऑन यूपीआई',
    card3Desc: '₹2,000 तक और छोटे व्यापारियों को 0% Nil MDR। ₹2,000 से अधिक पर ~2.0% MDR।',
    card4Title: '4. आवश्यक सेवाएं एवं ईंधन',
    card4Desc: 'पेट्रोल, रेलवे, टेलीकॉम पर ₹2,000 से अधिक लेनदेन पर केवल फ्लैट ₹5 MDR।',
    card5Title: '5. शेयर बाजार व म्यूचुअल फंड',
    card5Desc: 'म्यूचुअल फंड और शेयरों पर केवल 0.02% MDR (अधिकतम ₹300 सीमा)।',
    card6Title: '6. छोटे व्यापारी (P2PM QR)',
    card6Desc: 'प्रति माह ≤ ₹1 लाख तक लेने वाले छोटे दुकानदारों को हमेशा 0% मुफ़्त।',
    lastVerified: 'अंतिम सत्यापन: 30 सितंबर 2026',
    officialSources: 'आधिकारिक सरकारी और नियामक स्रोत:',
    source1: 'NPCI UPI परिपत्र (आधिकारिक सूची)',
    source2: 'वित्तीय सेवा विभाग (DFS) FAQ',
    source3: 'प्रेस सूचना ब्यूरो (PIB) विज्ञप्ति',
  },
  mr: {
    appTitle: 'UPI MDR कॅल्क्युलेटर भारत',
    subtitle: 'स्वतंत्र शैक्षणिक साधन • RBI, NPCI आणि वित्त मंत्रालय',
    bannerTitle: 'नवीन UPI MDR नियम — 15 ऑक्टोबर 2026 पासून लागू',
    bannerSubtext: 'नवीन नियम 15 ऑक्टोबर 2026 पासून लागू होतील. 14 ऑक्टोबर 2026 पर्यंत 0% MDR कायम राहील.',
    viewNewRules: 'नवीन नियम — 15 ऑक्टोबर 2026 पासून',
    viewCurrentRules: 'सध्याचे नियम — 14 ऑक्टोबर 2026 पर्यंत',
    installApp: 'अॅप इंस्टॉल करा',
    selectLanguage: 'भाषा',
    disclaimerBannerTitle: 'माहिती व शैक्षणिक उद्देशासाठी',
    disclaimerBannerText:
      'प्रत्यक्ष शुल्क मर्चंट कॅटेगरी, बँक करार आणि NPCI नियमांवर अवलंबून असतात. हे अधिकृत सरकारी साधन नाही.',
    txnStepTitle: '1. पेमेंट तपशील प्रविष्ट करा',
    amountLabel: 'व्यवहार रक्कम (₹ मध्ये)',
    amountPlaceholder: 'रक्कम प्रविष्ट करा',
    txnTypeLabel: 'व्यवहार प्रकार',
    p2pPersonToPerson: 'P2P (व्यक्ती ते व्यक्ती हस्तांतरण)',
    p2mMerchant: 'P2M (दुकानदार / व्यापारी पेमेंट)',
    paymentModeLabel: 'पेमेंट साधन',
    modeBank: 'बँक खाते UPI (मानक)',
    modeRupayCC: 'रुपे क्रेडिट कार्ड ऑन UPI (RuPay CC)',
    modeWallet: 'वॉलेट / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'व्यापारी वर्ग',
    catNormal: 'सामान्य व्यापारी / दुकान (0.40%, कमाल मर्यादा ₹300)',
    catSmall: 'लहान व्यापारी / P2PM QR (≤ ₹1 लाख/महिना: 0% मोफत)',
    catEssential: 'अत्यावश्यक सेवा आणि इंधन (फ्लॅट ₹5)',
    catCapital: 'भांडवली बाजार, म्युच्युअल फंड (0.02%, कमाल मर्यादा ₹300)',
    formulaTitle: 'गणना सूत्र (Calculation Formula)',
    calculationsTitle: 'व्यवहार पावती व शुल्क कोणावर?',
    freeBadge: '100% मोफत (₹0 शुल्क)',
    feeBadge: 'व्यापारी MDR लागू',
    boxCustomerPaid: 'ग्राहकाने भरलेली रक्कम',
    boxCustomerExtra: 'ग्राहक MDR',
    boxZeroCustomer: '₹0 (नेहमी मोफत)',
    boxCustomerDesc: 'ग्राहकावर कोणताही अतिरिक्त भार नाही (Sec 10A PSS Act)',
    boxBankMdr: 'व्यापारी MDR (बँक कपात)',
    boxMerchantGets: 'दुकानदाराला खात्यात मिळणारी रक्कम',
    receiptTitle: 'व्यवहार पावती सारांश',
    customerScanned: 'ग्राहकाच्या खात्यातून कापलेली रक्कम:',
    noExtraFee: 'ग्राहकासाठी शून्य अतिरिक्त शुल्क',
    bankDeduction: 'बँक MDR कपात:',
    netShopCredit: 'दुकानदाराच्या खात्यात जमा झालेली रक्कम:',
    whoBearsNotice: 'हे शुल्क कोण भरते?',
    step3Title: 'अधिकृत गणना पद्धती आणि नियम',
    card1Title: '1. P2P (व्यक्ती ते व्यक्ती)',
    card1Desc: 'कोणत्याही रकमेसाठी ₹0 MDR. मित्र किंवा कुटुंबाला पैसे पाठवणे 100% मोफत.',
    card2Title: '2. सामान्य व्यापारी (बँक UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. ₹2,000 च्या वर 0.40% (कमाल मर्यादा ₹300).',
    card3Title: '3. रुपे क्रेडिट कार्ड UPI',
    card3Desc: '≤ ₹2,000 पर्यंत Nil MDR (0%). ₹2,000 च्या वर ~2.0% क्रेडिट कार्ड MDR.',
    card4Title: '4. अत्यावश्यक सेवा आणि इंधन',
    card4Desc: 'रेल्वे, पेट्रोल, टेलिकॉमसाठी ₹2,000 च्या वर फ्लॅट ₹5 MDR.',
    card5Title: '5. भांडवली बाजार व म्युच्युअल फंड',
    card5Desc: 'म्युच्युअल फंड आणि शेअर्सवर फक्त 0.02% (कमाल मर्यादा ₹300).',
    card6Title: '6. लहान व्यापारी (P2PM QR)',
    card6Desc: 'दरमहा ≤ ₹1 लाख स्वीकारणाऱ्या लहान व्यापाऱ्यांना कायम 0% मोफत.',
    lastVerified: 'अंतिम पडताळणी: 30 सप्टेंबर 2026',
    officialSources: 'अधिकृत सरकारी आणि नियामक स्रोत:',
    source1: 'NPCI UPI परिपत्रके (अधिकृत यादी)',
    source2: 'वित्तीय सेवा विभाग (DFS) FAQ',
    source3: 'प्रेस इन्फॉर्मेशन ब्युरो (PIB)',
  },
  gu: {
    appTitle: 'UPI MDR કેલ્ક્યુલેટર ભારત',
    subtitle: 'સ્વતંત્ર શૈક્ષણિક સાધન • RBI, NPCI અને નાણા મંત્રાલય',
    bannerTitle: 'નવા UPI MDR નિયમો — 15 ઓક્ટોબર 2026 થી અમલી',
    bannerSubtext: 'નવા નિયમો 15 ઓક્ટોબર 2026 થી અમલમાં આવશે. 14 ઓક્ટોબર 2026 સુધી 0% MDR ચાલુ રહેશે.',
    viewNewRules: 'નવા નિયમો — 15 ઓક્ટોબર 2026 થી',
    viewCurrentRules: 'હાલના નિયમો — 14 ઓક્ટોબર 2026 સુધી',
    installApp: 'એપ્લિકેશન ઇન્સ્ટોલ કરો',
    selectLanguage: 'ભાષા',
    disclaimerBannerTitle: 'માહિતી અને શૈક્ષણિક હેતુ માટે',
    disclaimerBannerText:
      'વાસ્તવિક ચાર્જ વેપારી કેટેગરી અને NPCI પરિપત્રો પર આધાર રાખે છે. આ સત્તાવાર સરકારી સાધન નથી.',
    txnStepTitle: '1. ચુકવણી વિગતો દાખલ કરો',
    amountLabel: 'ચુકવણી રકમ (₹ માં)',
    amountPlaceholder: 'રકમ દાખલ કરો',
    txnTypeLabel: 'ટ્રાન્ઝેક્શન પ્રકાર',
    p2pPersonToPerson: 'P2P (વ્યક્તિ થી વ્યક્તિ ટ્રાન્સફર)',
    p2mMerchant: 'P2M (વેપારી / દુકાનદારને ચુકવણી)',
    paymentModeLabel: 'ચુકવણી સાધન',
    modeBank: 'બેંક ખાતું UPI (સ્ટાન્ડર્ડ)',
    modeRupayCC: 'રૂપે ક્રેડિટ કાર્ડ UPI (RuPay CC)',
    modeWallet: 'વોલેટ / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'વેપારી શ્રેણી',
    catNormal: 'સામાન્ય વેપારી / દુકાન (0.40%, મહત્તમ ₹300)',
    catSmall: 'નાના વેપારી / P2PM QR (≤ ₹1 લાખ/માસ: 0% મફત)',
    catEssential: 'આવશ્યક સેવાઓ અને ઇંધણ (ફ્લેટ ₹5)',
    catCapital: 'શેરબજાર, મ્યુચ્યુઅલ ફંડ (0.02%, મહત્તમ ₹300)',
    formulaTitle: 'ગણતરી સૂત્ર (Calculation Formula)',
    calculationsTitle: 'ચુકવણી હિસાબ અને ફી કોણ ભોગવે છે?',
    freeBadge: '100% મફત (₹0 ફી)',
    feeBadge: 'વેપારી MDR કપાત',
    boxCustomerPaid: 'ગ્રાહકે ચૂકવેલ રકમ',
    boxCustomerExtra: 'ગ્રાહક MDR',
    boxZeroCustomer: '₹0 (હંમેશા મફત)',
    boxCustomerDesc: 'ગ્રાહક પર કોઈ વધારાનો ચાર્જ નહીં (Sec 10A PSS Act)',
    boxBankMdr: 'વેપારી MDR (બેંક કપાત)',
    boxMerchantGets: 'વેપારીને બેંકમાં જમા રકમ',
    receiptTitle: 'ટ્રાન્ઝેક્શન રસીદ સારાંશ',
    customerScanned: 'ગ્રાહકના ખાતામાંથી ડેબિટ થયેલ રકમ:',
    noExtraFee: 'ગ્રાહક માટે કોઈ વધારાનો ચાર્જ નથી',
    bankDeduction: 'બેંક MDR કપાત:',
    netShopCredit: 'વેપારી ખાતામાં જમા ચોખ્ખી રકમ:',
    whoBearsNotice: 'આ ફી કોણ ભોગવે છે?',
    step3Title: 'સત્તાવાર ગણતરી માર્ગો અને નિયમો',
    card1Title: '1. P2P (વ્યક્તિ થી વ્યક્તિ)',
    card1Desc: 'કોઈપણ રકમ માટે ₹0 MDR. મિત્રો કે પરિવારને પૈસા મોકલવા 100% મફત છે.',
    card2Title: '2. સામાન્ય વેપારી (બેંક UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. ₹2,000 થી વધુ પર 0.40% (મહત્તમ ₹300).',
    card3Title: '3. રૂપે ક્રેડિટ કાર્ડ UPI',
    card3Desc: '≤ ₹2,000 સુધી Nil MDR (0%). ₹2,000 થી વધુ પર ~2.0% ક્રેડિટ કાર્ડ MDR.',
    card4Title: '4. આવશ્યક સેવાઓ અને ઇંધણ',
    card4Desc: 'રેલવે, પેટ્રોલ, ટેલિકોમ માટે ₹2,000 થી વધુ પર ફ્લેટ ₹5 MDR.',
    card5Title: '5. શેરબજાર અને મ્યુચ્યુઅલ ફંડ',
    card5Desc: 'મ્યુચ્યુઅલ ફંડ અને શેર્સ પર માત્ર 0.02% (મહત્તમ ₹300).',
    card6Title: '6. નાના વેપારીઓ (P2PM QR)',
    card6Desc: 'દર મહિને ≤ ₹1 લાખ મેળવતા નાના દુકાનદારો માટે હંમેશા 0% મફત.',
    lastVerified: 'છેલ્લી ચકાસણી: 30 સપ્ટેમ્બર 2026',
    officialSources: 'સત્તાવાર સરકારી સ્ત્રોતો:',
    source1: 'NPCI UPI પરિપત્રો (સત્તાવાર યાદી)',
    source2: 'નાણાકીય સેવાઓ વિભાગ (DFS) FAQ',
    source3: 'પ્રેસ ઇન્ફોર્મેશન બ્યુરો (PIB)',
  },
  ta: {
    appTitle: 'UPI MDR கால்குலேட்டர் இந்தியா',
    subtitle: 'சுயாதீன கல்வி கருவி • RBI, NPCI மற்றும் நிதி அமைச்சகம்',
    bannerTitle: 'புதிய UPI MDR விதிகள் — 15 அக்டோபர் 2026 முதல் அமல்',
    bannerSubtext: 'புதிய விதிகள் 15 அக்டோபர் 2026 முதல் அமலுக்கு வரும். 14 அக்டோபர் 2026 வரை 0% MDR தொடரும்.',
    viewNewRules: 'புதிய விதிகள் — 15 அக்டோபர் 2026 முதல்',
    viewCurrentRules: 'தற்போதைய விதிகள் — 14 அக்டோபர் 2026 வரை',
    installApp: 'செயலியை நிறுவு',
    selectLanguage: 'மொழி',
    disclaimerBannerTitle: 'தகவல் மற்றும் கல்வி நோக்கங்களுக்காக மட்டுமே',
    disclaimerBannerText:
      'உண்மையான கட்டணங்கள் வணிகர் பிரிவு மற்றும் NPCI சுற்றறிக்கைகளைப் பொறுத்தது. இது அதிகாரப்பூர்வ அரசு கருவி அல்ல.',
    txnStepTitle: '1. கட்டண விவரங்களை உள்ளிடவும்',
    amountLabel: 'பரிவர்த்தனை தொகை (₹ இல்)',
    amountPlaceholder: 'தொகையை உள்ளிடவும்',
    txnTypeLabel: 'பரிவர்த்தனை வகை',
    p2pPersonToPerson: 'P2P (நண்பர் / குடும்பத்திற்கு அனுப்புதல்)',
    p2mMerchant: 'P2M (கடை / வணிகருக்கு செலுத்துதல்)',
    paymentModeLabel: 'கட்டண முறை',
    modeBank: 'வங்கி கணக்கு UPI (வழக்கமான)',
    modeRupayCC: 'ரூபே கிரெடிட் கார்டு UPI (RuPay CC)',
    modeWallet: 'வாலட் / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'வணிகர் பிரிவு',
    catNormal: 'சாதாரண வணிகர் / கடை (0.40%, உச்சவரம்பு ₹300)',
    catSmall: 'சிறு வணிகர்கள் / P2PM QR (மாதம் ≤ ₹1 லட்சம்: 0% இலவசம்)',
    catEssential: 'அத்தியாவசிய சேவைகள் & எரிபொருள் (நிலையான ₹5)',
    catCapital: 'பங்குச் சந்தை, மியூச்சுவல் ஃபண்ட் (0.02%, உச்சவரம்பு ₹300)',
    formulaTitle: 'கணக்கீட்டு சூத்திரம் (Calculation Formula)',
    calculationsTitle: 'பரிவர்த்தனை ரசீது & கட்டணம் யார் செலுத்துவது?',
    freeBadge: '100% இலவசம் (₹0 கட்டணம்)',
    feeBadge: 'வணிகர் MDR பிடித்தம்',
    boxCustomerPaid: 'வாடிக்கையாளர் செலுத்தியது',
    boxCustomerExtra: 'வாடிக்கையாளர் MDR',
    boxZeroCustomer: '₹0 (எப்போதும் இலவசம்)',
    boxCustomerDesc: 'வாடிக்கையாளரிடம் கூடுதல் கட்டணம் வசூலிக்கக் கூடாது (Sec 10A PSS Act)',
    boxBankMdr: 'வணிகர் MDR (வங்கி பிடித்தம்)',
    boxMerchantGets: 'வணிகருக்கு வங்கியில் சேருவது',
    receiptTitle: 'பரிவர்த்தனை ரசீது சுருக்கம்',
    customerScanned: 'வாடிக்கையாளர் கணக்கிலிருந்து கழிக்கப்பட்ட தொகை:',
    noExtraFee: 'வாடிக்கையாளருக்கு கூடுதல் கட்டணம் இல்லை',
    bankDeduction: 'வங்கி MDR பிடித்தம்:',
    netShopCredit: 'வணிகரின் வங்கி கணக்கில் சேரும் நிகர தொகை:',
    whoBearsNotice: 'இந்தக் கட்டணத்தை யார் ஏற்பது?',
    step3Title: 'அதிகாரப்பூர்வ கணக்கீட்டு முறைகள் மற்றும் விதிகள்',
    card1Title: '1. P2P (நபர் முதல் நபர் வரை)',
    card1Desc: 'எந்தத் தொகைக்கும் ₹0 MDR. நண்பர்கள் அல்லது குடும்பத்தினருக்கு பணம் அனுப்புவது 100% இலவசம்.',
    card2Title: '2. சாதாரண வணிகர் (வங்கி UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. ₹2,000க்கு மேல் 0.40% (அதிகபட்ச வரம்பு ₹300).',
    card3Title: '3. ரூபே கிரெடிட் கார்டு UPI',
    card3Desc: '≤ ₹2,000 வரை Nil MDR (0%). ₹2,000க்கு மேல் ~2.0% கிரெடிட் கார்டு MDR.',
    card4Title: '4. அத்தியாவசிய சேவைகள் & எரிபொருள்',
    card4Desc: 'ரயில்வே, பெட்ரோல், தொலைத்தொடர்புக்கு ₹2,000க்கு மேல் நிலையான ₹5 MDR மட்டுமே.',
    card5Title: '5. பங்குச் சந்தை & மியூச்சுவல் ஃபண்ட்',
    card5Desc: 'மியூச்சுவல் ஃபண்ட் மற்றும் பங்குகளுக்கு 0.02% மட்டுமே (அதிகபட்ச வரம்பு ₹300).',
    card6Title: '6. சிறு வணிகர்கள் (P2PM QR)',
    card6Desc: 'மாதம் ≤ ₹1 லட்சம் வரை பெறும் சிறு கடைகளுக்கு எப்போதும் 0% இலவசம்.',
    lastVerified: 'கடைசியாக சரிபார்க்கப்பட்டது: 30 செப்டம்பர் 2026',
    officialSources: 'அதிகாரப்பூர்வ அரசு மற்றும் ஒழுங்குமுறை ஆதாரங்கள்:',
    source1: 'NPCI UPI சுற்றறிக்கைகள் (அதிகாரப்பூர்வ பட்டியல்)',
    source2: 'நிதிச் சேவைகள் துறை (DFS) FAQ',
    source3: 'பத்திரிகை தகவல் பணியகம் (PIB)',
  },
  bn: {
    appTitle: 'UPI MDR ক্যালকুলেটর ভারত',
    subtitle: 'স্বাধীন শিক্ষামূলক টুল • RBI, NPCI এবং অর্থ মন্ত্রণালয়',
    bannerTitle: 'নতুন UPI MDR নিয়ম — ১৫ অক্টোবর ২০২৬ থেকে কার্যকর',
    bannerSubtext: 'নতুন নিয়ম ১৫ অক্টোবর ২০২৬ থেকে কার্যকর হবে। ১৪ অক্টোবর ২০২৬ পর্যন্ত ০% MDR কার্যকর থাকবে।',
    viewNewRules: 'নতুন নিয়ম — ১৫ অক্টোবর ২০২৬ থেকে',
    viewCurrentRules: 'বর্তমান নিয়ম — ১৪ অক্টোবর ২০২৬ পর্যন্ত',
    installApp: 'অ্যাপ ইনস্টল করুন',
    selectLanguage: 'ভাষা',
    disclaimerBannerTitle: 'তথ্য ও শিক্ষামূলক ব্যবহারের জন্য',
    disclaimerBannerText:
      'প্রকৃত চার্জ মার্চেন্ট ক্যাটাগরি এবং NPCI সার্কুলারের উপর নির্ভর করে। এটি কোনো সরকারি টুল নয়।',
    txnStepTitle: '১. লেনদেনের বিবরণ লিখুন',
    amountLabel: 'লেনদেনের পরিমাণ (₹ তে)',
    amountPlaceholder: 'পরিমাণ লিখুন',
    txnTypeLabel: 'লেনদেনের ধরন',
    p2pPersonToPerson: 'P2P (ব্যক্তি থেকে ব্যক্তি স্থানান্তর)',
    p2mMerchant: 'P2M (দোকানদার / ব্যবসায়ীকে পেমেন্ট)',
    paymentModeLabel: 'পেমেন্ট মাধ্যম',
    modeBank: 'ব্যাংক একাউন্ট UPI (সাধারণ)',
    modeRupayCC: 'রুপে ক্রেডিট কার্ড UPI (RuPay CC)',
    modeWallet: 'ওয়ালেট / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'ব্যবসায়ী বিভাগ',
    catNormal: 'সাধারণ ব্যবসায়ী / দোকান (০.৪০%, সর্বোচ্চ ₹৩০০)',
    catSmall: 'ক্ষুদ্র ব্যবসায়ী / P2PM QR (মাসে ≤ ₹১ লাখ: ০% বিনামূল্যে)',
    catEssential: 'জরুরি পরিষেবা ও জ্বালানি (ফ্ল্যাট ₹৫)',
    catCapital: 'শেয়ার বাজার, মিউচুয়াল ফান্ড (০.০২%, সর্বোচ্চ ₹৩০০)',
    formulaTitle: 'গণনা সূত্র (Calculation Formula)',
    calculationsTitle: 'লেনদেনের রসিদ ও চার্জ কে বহন করবে?',
    freeBadge: '১০০% বিনামূল্যে (₹০ ফি)',
    feeBadge: 'ব্যবসায়ী MDR প্রযোজ্য',
    boxCustomerPaid: 'গ্রাহকের পরিশোধিত টাকা',
    boxCustomerExtra: 'গ্রাহক MDR',
    boxZeroCustomer: '₹০ (সর্বদা বিনামূল্যে)',
    boxCustomerDesc: 'গ্রাহকদের উপর কোনো অতিরিক্ত চার্জ নেই (Sec 10A PSS Act)',
    boxBankMdr: 'ব্যবসায়ী MDR (ব্যাংক কর্তন)',
    boxMerchantGets: 'ব্যবসায়ীর ব্যাংকে জমা হবে',
    receiptTitle: 'লেনদেনের রসিদ বিবরণ',
    customerScanned: 'গ্রাহকের অ্যাকাউন্ট থেকে কাটা টাকা:',
    noExtraFee: 'গ্রাহকের জন্য শূন্য অতিরিক্ত ফি',
    bankDeduction: 'ব্যাংক MDR কর্তন:',
    netShopCredit: 'দোকানদারের ব্যাংক অ্যাকাউন্টে জমা হওয়া নিট পরিমাণ:',
    whoBearsNotice: 'এই চার্জ কে বহন করে?',
    step3Title: 'অফিসিয়াল গণনার পথ এবং বিধিমালার নিয়ম',
    card1Title: '১. P2P (ব্যক্তি থেকে ব্যক্তি)',
    card1Desc: 'যেকোনো পরিমাণের জন্য ₹০ MDR। বন্ধু বা পরিবারকে টাকা পাঠানো ১০০% বিনামূল্যে।',
    card2Title: '২. সাধারণ ব্যবসায়ী (ব্যাংক UPI)',
    card2Desc: '≤ ₹২,০০০ → ₹০। ₹২,০০০ এর উপরে ০.৪০% (সর্বোচ্চ ₹৩০০)।',
    card3Title: '৩. রুপে ক্রেডিট কার্ড UPI',
    card3Desc: '≤ ₹২,০০০ পর্যন্ত Nil MDR (০%)। ₹২,০০০ এর উপরে ~২.০% ক্রেডিট কার্ড MDR।',
    card4Title: '৪. জরুরি পরিষেবা ও জ্বালানি',
    card4Desc: 'রেলওয়ে, পেট্রোল, টেলিকমের জন্য ₹২,০০০ এর উপরে ফ্ল্যাট ₹৫ MDR।',
    card5Title: '৫. শেয়ার বাজার ও মিউচুয়াল ফান্ড',
    card5Desc: 'মিউচুয়াল ফান্ড এবং শেয়ারের জন্য মাত্র ০.০২% (সর্বোচ্চ সীমা ₹৩০০)।',
    card6Title: '৬. ক্ষুদ্র ব্যবসায়ী (P2PM QR)',
    card6Desc: 'মাসে ≤ ₹১ লাখ গ্রহণকারী ছোট দোকানদারদের জন্য সর্বদা ০% বিনামূল্যে।',
    lastVerified: 'সর্বশেষ যাচাই: ৩০ সেপ্টেম্বর ২০২৬',
    officialSources: 'সরকারি ও নিয়ন্ত্রক সূত্র:',
    source1: 'NPCI UPI সার্কুলার (অফিসিয়াল তালিকা)',
    source2: 'আর্থিক পরিষেবা বিভাগ (DFS) FAQ',
    source3: 'প্রেস ইনফরমেশন ব্যুরো (PIB)',
  },
  kn: {
    appTitle: 'UPI MDR ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಭಾರತ',
    subtitle: 'ಸ್ವತಂತ್ರ ಶೈಕ್ಷಣಿಕ ಸಾಧನ • RBI, NPCI ಮತ್ತು ಹಣಕಾಸು ಸಚಿವಾಲಯ',
    bannerTitle: 'ಹೊಸ UPI MDR ನಿಯಮಗಳು — 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ ಜಾರಿ',
    bannerSubtext: 'ಹೊಸ ನಿಯಮಗಳು 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ ಅನ್ವಯವಾಗುತ್ತವೆ. 14 ಅಕ್ಟೋಬರ್ 2026 ರವರೆಗೆ 0% MDR ಮುಂದುವರಿಯುತ್ತದೆ.',
    viewNewRules: 'ಹೊಸ ನಿಯಮಗಳು — 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ',
    viewCurrentRules: 'ಪ್ರಸ್ತುತ ನಿಯಮಗಳು — 14 ಅಕ್ಟೋಬರ್ 2026 ರವರೆಗೆ',
    installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
    selectLanguage: 'ಭಾಷೆ',
    disclaimerBannerTitle: 'ಮಾಹಿತಿ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶಕ್ಕಾಗಿ ಮಾತ್ರ',
    disclaimerBannerText:
      'ನಿಜವಾದ ಶುಲ್ಕಗಳು ವ್ಯಾಪಾರಿ ವರ್ಗ ಮತ್ತು NPCI ಸುತ್ತೋಲೆಗಳನ್ನು ಅವಲಂಬಿಸಿರುತ್ತವೆ. ಇದು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸಾಧನವಲ್ಲ.',
    txnStepTitle: '1. ಪಾವತಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    amountLabel: 'ವಹಿವಾಟು ಮೊತ್ತ (₹ ಗಳಲ್ಲಿ)',
    amountPlaceholder: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    txnTypeLabel: 'ವಹಿವಾಟಿನ ಪ್ರಕಾರ',
    p2pPersonToPerson: 'P2P (ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ ವರ್ಗಾವಣೆ)',
    p2mMerchant: 'P2M (ವ್ಯಾಪಾರಿ / ಅಂಗಡಿಗೆ ಪಾವತಿ)',
    paymentModeLabel: 'ಪಾವತಿ ವಿಧಾನ',
    modeBank: 'ಬ್ಯಾಂಕ್ ಖಾತೆ UPI (ಸಾಮಾನ್ಯ)',
    modeRupayCC: 'ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ UPI (RuPay CC)',
    modeWallet: 'ವಾಲೆಟ್ / PPI (Paytm/PhonePe)',
    merchantCatLabel: 'ವ್ಯಾಪಾರಿ ವರ್ಗ',
    catNormal: 'ಸಾಮಾನ್ಯ ವ್ಯಾಪಾರಿ / ಅಂಗಡಿ (0.40%, ಗರಿಷ್ಠ ಮಿತಿ ₹300)',
    catSmall: 'ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು / P2PM QR (ತಿಂಗಳಿಗೆ ≤ ₹1 ಲಕ್ಷ: 0% ಉಚಿತ)',
    catEssential: 'ಅಗತ್ಯ ಸೇವೆಗಳು & ಇಂಧನ (ಫ್ಲಾಟ್ ₹5)',
    catCapital: 'ಬಂಡವಾಳ ಮಾರುಕಟ್ಟೆ, ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ (0.02%, ಗರಿಷ್ಠ ಮಿತಿ ₹300)',
    formulaTitle: 'ಲೆಕ್ಕಾಚಾರ ಸೂತ್ರ (Calculation Formula)',
    calculationsTitle: 'ವಹಿವಾಟಿನ ರಸೀದಿ ಮತ್ತು ಶುಲ್ಕ ಯಾರ ಮೇಲೆ?',
    freeBadge: '100% ಉಚಿತ (₹0 ಶುಲ್ಕ)',
    feeBadge: 'ವ್ಯಾಪಾರಿ MDR ಕಡಿತ',
    boxCustomerPaid: 'ಗ್ರಾಹಕರು ಪಾವತಿಸುವ ಮೊತ್ತ',
    boxCustomerExtra: 'ಗ್ರಾಹಕ MDR',
    boxZeroCustomer: '₹0 (ಯಾವಾಗಲೂ ಉಚಿತ)',
    boxCustomerDesc: 'ಗ್ರಾಹಕರಿಗೆ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವಿಲ್ಲ (Sec 10A PSS Act)',
    boxBankMdr: 'ವ್ಯಾಪಾರಿ MDR (ಬ್ಯಾಂಕ್ ಕಡಿತ)',
    boxMerchantGets: 'ವ್ಯಾಪಾರಿಗೆ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ಜಮೆಯಾಗುವ ಮೊತ್ತ',
    receiptTitle: 'ವಹಿವಾಟಿನ ರಸೀದಿ ಸಾರಾಂಶ',
    customerScanned: 'ಗ್ರಾಹಕರ ಖಾತೆಯಿಂದ ಕಡಿತವಾದ ಮೊತ್ತ:',
    noExtraFee: 'ಗ್ರಾಹಕರಿಗೆ ಯಾವುದೇ ಹೆಚ್ಚುವರಿ ಶುಲ್ಕವಿಲ್ಲ',
    bankDeduction: 'ಬ್ಯಾಂಕ್ MDR ಕಡಿತ:',
    netShopCredit: 'ವ್ಯಾಪಾರಿಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುವ ನಿವ್ವಳ ಮೊತ್ತ:',
    whoBearsNotice: 'ಈ ಶುಲ್ಕವನ್ನು ಯಾರು ಭರಿಸುತ್ತಾರೆ?',
    step3Title: 'ಅಧಿಕೃತ ಲೆಕ್ಕಾಚಾರ ವಿಧಾನಗಳು ಮತ್ತು ನಿಯಮಗಳು',
    card1Title: '1. P2P (ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ)',
    card1Desc: 'ಯಾವುದೇ ಮೊತ್ತಕ್ಕೆ ₹0 MDR. ಸ್ನೇಹಿತರಿಗೆ ಅಥವಾ ಕುಟುಂಬಕ್ಕೆ ಹಣ ಕಳುಹಿಸುವುದು 100% ಉಚಿತ.',
    card2Title: '2. ಸಾಮಾನ್ಯ ವ್ಯಾಪಾರಿ (ಬ್ಯಾಂಕ್ UPI)',
    card2Desc: '≤ ₹2,000 → ₹0. ₹2,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೊತ್ತಕ್ಕೆ 0.40% (ಗರಿಷ್ಠ ಮಿತಿ ₹300).',
    card3Title: '3. ರೂಪೇ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ UPI',
    card3Desc: '≤ ₹2,000 ವರೆಗೆ Nil MDR (0%). ₹2,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೊತ್ತಕ್ಕೆ ~2.0% ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ MDR.',
    card4Title: '4. ಅಗತ್ಯ ಸೇವೆಗಳು & ಇಂಧನ',
    card4Desc: 'ರೈಲ್ವೆ, ಪೆಟ್ರೋಲ್, ಟೆಲಿಕಾಂಗೆ ₹2,000 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೊತ್ತಕ್ಕೆ ಫ್ಲಾಟ್ ₹5 MDR.',
    card5Title: '5. ಬಂಡವಾಳ ಮಾರುಕಟ್ಟೆ & ಮ್ಯೂಚುಯಲ್ ಫಂಡ್',
    card5Desc: 'ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ ಮತ್ತು ಷೇರುಗಳಿಗೆ ಕೇವಲ 0.02% (ಗರಿಷ್ಠ ಮಿತಿ ₹300).',
    card6Title: '6. ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು (P2PM QR)',
    card6Desc: 'ತಿಂಗಳಿಗೆ ≤ ₹1 ಲಕ್ಷ ಸ್ವೀಕರಿಸುವ ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಯಾವಾಗಲೂ 0% ಉಚಿತ.',
    lastVerified: 'ಕೊನೆಯ ಪರಿಶೀಲನೆ: 30 ಸೆಪ್ಟೆಂಬರ್ 2026',
    officialSources: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮತ್ತು ನಿಯಂತ್ರಕ ಮೂಲಗಳು:',
    source1: 'NPCI UPI ಸುತ್ತೋಲೆಗಳು (ಅಧಿಕೃತ ಪಟ್ಟಿ)',
    source2: 'ಹಣಕಾಸು ಸೇವೆಗಳ ಇಲಾಖೆ (DFS) FAQ',
    source3: 'ಪತ್ರಿಕಾ ಮಾಹಿತಿ ಬ್ಯೂರೋ (PIB)',
  },
};

// =========================================================================
// 2. MAIN REACT COMPONENT
// =========================================================================
export function App() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [ruleEpoch, setRuleEpoch] = useState<'new_oct_2026' | 'current_until_oct_2026'>('new_oct_2026');
  const [amountInput, setAmountInput] = useState<string>('5000');
  const [txnType, setTxnType] = useState<TransactionType>('P2M');
  const [paymentInstrument, setPaymentInstrument] = useState<PaymentInstrument>('bank_account');
  const [merchantCategory, setMerchantCategory] = useState<MerchantCategoryKey>('regular_merchant');

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
  const evaluationDate = ruleEpoch === 'new_oct_2026' ? '2026-10-15' : '2026-09-30';

  // Single source of truth calculation engine:
  const result = useMemo(() => {
    return calculateUpiMdr({
      amount: amountInput,
      transactionType: txnType,
      paymentInstrument,
      merchantCategory,
      evaluationDate,
    });
  }, [amountInput, txnType, paymentInstrument, merchantCategory, evaluationDate]);

  const isFree = !result.isMdrApplicable || result.estimatedMdr === 0;

  // Category Tag badge
  const categoryTag = useMemo(() => {
    if (txnType === 'P2P') return 'P2P Transfer';
    const instrumentLabel =
      paymentInstrument === 'rupay_credit_card'
        ? 'RuPay CC'
        : paymentInstrument === 'ppi_wallet'
        ? 'Prepaid Wallet'
        : 'Bank UPI';

    if (merchantCategory === 'small_merchant') {
      return `${instrumentLabel} (Small Merchant) — 0%`;
    }
    if (merchantCategory === 'capital_markets') {
      return `${instrumentLabel} (Capital Markets) — 0.02% (Cap ₹300)`;
    }
    if (merchantCategory === 'essential_services') {
      return paymentInstrument === 'ppi_wallet'
        ? 'Prepaid Wallet (Essential) — 0.50%'
        : paymentInstrument === 'rupay_credit_card'
        ? 'RuPay CC (Essential) — 1.50%'
        : 'Essential Sector — Flat ₹5';
    }
    // regular_merchant
    if (paymentInstrument === 'rupay_credit_card') {
      return 'RuPay CC — ~2.00%';
    }
    if (paymentInstrument === 'ppi_wallet') {
      return 'Prepaid Wallet — 1.10%';
    }
    return 'Standard P2M — 0.40%';
  }, [txnType, paymentInstrument, merchantCategory]);

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

      {/* 2. Top Implementation Date & Rules Switcher Banner */}
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 shadow-2xs">
        <div className="mx-auto flex max-w-5xl flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Calendar className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-amber-950 block text-sm sm:inline mr-1">
                {t.bannerTitle}
              </span>
              <span className="text-amber-800 font-medium block sm:inline">
                {t.bannerSubtext}
              </span>
            </div>
          </div>

          {/* Rule Version Selector */}
          <div className="flex items-center gap-1 shrink-0 bg-white rounded-xl p-1 border border-amber-300 shadow-2xs">
            <button
              type="button"
              onClick={() => setRuleEpoch('new_oct_2026')}
              className={
                ruleEpoch === 'new_oct_2026'
                  ? 'rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-black text-white'
                  : 'rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100'
              }
            >
              {t.viewNewRules}
            </button>
            <button
              type="button"
              onClick={() => setRuleEpoch('current_until_oct_2026')}
              className={
                ruleEpoch === 'current_until_oct_2026'
                  ? 'rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-black text-white'
                  : 'rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100'
              }
            >
              {t.viewCurrentRules}
            </button>
          </div>
        </div>
      </div>

      {/* 3. PROMINENT EDUCATIONAL DISCLAIMER */}
      <div className="border-b border-blue-200 bg-blue-50/70 px-4 py-2.5 text-blue-950 text-xs">
        <div className="mx-auto max-w-5xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-black text-blue-900 mr-1">{t.disclaimerBannerTitle}:</strong>
            <span className="text-slate-700">{t.disclaimerBannerText}</span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">

        {/* ========================================================================= */}
        {/* STEP 1: PAYMENT DETAILS INPUT                                             */}
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
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
              {ruleEpoch === 'new_oct_2026' ? '15 Oct 2026 Framework' : 'Current Zero-MDR'}
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

            {/* Validation warning if negative or empty */}
            {result.validationWarning && (
              <div className="text-xs text-amber-700 font-bold flex items-center gap-1.5 pt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{result.validationWarning}</span>
              </div>
            )}

            {/* Quick Boundary Preset Helper Buttons */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold">
                {result.amount > 0 && result.amount <= 2000 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ≤ ₹2,000: 100% Free
                  </span>
                ) : result.amount > 2000 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-900 border border-blue-200">
                    <TrendingDown className="w-3.5 h-3.5 text-blue-700" />
                    &gt; ₹2,000: Merchant MDR applies
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700">Preset:</span>
                <button
                  type="button"
                  onClick={() => setAmountInput('100')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹100
                </button>
                <button
                  type="button"
                  onClick={() => setAmountInput('1999')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹1,999
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
                  onClick={() => setAmountInput('2001')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹2,001
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
                  onClick={() => setAmountInput('75000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹75,000 (Cap)
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
                  Official Merchant Discount Rate framework
                </span>
              </button>
            </div>
          </div>

          {/* Conditional Options for P2M */}
          {txnType === 'P2M' && (
            <div className="space-y-4 pt-3 border-t border-slate-100">
              {/* Payment Instrument (3 Explicit Modes: Bank UPI, RuPay CC on UPI, PPI Wallet) */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
                  {t.paymentModeLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('bank_account')}
                    className={
                      paymentInstrument === 'bank_account'
                        ? 'rounded-2xl border-2 p-3 text-xs font-black text-left transition cursor-pointer border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/20'
                        : 'rounded-2xl border-2 p-3 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-blue-700" />
                        <span className="truncate">{t.modeBank}</span>
                      </span>
                      {paymentInstrument === 'bank_account' && (
                        <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-1">
                      0.40% / Flat ₹5 / 0%
                    </span>
                  </button>

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
                    <span className="block text-[10px] text-purple-700 font-semibold mt-1">
                      Nil MDR ≤ ₹2k • ~2% &gt; ₹2k
                    </span>
                  </button>

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
                    <span className="block text-[10px] text-slate-500 font-semibold mt-1">
                      1.10% Interchange
                    </span>
                  </button>
                </div>
              </div>

              {/* Merchant Category (5 Official Paths) */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
                  {t.merchantCatLabel}
                </label>
                <select
                  value={merchantCategory}
                  onChange={(e) => setMerchantCategory(e.target.value as MerchantCategoryKey)}
                  className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-3 text-xs font-bold text-slate-800 focus:border-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value="regular_merchant">{t.catNormal}</option>
                  <option value="small_merchant">{t.catSmall}</option>
                  <option value="essential_services">{t.catEssential}</option>
                  <option value="capital_markets">{t.catCapital}</option>
                </select>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: RESULTS - CALCULATION FORMULA & BREAKDOWN                          */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-3 border-emerald-500/80 bg-white p-5 sm:p-7 shadow-xl overflow-hidden space-y-5">
          {/* Header */}
          <div
            className={
              isFree
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
                  {categoryTag}
                </span>
                <h3 className="text-base sm:text-xl font-black">
                  {t.calculationsTitle}
                </h3>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-extrabold backdrop-blur-xs">
              {isFree ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  {t.freeBadge}
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-blue-200" />
                  {t.feeBadge}
                </>
              )}
            </span>
          </div>

          {/* ULTRA-PROMINENT SUMMARY BANNER */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-bold">
                <span className="text-slate-300">
                  Customer pays: <strong className="text-white text-base font-black">{result.formattedAmount}</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-emerald-300">
                  Customer MDR: <strong className="text-emerald-400 text-base font-black">₹0</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-amber-300">
                  Merchant MDR: <strong className="text-amber-400 text-base font-black">{formatCurrencyINR(result.estimatedMdr, true)}</strong>
                </span>
              </div>
              <div className="shrink-0 rounded-xl bg-white/10 px-3 py-1 text-xs font-black text-blue-200 border border-white/20">
                {categoryTag}
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
                {result.isFlatFee ? 'Statutory Flat Fee' : result.mdrCapApplied ? 'Cap Applied' : 'Rate × Amount'}
              </span>
            </div>
            <p className="font-mono text-sm sm:text-base font-black text-indigo-950 bg-white/80 rounded-xl p-2.5 border border-indigo-200">
              {result.formulaText}
            </p>
          </div>

          {/* 4 Cards: Customer Paid | Customer Surcharge | Bank MDR Cut | Merchant Net Settlement */}
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
                Debited from customer UPI app
              </span>
            </div>

            {/* 2. Customer Extra Fee (ALWAYS ₹0) */}
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

            {/* 3. Bank Cut (Merchant MDR) */}
            <div
              className={
                isFree
                  ? 'rounded-2xl border-2 p-4 border-emerald-200 bg-emerald-50/70'
                  : 'rounded-2xl border-2 p-4 border-amber-300 bg-amber-50/80'
              }
            >
              <span
                className={
                  isFree
                    ? 'text-[11px] font-extrabold uppercase block text-emerald-800'
                    : 'text-[11px] font-extrabold uppercase block text-amber-900'
                }
              >
                {t.boxBankMdr}
              </span>
              <span
                className={
                  isFree
                    ? 'text-2xl sm:text-3xl font-black block mt-1 text-emerald-700'
                    : 'text-2xl sm:text-3xl font-black block mt-1 text-amber-950'
                }
              >
                {isFree ? '₹0' : formatCurrencyINR(result.estimatedMdr, true)}
              </span>
              <span
                className={
                  isFree
                    ? 'mt-2 text-xs font-bold block text-emerald-800'
                    : 'mt-2 text-xs font-bold block text-amber-900'
                }
              >
                {isFree
                  ? 'Zero bank deduction'
                  : result.isFlatFee
                  ? 'Statutory Flat ₹5 MDR'
                  : result.mdrCapApplied
                  ? `Capped at ₹${result.mdrCapAmount}`
                  : `${result.applicableMdrRatePercent}% deducted from merchant`}
              </span>
            </div>

            {/* 4. Merchant Credit */}
            <div className="rounded-2xl border-2 border-blue-400 bg-blue-50/90 p-4">
              <span className="text-[11px] font-extrabold uppercase text-blue-900 block">
                {t.boxMerchantGets}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-blue-950 block mt-1">
                {formatCurrencyINR(result.estimatedMerchantSettlement, true)}
              </span>
              <span className="mt-2 text-xs font-bold text-blue-800 block">
                Net credited to bank account
              </span>
            </div>
          </div>

          {/* Breakdown Receipt Summary & Charge Bearer Notice */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">
                {'📋 ' + t.receiptTitle + ':'}
              </span>
              <span className="text-[11px] font-extrabold text-blue-800">
                {lang === 'te' ? result.whoBearsFeeTe : result.whoBearsFeeEn}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
              <div className="rounded-xl bg-white p-2.5 border border-blue-200">
                <span className="text-slate-500 block text-[11px]">
                  {t.customerScanned}
                </span>
                <span className="font-black text-slate-900 text-sm">
                  {result.formattedAmount}
                </span>
                <span className="text-[10px] text-emerald-700 block font-bold">
                  {t.noExtraFee}
                </span>
              </div>

              <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-200">
                <span className="text-amber-900 block text-[11px]">
                  {t.bankDeduction}
                </span>
                <span className="font-black text-amber-950 text-sm">
                  {formatCurrencyINR(result.estimatedMdr, true)}
                </span>
                <span className="text-[10px] text-amber-800 block">
                  {result.isFlatFee
                    ? '(Flat ₹5 for essential services)'
                    : result.mdrCapApplied
                    ? `(Capped at ₹${result.mdrCapAmount})`
                    : `(${result.applicableMdrRatePercent}% fee)`}
                </span>
              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 border border-emerald-300">
                <span className="text-emerald-900 block text-[11px] font-bold">
                  {t.netShopCredit}
                </span>
                <span className="font-black text-emerald-950 text-base">
                  {formatCurrencyINR(result.estimatedMerchantSettlement, true)}
                </span>
                <span className="text-[10px] text-emerald-800 block">
                  {result.formattedAmount + ' - ' + formatCurrencyINR(result.estimatedMdr, true)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: OFFICIAL CALCULATION PATHS (100% TRANSLATED IN ALL LANGUAGES)      */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-900 font-black">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm sm:text-base">
              {t.step3Title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-emerald-800 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                {t.card1Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card1Desc}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-blue-900 block flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                {t.card2Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card2Desc}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-purple-900 block flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                {t.card3Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card3Desc}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-amber-900 block flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                {t.card4Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card4Desc}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-indigo-900 block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                {t.card5Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card5Desc}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-emerald-900 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t.card6Title}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {t.card6Desc}
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
                href={UPI_REGULATORY_META.officialCircularsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source1}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://financialservices.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source2}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://pib.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline text-blue-800"
              >
                <span>{t.source3}</span>
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
