import { createRoot } from 'react-dom/client';
import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Store,
  Languages,
  Download,
  Info,
  Check,
  Calendar,
  User,
  Fuel,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import './index.css';
import { calculateUpiMdr } from './calculator/calculateMdr';
import { MerchantCategoryKey, PaymentInstrument, TransactionType } from './types/upi';

// =========================================================================
// 1. LANGUAGES (9 Indian Languages)
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
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const TRANSLATIONS: Record<SupportedLanguage, any> = {
  en: {
    appTitle: 'UPI MDR Calculator India',
    subtitle: 'Official RBI, NPCI & Ministry of Finance Guidelines',
    bannerTitle: 'New UPI MDR Rules — Effective 15 October 2026',
    bannerSubtext: 'Calculations shown for the new MDR framework apply from 15 October 2026. Until 14 Oct 2026, standard bank UPI continues at 0% MDR.',
    viewNewRules: 'New rules — From 15 Oct 2026',
    viewCurrentRules: 'Current rules — Until 14 Oct 2026',
    installApp: 'Install App',
    selectLanguage: 'Language',
    txnStepTitle: '1. Enter Payment Details',
    amountLabel: 'Payment Amount (in ₹)',
    amountPlaceholder: 'Enter amount (e.g. 5000)',
    txnTypeLabel: 'Transaction Type',
    p2pPersonToPerson: 'P2P (Person to Person Transfer)',
    p2mMerchant: 'P2M (Shop / Merchant Payment)',
    merchantCatLabel: 'Merchant Category (5 Official Paths)',
    catNormal: 'Normal P2M Merchant (0.40%, Cap ₹300)',
    catSmall: 'Small Merchant / P2PM QR (≤ ₹1L/month: 0% Free)',
    catEssential: 'Essential & Fuel (Railways, Telecom, Fuel: Flat ₹5)',
    catCapital: 'Capital Markets (Mutual Funds, Stocks: 0.02%, Cap ₹300)',
    paymentModeLabel: 'Payment Instrument',
    modeBank: 'Bank Account UPI (Standard)',
    modeWallet: 'Prepaid Wallet / PPI (Paytm/PhonePe)',
    calculationsTitle: 'Who Pays How Much? (Layman Breakdown)',
    freeBadge: '100% Free / ₹0 Fee',
    feeBadge: 'Merchant MDR Deducted',
    boxCustomerPaid: 'Customer Pays',
    boxCustomerExtra: 'Customer MDR',
    boxZeroCustomer: '₹0 (Always Free)',
    boxCustomerDesc: 'Customer NEVER pays extra fee (Sec 10A PSS Act)',
    boxBankMdr: 'Merchant MDR',
    boxMerchantGets: 'Merchant Gets in Bank',
    receiptTitle: 'Transaction Breakdown Summary',
    customerScanned: 'Customer debited amount:',
    noExtraFee: 'Zero convenience fee for customer (100% free)',
    bankDeduction: 'Bank MDR deduction:',
    netShopCredit: 'Net amount credited to merchant account:',
    currentRulesNotice: 'Currently active until 14 October 2026: Zero-MDR directive applies (0% MDR across standard bank-to-bank UPI).',
    newRulesNotice: 'Effective 15 October 2026: Official RBI/NPCI framework applies (0.4% above ₹2k, flat ₹5 for fuel/rail/telecom, 0% for small vendors).',
    lastVerified: 'Last verified: 30 September 2026',
    officialSources: 'Official Government & Regulatory Sources:',
    source1: 'NPCI UPI Circulars',
    source2: 'Department of Financial Services — UPI MDR FAQ',
    source3: 'Government/PIB explanation of the new UPI MDR framework',
  },
  te: {
    appTitle: 'UPI MDR కాలిక్యులేటర్ (భారత్)',
    subtitle: 'RBI, NPCI & భారత ఆర్థిక మంత్రిత్వ శాఖ అధికారిక నిబంధనలు',
    bannerTitle: 'కొత్త UPI MDR నిబంధనలు — 15 అక్టోబర్ 2026 నుండి అమలు',
    bannerSubtext: 'కొత్త MDR నిబంధనలు 15 అక్టోబర్ 2026 నుండి వర్తిస్తాయి. 14 అక్టోబర్ 2026 వరకు సాధారణ బ్యాంక్ UPI 0% MDR తో కొనసాగుతుంది.',
    viewNewRules: 'కొత్త నిబంధనలు — 15 అక్టోబర్ 2026 నుండి',
    viewCurrentRules: 'ప్రస్తుత నిబంధనలు — 14 అక్టోబర్ 2026 వరకు',
    installApp: 'యాప్ ఇన్‌స్టాల్',
    selectLanguage: 'భాష',
    txnStepTitle: '1. చెల్లింపు వివరాలు నమోదు చేయండి',
    amountLabel: 'చెల్లింపు మొత్తం (₹ లలో)',
    amountPlaceholder: 'మొత్తం నమోదు చేయండి (ఉదా: 5000)',
    txnTypeLabel: 'లావాదేవీ రకం (Transaction Type)',
    p2pPersonToPerson: 'P2P (వ్యక్తి నుండి వ్యక్తికి బదిలీ)',
    p2mMerchant: 'P2M (షాపులు / వ్యాపారులకు చెల్లింపు)',
    merchantCatLabel: 'వ్యాపారి కేటగిరీ (5 అధికారిక మార్గాలు)',
    catNormal: 'సాధారణ వ్యాపారి / దుకాణం (0.40%, గరిష్ట పరిమితి ₹300)',
    catSmall: 'చిన్న వ్యాపారులు / P2PM QR (నెలకు ≤ ₹1 లక్ష: 0% ఉచితం)',
    catEssential: 'నిత్యావసరాలు & ఇంధనం (రైల్వేలు, పెట్రోల్: ఫ్లాట్ ₹5)',
    catCapital: 'క్యాపిటల్ మార్కెట్లు (మ్యూచువల్ ఫండ్స్, షేర్లు: 0.02%, గరిష్ట పరిమితి ₹300)',
    paymentModeLabel: 'చెల్లింపు సాధనం (Payment Instrument)',
    modeBank: 'బ్యాంక్ ఖాతా UPI (ప్రామాణికం)',
    modeWallet: 'వాలెట్ / PPI (Paytm/PhonePe Wallet)',
    calculationsTitle: 'ఎవరు ఎంత చెల్లించాలి? (స్పష్టమైన వివరణ)',
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
    currentRulesNotice: '14 అక్టోబర్ 2026 వరకు: జీరో-MDR నిబంధన ప్రకారం బ్యాంక్ UPI కి 0% ఫీజు.',
    newRulesNotice: '15 అక్టోబర్ 2026 నుండి: కొత్త RBI/NPCI నిబంధనల ప్రకారం లెక్కింపు జరుగుతుంది (0.40%, ఫ్లాట్ ₹5, 0% చిన్న వ్యాపారులకు).',
    lastVerified: 'చివరిగా ధృవీకరించిన తేదీ: 30 సెప్టెంబర్ 2026',
    officialSources: 'అధికారిక ప్రభుత్వ & నియంత్రణ వనరులు:',
    source1: 'NPCI UPI సర్క్యులర్లు',
    source2: 'ఆర్థిక సేవల విభాగం (DFS) తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    source3: 'ప్రెస్ ఇన్ఫర్మేషన్ బ్యూరో (PIB) అధికారిక ప్రకటన',
  },
  hi: {
    appTitle: 'यूपीआई एमडीआर कैलकुलेटर भारत',
    subtitle: 'आरबीआई, एनपीसीआई और वित्त मंत्रालय के आधिकारिक दिशानिर्देश',
    bannerTitle: 'नए यूपीआई एमडीआर नियम — 15 अक्टूबर 2026 से प्रभावी',
    bannerSubtext: 'नए नियम 15 अक्टूबर 2026 से प्रभावी होंगे। 14 अक्टूबर 2026 तक सामान्य बैंक यूपीआई पर 0% MDR जारी है।',
    viewNewRules: 'नए नियम — 15 अक्टूबर 2026 से',
    viewCurrentRules: 'वर्तमान नियम — 14 अक्टूबर 2026 तक',
    installApp: 'ऐप इंस्टॉल करें',
    selectLanguage: 'भाषा',
    txnStepTitle: '1. भुगतान विवरण दर्ज करें',
    amountLabel: 'लेनदेन राशि (₹ में)',
    amountPlaceholder: 'राशि दर्ज करें (जैसे 5000)',
    txnTypeLabel: 'लेनदेन का प्रकार',
    p2pPersonToPerson: 'P2P (मित्रों / परिवार को ट्रांसफर)',
    p2mMerchant: 'P2M (दुकानदार / मर्चेंट को भुगतान)',
    merchantCatLabel: 'व्यापारी श्रेणी (5 आधिकारिक गणना मार्ग)',
    catNormal: 'सामान्य व्यापारी / दुकान (0.40%, अधिकतम ₹300)',
    catSmall: 'छोटे व्यापारी / P2PM QR (≤ ₹1 लाख/माह: 0% मुफ़्त)',
    catEssential: 'आवश्यक सेवाएं एवं ईंधन (पेट्रोल, रेलवे: फ्लैट ₹5)',
    catCapital: 'शेयर बाजार, म्यूचुअल फंड (0.02%, अधिकतम ₹300)',
    paymentModeLabel: 'भुगतान माध्यम',
    modeBank: 'बैंक खाता यूपीआई (सामान्य)',
    modeWallet: 'वॉलेट / पीपीआई (Paytm/PhonePe)',
    calculationsTitle: 'किसको कितना देना होगा? (स्पष्ट गणना)',
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
    currentRulesNotice: '14 अक्टूबर 2026 तक: जीरो-एमडीआर निर्देश के तहत बैंक यूपीआई पर 0% MDR लागू है।',
    newRulesNotice: '15 अक्टूबर 2026 से: आधिकारिक आरबीआई/एनपीसीआई ढांचा लागू होगा।',
    lastVerified: 'अंतिम सत्यापन: 30 सितंबर 2026',
    officialSources: 'आधिकारिक सरकारी और नियामक स्रोत:',
    source1: 'NPCI UPI परिपत्र',
    source2: 'वित्तीय सेवा विभाग (DFS) FAQ',
    source3: 'प्रेस सूचना ब्यूरो (PIB) विज्ञप्ति',
  },
  mr: {
    appTitle: 'UPI MDR कॅल्क्युलेटर भारत',
    subtitle: 'RBI, NPCI आणि वित्त मंत्रालयाची अधिकृत मार्गदर्शक तत्त्वे',
    bannerTitle: 'नवीन UPI MDR नियम — 15 ऑक्टोबर 2026 पासून लागू',
    bannerSubtext: 'नवीन नियम 15 ऑक्टोबर 2026 पासून लागू होतील. 14 ऑक्टोबर 2026 पर्यंत 0% MDR कायम राहील.',
    viewNewRules: 'नवीन नियम — 15 ऑक्टोबर 2026 पासून',
    viewCurrentRules: 'सध्याचे नियम — 14 ऑक्टोबर 2026 पर्यंत',
    installApp: 'अॅप इंस्टॉल करा',
    selectLanguage: 'भाषा',
    txnStepTitle: '1. पेमेंट तपशील प्रविष्ट करा',
    amountLabel: 'व्यवहार रक्कम (₹ मध्ये)',
    amountPlaceholder: 'रक्कम प्रविष्ट करा',
    txnTypeLabel: 'व्यवहार प्रकार',
    p2pPersonToPerson: 'P2P (व्यक्ती ते व्यक्ती हस्तांतरण)',
    p2mMerchant: 'P2M (दुकानदार / व्यापारी पेमेंट)',
    merchantCatLabel: 'व्यापारी वर्ग (5 अधिकृत मार्ग)',
    catNormal: 'सामान्य व्यापारी / दुकान (0.40%, कमाल मर्यादा ₹300)',
    catSmall: 'लहान व्यापारी / P2PM QR (≤ ₹1 लाख/महिना: 0% मोफत)',
    catEssential: 'अत्यावश्यक सेवा आणि इंधन (फ्लॅट ₹5)',
    catCapital: 'भांडवली बाजार, म्युच्युअल फंड (0.02%, कमाल मर्यादा ₹300)',
    paymentModeLabel: 'पेमेंट साधन',
    modeBank: 'बँक खाते UPI (मानक)',
    modeWallet: 'वॉलेट / PPI (Paytm/PhonePe)',
    calculationsTitle: 'कोणी किती भरावे? (स्पष्ट हिशोब)',
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
    currentRulesNotice: '14 ऑक्टोबर 2026 पर्यंत: बँक UPI वर 0% MDR लागू आहे.',
    newRulesNotice: '15 ऑक्टोबर 2026 पासून: अधिकृत 0.40% आणि फ्लॅट ₹5 नियम लागू होतील.',
    lastVerified: 'अंतिम पडताळणी: 30 सप्टेंबर 2026',
    officialSources: 'अधिकृत सरकारी आणि नियामक स्रोत:',
    source1: 'NPCI UPI परिपत्रके',
    source2: 'वित्तीय सेवा विभाग (DFS) FAQ',
    source3: 'प्रेस इन्फॉर्मेशन ब्युरो (PIB)',
  },
  gu: {
    appTitle: 'UPI MDR કેલ્ક્યુલેટર ભારત',
    subtitle: 'RBI, NPCI અને નાણા મંત્રાલયની સત્તાવાર માર્ગદર્શિકા',
    bannerTitle: 'નવા UPI MDR નિયમો — 15 ઓક્ટોબર 2026 થી અમલી',
    bannerSubtext: 'નવા નિયમો 15 ઓક્ટોબર 2026 થી અમલમાં આવશે. 14 ઓક્ટોબર 2026 સુધી 0% MDR ચાલુ રહેશે.',
    viewNewRules: 'નવા નિયમો — 15 ઓક્ટોબર 2026 થી',
    viewCurrentRules: 'હાલના નિયમો — 14 ઓક્ટોબર 2026 સુધી',
    installApp: 'એપ્લિકેશન ઇન્સ્ટોલ કરો',
    selectLanguage: 'ભાષા',
    txnStepTitle: '1. ચુકવણી વિગતો દાખલ કરો',
    amountLabel: 'ચુકવણી રકમ (₹ માં)',
    amountPlaceholder: 'રકમ દાખલ કરો',
    txnTypeLabel: 'ટ્રાન્ઝેક્શન પ્રકાર',
    p2pPersonToPerson: 'P2P (વ્યક્તિ થી વ્યક્તિ ટ્રાન્સફર)',
    p2mMerchant: 'P2M (વેપારી / દુકાનદારને ચુકવણી)',
    merchantCatLabel: 'વેપારી શ્રેણી (5 સત્તાવાર માર્ગો)',
    catNormal: 'સામાન્ય વેપારી / દુકાન (0.40%, મહત્તમ ₹300)',
    catSmall: 'નાના વેપારી / P2PM QR (≤ ₹1 લાખ/માસ: 0% મફત)',
    catEssential: 'આવશ્યક સેવાઓ અને ઇંધણ (ફ્લેટ ₹5)',
    catCapital: 'શેરબજાર, મ્યુચ્યુઅલ ફંડ (0.02%, મહત્તમ ₹300)',
    paymentModeLabel: 'ચુકવણી સાધન',
    modeBank: 'બેંક ખાતું UPI (સ્ટાન્ડર્ડ)',
    modeWallet: 'વોલેટ / PPI (Paytm/PhonePe)',
    calculationsTitle: 'કોણે કેટલું ચૂકવવું? (ચોખ્ખો હિસાબ)',
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
    currentRulesNotice: '14 ઓક્ટોબર 2026 સુધી: બેંક UPI પર 0% MDR લાગુ છે.',
    newRulesNotice: '15 ઓક્ટોબર 2026 થી: સત્તાવાર 0.40% અને ફ્લેટ ₹5 માળખું લાગુ થશે.',
    lastVerified: 'છેલ્લી ચકાસણી: 30 સપ્ટેમ્બર 2026',
    officialSources: 'સત્તાવાર સરકારી સ્ત્રોતો:',
    source1: 'NPCI UPI પરિપત્રો',
    source2: 'નાણાકીય સેવાઓ વિભાગ (DFS) FAQ',
    source3: 'પ્રેસ ઇન્ફોર્મેશન બ્યુરો (PIB)',
  },
  ta: {
    appTitle: 'UPI MDR கால்குலேட்டர் இந்தியா',
    subtitle: 'RBI, NPCI மற்றும் நிதி அமைச்சகத்தின் அதிகாரப்பூர்வ வழிகாட்டுதல்கள்',
    bannerTitle: 'புதிய UPI MDR விதிகள் — 15 அக்டோபர் 2026 முதல் அமல்',
    bannerSubtext: 'புதிய விதிகள் 15 அக்டோபர் 2026 முதல் அமலுக்கு வரும். 14 அக்டோபர் 2026 வரை 0% MDR தொடரும்.',
    viewNewRules: 'புதிய விதிகள் — 15 அக்டோபர் 2026 முதல்',
    viewCurrentRules: 'தற்போதைய விதிகள் — 14 அக்டோபர் 2026 வரை',
    installApp: 'செயலியை நிறுவு',
    selectLanguage: 'மொழி',
    txnStepTitle: '1. கட்டண விவரங்களை உள்ளிடவும்',
    amountLabel: 'பரிவர்த்தனை தொகை (₹ இல்)',
    amountPlaceholder: 'தொகையை உள்ளிடவும்',
    txnTypeLabel: 'பரிவர்த்தனை வகை',
    p2pPersonToPerson: 'P2P (நண்பர் / குடும்பத்திற்கு அனுப்புதல்)',
    p2mMerchant: 'P2M (கடை / வணிகருக்கு செலுத்துதல்)',
    merchantCatLabel: 'வணிகர் பிரிவு (5 அதிகாரப்பூர்வ வழிகள்)',
    catNormal: 'சாதாரண வணிகர் / கடை (0.40%, உச்சவரம்பு ₹300)',
    catSmall: 'சிறு வணிகர்கள் / P2PM QR (மாதம் ≤ ₹1 லட்சம்: 0% இலவசம்)',
    catEssential: 'அத்தியாவசிய சேவைகள் & எரிபொருள் (நிலையான ₹5)',
    catCapital: 'பங்குச் சந்தை, மியூச்சுவல் ஃபண்ட் (0.02%, உச்சவரம்பு ₹300)',
    paymentModeLabel: 'கட்டண முறை',
    modeBank: 'வங்கி கணக்கு UPI (வழக்கமான)',
    modeWallet: 'வாலட் / PPI (Paytm/PhonePe)',
    calculationsTitle: 'யார் எவ்வளவு செலுத்த வேண்டும்? (தெளிவான கணக்கீடு)',
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
    currentRulesNotice: '14 அக்டோபர் 2026 வரை: வங்கி UPI பரிவர்த்தனைகளுக்கு 0% MDR.',
    newRulesNotice: '15 அக்டோபர் 2026 முதல்: 0.40% மற்றும் நிலையான ₹5 விதிகள் அமலாகும்.',
    lastVerified: 'கடைசியாக சரிபார்க்கப்பட்டது: 30 செப்டம்பர் 2026',
    officialSources: 'அதிகாரப்பூர்வ அரசு மற்றும் ஒழுங்குமுறை ஆதாரங்கள்:',
    source1: 'NPCI UPI சுற்றறிக்கைகள்',
    source2: 'நிதிச் சேவைகள் துறை (DFS) FAQ',
    source3: 'பத்திரிகை தகவல் பணியகம் (PIB)',
  },
  bn: {
    appTitle: 'UPI MDR ক্যালকুলেটর ভারত',
    subtitle: 'RBI, NPCI এবং অর্থ মন্ত্রণালয়ের সরকারি নির্দেশিকা',
    bannerTitle: 'নতুন UPI MDR নিয়ম — ১৫ অক্টোবর ২০২৬ থেকে কার্যকর',
    bannerSubtext: 'নতুন নিয়ম ১৫ অক্টোবর ২০২৬ থেকে কার্যকর হবে। ১৪ অক্টোবর ২০২৬ পর্যন্ত ০% MDR কার্যকর থাকবে।',
    viewNewRules: 'নতুন নিয়ম — ১৫ অক্টোবর ২০২৬ থেকে',
    viewCurrentRules: 'বর্তমান নিয়ম — ১৪ অক্টোবর ২০২৬ পর্যন্ত',
    installApp: 'অ্যাপ ইনস্টল করুন',
    selectLanguage: 'ভাষা',
    txnStepTitle: '১. লেনদেনের বিবরণ লিখুন',
    amountLabel: 'লেনদেনের পরিমাণ (₹ তে)',
    amountPlaceholder: 'পরিমাণ লিখুন',
    txnTypeLabel: 'লেনদেনের ধরন',
    p2pPersonToPerson: 'P2P (ব্যক্তি থেকে ব্যক্তি স্থানান্তর)',
    p2mMerchant: 'P2M (দোকানদার / ব্যবসায়ীকে পেমেন্ট)',
    merchantCatLabel: 'ব্যবসায়ী বিভাগ (৫টি সরকারি পথ)',
    catNormal: 'সাধারণ ব্যবসায়ী / দোকান (০.৪০%, সর্বোচ্চ ₹৩০০)',
    catSmall: 'ক্ষুদ্র ব্যবসায়ী / P2PM QR (মাসে ≤ ₹১ লাখ: ০% বিনামূল্যে)',
    catEssential: 'জরুরি পরিষেবা ও জ্বালানি (ফ্ল্যাট ₹৫)',
    catCapital: 'শেয়ার বাজার, মিউচুয়াল ফান্ড (০.০২%, সর্বোচ্চ ₹৩০০)',
    paymentModeLabel: 'পেমেন্ট মাধ্যম',
    modeBank: 'ব্যাংক একাউন্ট UPI (সাধারণ)',
    modeWallet: 'ওয়ালেট / PPI (Paytm/PhonePe)',
    calculationsTitle: 'কার কত খরচ হবে? (স্পষ্ট হিসাব)',
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
    currentRulesNotice: '১৪ অক্টোবর ২০২৬ পর্যন্ত: ব্যাংক UPI-তে ০% MDR প্রযোজ্য।',
    newRulesNotice: '১৫ অক্টোবর ২০২৬ থেকে: সরকারি ০.৪০% এবং ফ্ল্যাট ₹৫ নিয়ম কার্যকর হবে।',
    lastVerified: 'সর্বশেষ যাচাই: ৩০ সেপ্টেম্বর ২০২৬',
    officialSources: 'সরকারি ও নিয়ন্ত্রক সূত্র:',
    source1: 'NPCI UPI সার্কুলার',
    source2: 'আর্থিক পরিষেবা বিভাগ (DFS) FAQ',
    source3: 'প্রেস ইনফরমেশন ব্যুরো (PIB)',
  },
  or: {
    appTitle: 'UPI MDR କ୍ୟାଲକୁଲେଟର ଭାରତ',
    subtitle: 'RBI, NPCI ଏବଂ ଅର୍ଥ ମନ୍ତ୍ରଣାଳୟର ସରକାରୀ ନିର୍ଦ୍ଦେଶାବଳୀ',
    bannerTitle: 'ନୂତନ UPI MDR ନିୟମ — ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ ଲାଗୁ',
    bannerSubtext: 'ନୂତନ ନିୟମ ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ ଲାଗୁ ହେବ। ୧୪ ଅକ୍ଟୋବର ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ ୦% MDR ଜାରି ରହିବ।',
    viewNewRules: 'ନୂତନ ନିୟମ — ୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ',
    viewCurrentRules: 'ବର୍ତ୍ତମାନର ନିୟମ — ୧୪ ଅକ୍ଟୋବର ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ',
    installApp: 'ଆପ୍ ଇନଷ୍ଟଲ କରନ୍ତୁ',
    selectLanguage: 'ଭାଷା',
    txnStepTitle: '୧. ପେମେଣ୍ଟ ବିବରଣୀ ପ୍ରବେଶ କରନ୍ତୁ',
    amountLabel: 'ଦେୟ ରାଶି (₹ ରେ)',
    amountPlaceholder: 'ରାଶି ଲେଖନ୍ତୁ',
    txnTypeLabel: 'କାରବାର ପ୍ରକାର',
    p2pPersonToPerson: 'P2P (ବ୍ୟକ୍ତିଗତ ସ୍ଥାନାନ୍ତର)',
    p2mMerchant: 'P2M (ଦୋକାନୀ / ବ୍ୟବସାୟୀଙ୍କୁ ଦେୟ)',
    merchantCatLabel: 'ବ୍ୟବସାୟୀ ବର୍ଗ (୫ଟି ସରକାରୀ ପଥ)',
    catNormal: 'ସାଧାରଣ ବ୍ୟବସାୟୀ / ଦୋକାନ (୦.୪୦%, ସର୍ବାଧିକ ₹୩୦୦)',
    catSmall: 'କ୍ଷୁଦ୍ର ବ୍ୟବସାୟୀ / P2PM QR (ମାସିକ ≤ ₹୧ ଲକ୍ଷ: ୦% ମାଗଣା)',
    catEssential: 'ଅତ୍ୟାବଶ୍ୟକ ସେବା ଓ ଇନ୍ଧନ (ଫ୍ଲାଟ୍ ₹୫)',
    catCapital: 'ପୁଞ୍ଜି ବଜାର, ମ୍ୟୁଚୁଆଲ୍ ଫଣ୍ଡ (୦.୦୨%, ସର୍ବାଧିକ ₹୩୦୦)',
    paymentModeLabel: 'ପେମେଣ୍ଟ ମାଧ୍ୟମ',
    modeBank: 'ବ୍ୟାଙ୍କ ଖାତା UPI (ମାନକ)',
    modeWallet: 'ୱାଲେଟ୍ / PPI (Paytm/PhonePe)',
    calculationsTitle: 'କାହାର କେତେ ଖର୍ଚ୍ଚ ହେବ? (ସ୍ପଷ୍ଟ ହିସାବ)',
    freeBadge: '୧୦୦% ମାଗଣା (₹୦ ଶୁଳ୍କ)',
    feeBadge: 'ବ୍ୟବସାୟୀ MDR କଟାଯିବ',
    boxCustomerPaid: 'ଗ୍ରାହକ ଦେଉଥିବା ରାଶି',
    boxCustomerExtra: 'ଗ୍ରାହକ MDR',
    boxZeroCustomer: '₹୦ (ସର୍ବଦା ମାଗଣା)',
    boxCustomerDesc: 'ଗ୍ରାହକଙ୍କ ଠାରୁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନିଆଯିବ ନାହିଁ (Sec 10A PSS Act)',
    boxBankMdr: 'ବ୍ୟବସାୟୀ MDR (ବ୍ୟାଙ୍କ କଟନ)',
    boxMerchantGets: 'ବ୍ୟବସାୟୀଙ୍କ ବ୍ୟାଙ୍କରେ ଜମା',
    receiptTitle: 'କାରବାର ରସିଦ ବିବରଣୀ',
    customerScanned: 'ଗ୍ରାହକଙ୍କ ଖାତାରୁ କଟାଯାଇଥିବା ରାଶି:',
    noExtraFee: 'ଗ୍ରାହକଙ୍କ ପାଇଁ କୌଣସି ଅତିରିକ୍ତ ଶୁଳ୍କ ନାହିଁ',
    bankDeduction: 'ବ୍ୟାଙ୍କ MDR କଟନ:',
    netShopCredit: 'ବ୍ୟବସାୟୀଙ୍କ ଖାତାରେ ଜମା ହେବାକୁ ଥିବା ନିଟ୍ ରାଶି:',
    currentRulesNotice: '୧୪ ଅକ୍ଟୋବର ୨୦୨୬ ପର୍ଯ୍ୟନ୍ତ: ବ୍ୟାଙ୍କ UPI ରେ ୦% MDR ଲାଗୁ ଅଛି।',
    newRulesNotice: '୧୫ ଅକ୍ଟୋବର ୨୦୨୬ ରୁ: ସରକାରୀ ୦.୪୦% ଏବଂ ଫ୍ଲାଟ୍ ₹୫ ନିୟମ ଲାଗୁ ହେବ।',
    lastVerified: 'ଶେଷ ଯାଞ୍ଚ: ୩୦ ସେପ୍ଟେମ୍ବର ୨୦୨୬',
    officialSources: 'ସରକାରୀ ଓ ନିୟାମକ ଉତ୍ସ:',
    source1: 'NPCI UPI ସର୍କୁଲାର୍',
    source2: 'ଆର୍ଥିକ ସେବା ବିଭାଗ (DFS) FAQ',
    source3: 'ପ୍ରେସ୍ ଇନଫରମେସନ୍ ବ୍ୟୁରୋ (PIB)',
  },
  kn: {
    appTitle: 'UPI MDR ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಭಾರತ',
    subtitle: 'RBI, NPCI ಮತ್ತು ಹಣಕಾಸು ಸಚಿವಾಲಯದ ಅಧಿಕೃತ ಮಾರ್ಗಸೂಚಿಗಳು',
    bannerTitle: 'ಹೊಸ UPI MDR ನಿಯಮಗಳು — 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ ಜಾರಿ',
    bannerSubtext: 'ಹೊಸ ನಿಯಮಗಳು 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ ಅನ್ವಯವಾಗುತ್ತವೆ. 14 ಅಕ್ಟೋಬರ್ 2026 ರವರೆಗೆ 0% MDR ಮುಂದುವರಿಯುತ್ತದೆ.',
    viewNewRules: 'ಹೊಸ ನಿಯಮಗಳು — 15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ',
    viewCurrentRules: 'ಪ್ರಸ್ತುತ ನಿಯಮಗಳು — 14 ಅಕ್ಟೋಬರ್ 2026 ರವರೆಗೆ',
    installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
    selectLanguage: 'ಭಾಷೆ',
    txnStepTitle: '1. ಪಾವತಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    amountLabel: 'ವಹಿವಾಟು ಮೊತ್ತ (₹ ಗಳಲ್ಲಿ)',
    amountPlaceholder: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    txnTypeLabel: 'ವಹಿವಾಟಿನ ಪ್ರಕಾರ',
    p2pPersonToPerson: 'P2P (ವ್ಯಕ್ತಿಯಿಂದ ವ್ಯಕ್ತಿಗೆ ವರ್ಗಾವಣೆ)',
    p2mMerchant: 'P2M (ವ್ಯಾಪಾರಿ / ಅಂಗಡಿಗೆ ಪಾವತಿ)',
    merchantCatLabel: 'ವ್ಯಾಪಾರಿ ವರ್ಗ (5 ಅಧಿಕೃತ ಮಾರ್ಗಗಳು)',
    catNormal: 'ಸಾಮಾನ್ಯ ವ್ಯಾಪಾರಿ / ಅಂಗಡಿ (0.40%, ಗರಿಷ್ಠ ಮಿತಿ ₹300)',
    catSmall: 'ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು / P2PM QR (ತಿಂಗಳಿಗೆ ≤ ₹1 ಲಕ್ಷ: 0% ಉಚಿತ)',
    catEssential: 'ಅಗತ್ಯ ಸೇವೆಗಳು & ಇಂಧನ (ಫ್ಲಾಟ್ ₹5)',
    catCapital: 'ಬಂಡವಾಳ ಮಾರುಕಟ್ಟೆ, ಮ್ಯೂಚುಯಲ್ ಫಂಡ್ (0.02%, ಗರಿಷ್ಠ ಮಿತಿ ₹300)',
    paymentModeLabel: 'ಪಾವತಿ ವಿಧಾನ',
    modeBank: 'ಬ್ಯಾಂಕ್ ಖಾತೆ UPI (ಸಾಮಾನ್ಯ)',
    modeWallet: 'ವಾಲೆಟ್ / PPI (Paytm/PhonePe)',
    calculationsTitle: 'ಯಾರು ಎಷ್ಟು ಪಾವತಿಸಬೇಕು? (ಸ್ಪಷ್ಟ ಲೆಕ್ಕಾಚಾರ)',
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
    currentRulesNotice: '14 ಅಕ್ಟೋಬರ್ 2026 ರವರೆಗೆ: ಬ್ಯಾಂಕ್ UPI ಮೇಲೆ 0% MDR ಅನ್ವಯಿಸುತ್ತದೆ.',
    newRulesNotice: '15 ಅಕ್ಟೋಬರ್ 2026 ರಿಂದ: ಅಧಿಕೃತ 0.40% ಮತ್ತು ಫ್ಲಾಟ್ ₹5 ನಿಯಮಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.',
    lastVerified: 'ಕೊನೆಯ ಪರಿಶೀಲನೆ: 30 ಸೆಪ್ಟೆಂಬರ್ 2026',
    officialSources: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮತ್ತು ನಿಯಂತ್ರಕ ಮೂಲಗಳು:',
    source1: 'NPCI UPI ಸುತ್ತೋಲೆಗಳು',
    source2: 'ಹಣಕಾಸು ಸೇವೆಗಳ ಇಲಾಖೆ (DFS) FAQ',
    source3: 'ಪತ್ರಿಕಾ ಮಾಹಿತಿ ಬ್ಯೂರೋ (PIB)',
  },
};

// =========================================================================
// 2. HELPER FORMATTER
// =========================================================================
export function formatINR(val: number, showDecimals = false): string {
  if (val === undefined || isNaN(val)) return '₹0';
  const rounded = Math.round((val + Number.EPSILON) * 100) / 100;
  if (showDecimals && rounded % 1 !== 0) {
    return `₹${rounded.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `₹${rounded.toLocaleString('en-IN')}`;
}

// =========================================================================
// 3. MAIN REACT COMPONENT
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

  const numericAmount = parseFloat(amountInput) || 0;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Evaluation date passed to verified engine:
  const evaluationDate = ruleEpoch === 'new_oct_2026' ? '2026-10-15' : '2026-09-30';

  // Single source of truth calculation engine:
  const result = useMemo(() => {
    return calculateUpiMdr({
      amount: numericAmount,
      transactionType: txnType,
      paymentInstrument,
      merchantCategory,
      evaluationDate,
    });
  }, [numericAmount, txnType, paymentInstrument, merchantCategory, evaluationDate]);

  const isFree = !result.isMdrApplicable || result.estimatedMdr === 0;

  // Layman Category Label for formula strip
  const categoryTag = useMemo(() => {
    if (txnType === 'P2P') return 'P2P Transfer';
    if (paymentInstrument === 'ppi_wallet') return 'Wallet/PPI on UPI';
    switch (merchantCategory) {
      case 'regular_merchant':
        return 'Standard P2M — 0.40%';
      case 'essential_services':
        return 'Essential Sector — Flat ₹5';
      case 'capital_markets':
        return 'Capital Markets — 0.02%';
      case 'small_merchant':
        return 'Small Merchant (P2PM) — 0%';
      default:
        return 'Standard P2M';
    }
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
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-sm transition cursor-pointer"
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
                    {item.nativeName} ({item.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 1-Tap Language Quick Switcher Bar */}
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
                    ? 'rounded-lg bg-white px-2.5 py-0.5 text-xs font-black text-blue-950 shadow-xs shrink-0 cursor-pointer'
                    : 'rounded-lg bg-white/10 px-2 py-0.5 text-xs font-medium text-blue-100 hover:bg-white/20 shrink-0 cursor-pointer'
                }
              >
                {item.nativeName}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Top Implementation Date Banner (Requested by User) */}
      <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 shadow-xs">
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

            {/* Quick Boundary Preset Helper Buttons */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 font-bold">
                {numericAmount > 0 && numericAmount <= 2000 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ≤ ₹2,000: 100% Free
                  </span>
                ) : numericAmount > 2000 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-blue-900 border border-blue-200">
                    <TrendingDown className="w-3.5 h-3.5 text-blue-700" />
                    &gt; ₹2,000: Merchant MDR applies
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700">Test Boundaries:</span>
                <button
                  type="button"
                  onClick={() => setAmountInput('2000')}
                  className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-bold text-slate-700 cursor-pointer"
                >
                  ₹2,000 (Free)
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
                  ₹1,00,000 (Cap)
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Type: P2P (Friend/Family) vs P2M (Shop/Merchant) */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              {/* 5 Official Paths: Merchant Category */}
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

              {/* Payment Instrument (Bank vs Wallet) */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">
                  {t.paymentModeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('bank_account')}
                    className={
                      paymentInstrument === 'bank_account'
                        ? 'rounded-2xl border-2 p-2.5 text-xs font-black text-left transition cursor-pointer border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/20'
                        : 'rounded-2xl border-2 p-2.5 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{t.modeBank}</span>
                      {paymentInstrument === 'bank_account' && (
                        <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      0.40% / Flat ₹5 / 0%
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentInstrument('ppi_wallet')}
                    className={
                      paymentInstrument === 'ppi_wallet'
                        ? 'rounded-2xl border-2 p-2.5 text-xs font-black text-left transition cursor-pointer border-blue-600 bg-blue-50 text-blue-950 ring-2 ring-blue-600/20'
                        : 'rounded-2xl border-2 p-2.5 text-xs font-bold text-left transition cursor-pointer border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{t.modeWallet}</span>
                      {paymentInstrument === 'ppi_wallet' && (
                        <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      )}
                    </div>
                    <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                      1.10% Interchange
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Context Notice */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3 text-xs text-indigo-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              {ruleEpoch === 'new_oct_2026' ? t.newRulesNotice : t.currentRulesNotice}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 2: RESULTS - WHO PAYS HOW MUCH?                                      */}
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

          {/* ULTRA-PROMINENT FORMULA STRIP (As strongly recommended by User) */}
          {/* "Customer pays: ₹10,000 | Customer MDR: ₹0 | Merchant MDR: ₹40 | Standard P2M — 0.4%" */}
          <div className="rounded-2xl border-2 border-emerald-600 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-bold">
                <span className="text-slate-300">
                  Customer pays: <strong className="text-white text-base font-black">{formatINR(result.amount)}</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-emerald-300">
                  Customer MDR: <strong className="text-emerald-400 text-base font-black">₹0</strong>
                </span>
                <span className="text-slate-500 font-bold hidden sm:inline">|</span>
                <span className="text-amber-300">
                  Merchant MDR: <strong className="text-amber-400 text-base font-black">{formatINR(result.estimatedMdr, true)}</strong>
                </span>
              </div>
              <div className="shrink-0 rounded-xl bg-white/10 px-3 py-1 text-xs font-black text-blue-200 border border-white/20">
                {categoryTag}
              </div>
            </div>
          </div>

          {/* 4 Cards: Customer Paid | Customer Extra Fee | Bank Cut | Merchant Gets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-4">
            {/* 1. Customer Scanned Amount */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
              <span className="text-[11px] font-extrabold uppercase text-slate-500 block">
                {t.boxCustomerPaid}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
                {formatINR(result.amount)}
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
                {isFree ? '₹0' : formatINR(result.estimatedMdr, true)}
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
                {formatINR(result.estimatedMerchantSettlement, true)}
              </span>
              <span className="mt-2 text-xs font-bold text-blue-800 block">
                Net credited to bank account
              </span>
            </div>
          </div>

          {/* Breakdown Receipt Summary */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-4 space-y-2">
            <span className="text-xs font-black text-blue-950 uppercase tracking-wider block">
              {'📋 ' + t.receiptTitle + ':'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold">
              <div className="rounded-xl bg-white p-2.5 border border-blue-200">
                <span className="text-slate-500 block text-[11px]">
                  {t.customerScanned}
                </span>
                <span className="font-black text-slate-900 text-sm">
                  {formatINR(result.amount)}
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
                  {formatINR(result.estimatedMdr, true)}
                </span>
                <span className="text-[10px] text-amber-800 block">
                  {result.isFlatFee
                    ? '(Flat ₹5 for essential services)'
                    : result.mdrCapApplied
                    ? `(Capped at ₹${result.mdrCapAmount})`
                    : `(${result.applicableMdrRatePercent}% merchant fee)`}
                </span>
              </div>

              <div className="rounded-xl bg-emerald-100 p-2.5 border border-emerald-300">
                <span className="text-emerald-900 block text-[11px] font-bold">
                  {t.netShopCredit}
                </span>
                <span className="font-black text-emerald-950 text-base">
                  {formatINR(result.estimatedMerchantSettlement, true)}
                </span>
                <span className="text-[10px] text-emerald-800 block">
                  {formatINR(result.amount) + ' - ' + formatINR(result.estimatedMdr, true)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* STEP 3: OFFICIAL 5 CALCULATION PATHS (AT A GLANCE)                        */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-black">
            <ShieldCheck className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm sm:text-base">
              The 5 Official Calculation Paths (Effective 15 October 2026)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-emerald-800 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                1. P2P (Person to Person)
              </span>
              <p className="text-slate-600">
                <strong>₹0 MDR at any amount.</strong> Sending ₹1,000, ₹10,000 or ₹1 Lakh to friends or family is 100% free with zero fees.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-blue-900 block flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-blue-600" />
                2. Normal P2M Merchant
              </span>
              <p className="text-slate-600">
                <strong>≤ ₹2,000 → ₹0.</strong> Above ₹2,000 → <strong>0.40%</strong> on total amount, capped at ₹300 (at ₹75,000+).
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-amber-900 block flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-600" />
                3. Essential / Fuel / Railways
              </span>
              <p className="text-slate-600">
                Railways, telecom, fuel, insurance, and utilities pay a <strong>Flat ₹5 MDR</strong> above ₹2,000, NOT a percentage (e.g. ₹10,000 fuel = ₹5 fee).
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-indigo-900 block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                4. Capital Markets
              </span>
              <p className="text-slate-600">
                Mutual funds, stocks, and securities pay only <strong>0.02%</strong> (Capped at ₹300). E.g. ₹10,000 payment = ₹2 MDR.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-emerald-900 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                5. Small Merchants (P2PM QR)
              </span>
              <p className="text-slate-600">
                Small shops & street vendors receiving <strong>≤ ₹1 Lakh/month</strong> via UPI QR continue to get <strong>0% Zero MDR</strong> on all transactions!
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-1">
              <span className="font-black text-purple-900 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                6. Customer Protection (Zero Fee)
              </span>
              <p className="text-slate-600">
                Customers pay <strong>₹0 extra fee</strong> on all UPI transactions. Passing MDR to customers is prohibited under Section 10A PSS Act.
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
            <span className="text-emerald-700">Section 10A PSS Act Compliant (Zero Customer Surcharge)</span>
          </div>

          <div className="pt-1">
            <span className="font-black text-slate-900 block mb-1.5">
              {t.officialSources}
            </span>
            <div className="flex flex-wrap gap-3 text-xs text-blue-700 font-bold">
              <a
                href="https://www.npci.org.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>{t.source1}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://financialservices.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>{t.source2}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://pib.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
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

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
export default App;
