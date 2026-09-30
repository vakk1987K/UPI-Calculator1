/**
 * Bilingual Translations (English & Telugu)
 * Optimized for natural, clear Telugu usage for Andhra Pradesh & Telangana merchants and users.
 */

export const TRANSLATIONS = {
  en: {
    appTitle: 'UPI MDR Calculator India',
    appTeluguName: 'UPI MDR కాలిక్యులేటర్',
    tagline: 'Simple, accurate UPI MDR and merchant settlement calculator under official RBI & NPCI guidelines.',
    lastUpdatedLabel: 'Last Updated',
    lastUpdatedDate: 'September 2026',
    sourcesLabel: 'Official Sources',
    activeFrameworkBadge: 'Currently Active Framework',
    scheduledFrameworkBadge: 'Scheduled from 15 Oct 2026',
    previewFutureRules: 'Preview Future Rules (15 Oct 2026)',
    activeRulesToday: 'Use Active Rules (Today)',
    dateNoticeUpcoming: 'New UPI MDR rules take effect from 15 October 2026.',
    dateNoticeActive: 'Currently Active: 0% MDR on standard account-to-account UPI under Ministry of Finance directive.',
    
    // Main Form
    formTitle: 'Enter your UPI transaction details',
    formSubtitle: 'Check whether MDR applies, how much the customer pays (₹0 charge), and the estimated merchant settlement.',
    fieldAmount: 'Transaction Amount (₹)',
    fieldAmountPlaceholder: 'Enter amount in ₹ (e.g. 2,000)',
    quickChipsLabel: 'Quick Amounts',
    fieldType: 'Transaction Type',
    typeP2P: 'Person to Person (P2P)',
    typeP2PDesc: 'Direct transfer between two individual bank accounts',
    typeP2M: 'Merchant Payment (P2M)',
    typeP2MDesc: 'Payment made to a shop, merchant, QR code or commercial service',
    fieldPaymentInstrument: 'Payment Method / Instrument',
    instrumentBank: 'Bank Account (Standard UPI)',
    instrumentBankDesc: 'Savings bank account linked UPI (Google Pay, PhonePe, Paytm, BHIM)',
    instrumentWallet: 'Prepaid Wallet / PPI (Paytm/PhonePe Wallet on UPI)',
    instrumentWalletDesc: 'Prepaid wallet or Sodexo used to scan merchant UPI QR code',
    fieldCategory: 'Merchant / Business Category',
    btnCalculate: 'Calculate UPI MDR',
    btnReset: 'Reset',

    // Results Card
    resultHeading: 'Calculation Summary',
    resultStatusMdrApplicable: 'MDR Applicable',
    resultStatusNoMdr: 'No MDR (100% Free)',
    labelTxAmount: 'Transaction Amount',
    labelCustomerPays: 'Customer Pays',
    labelCustomerCharge: 'Customer UPI Charge',
    labelApplicableRate: 'Applicable MDR Rate',
    labelEstimatedMdr: 'Estimated Merchant MDR',
    labelEstimatedSettlement: 'Estimated Merchant Settlement',
    capAppliedBadge: 'Maximum MDR cap applied',
    customerZeroFeeBadge: 'UPI is 100% Free for Customers',
    coreMdrNotice:
      'UPI MDR is a merchant-side payment ecosystem charge. It should not automatically be treated as an additional customer UPI charge.',

    // Merchant Mode
    merchantModeTab: 'Merchant Volume Estimator',
    simpleModeTab: 'Single Transaction Calculator',
    merchantModeTitle: 'Monthly & Annual MDR Estimator for Business Owners',
    merchantModeSubtitle:
      'Calculate aggregate projected MDR costs across your business transactions. All projections are estimations.',
    fieldAvgTicket: 'Average UPI Transaction Amount (₹)',
    fieldDailyTx: 'Number of UPI Transactions per Day',
    fieldBusinessDays: 'Business Days per Month',
    labelMonthlySales: 'Estimated Monthly UPI Sales',
    labelMonthlyTxCount: 'Total Monthly Transactions',
    labelTxSubjectToMdr: 'Transactions Subject to MDR',
    labelEstimatedMonthlyMdr: 'Estimated Monthly MDR',
    labelEstimatedAnnualMdr: 'Estimated Annual MDR',
    labelEstimatedNetMonthlySettlement: 'Estimated Net Monthly Settlement',
    merchantEstimateDisclaimer:
      'Estimates are calculated based on your average ticket size and selected merchant category. Actual bank settlement charges may vary by payment aggregator agreements and GST.',

    // Comparison Table
    tableTitle: 'Dynamically Calculated Benchmark Examples',
    tableSubtitle: 'See how standard transaction sizes are treated under current vs upcoming rules.',
    colPaymentType: 'Payment Type',
    colAmount: 'Amount',
    colCustomerPays: 'Customer Pays',
    colCustomerCharge: 'Customer Charge',
    colMdrRate: 'MDR Rate',
    colMerchantMdr: 'Merchant MDR',
    colMerchantNet: 'Merchant Receives',

    // What is MDR
    whatIsMdrTitle: 'What is UPI MDR?',
    whatIsMdrSubtitle: 'A simple, honest explanation for customers and business owners.',
    p2pDefTitle: '1. What is Person-to-Person (P2P)?',
    p2pDefBody:
      'When you send money directly to a friend, family member, or colleague using their mobile number, UPI ID, or personal QR code. P2P transfers are 100% free with zero charges for both sender and receiver.',
    p2mDefTitle: '2. What is Person-to-Merchant (P2M)?',
    p2mDefBody:
      'When you pay a shopkeeper, supermarket, restaurant, or online store by scanning a merchant QR code or entering a merchant UPI ID. P2M transactions are processed through merchant acquiring systems.',
    mdrDefTitle: '3. What is Merchant Discount Rate (MDR)?',
    mdrDefBody:
      'MDR is a small processing fee deducted on the merchant side by the payment ecosystem (banks, payment aggregators, NPCI) for facilitating digital payments. Crucially, MDR is NOT an extra fee added to the customer’s bill.',
    thresholdDefTitle: '4. What is the ₹2,000 Threshold?',
    thresholdDefBody:
      'Under the revised framework, transactions up to ₹2,000 remain completely exempt (0% MDR). This ensures small daily purchases (groceries, vegetables, tea, milk) remain 100% cost-free for small merchants.',
    capDefTitle: '5. What is the Maximum MDR Cap?',
    capDefBody:
      'Even when a high-value transaction exceeds ₹2,000, regulations mandate a maximum rupee ceiling (e.g. ₹15 for small merchants and essential services, ₹30 for standard merchants). The merchant never pays more than the capped amount regardless of how large the transaction is.',

    // FAQs
    faqTitle: 'Frequently Asked Questions (FAQs)',
    faqSubtitle: 'Clear answers based strictly on official RBI, NPCI, and Ministry of Finance directives.',
    
    // Privacy & Disclaimer
    privacyTitle: 'Privacy & Security Guarantee',
    privacyBody:
      'This calculator operates 100% client-side inside your browser or device. We do NOT collect, transmit, or store any UPI IDs, phone numbers, bank accounts, transaction SMS, or financial details. No login or banking permissions are required.',
    disclaimerTitle: 'Regulatory Disclaimer',
    officialSourcesTitle: 'Verified Official Sources',
    independenceNotice:
      'This application is an independent public utility calculator and is not an official app of or affiliated with the Reserve Bank of India (RBI), National Payments Corporation of India (NPCI), or the Government of India.',
    installAppBtn: 'Install App (PWA)',
    offlineActiveBadge: 'Offline Ready',
  },
  te: {
    appTitle: 'UPI MDR కాలిక్యులేటర్',
    appTeluguName: 'UPI MDR కాలిక్యులేటర్',
    tagline: 'భారతీయ వ్యాపారులు మరియు కస్టమర్ల కోసం RBI మరియు NPCI అధికారిక నిబంధనల ప్రకారం ఖచ్చితమైన UPI MDR కాలిక్యులేటర్.',
    lastUpdatedLabel: 'చివరిగా అప్‌డేట్ చేసిన తేదీ',
    lastUpdatedDate: 'సెప్టెంబర్ 2026',
    sourcesLabel: 'అధికారిక వనరులు',
    activeFrameworkBadge: 'ప్రస్తుతం అమల్లో ఉన్న నిబంధనలు',
    scheduledFrameworkBadge: '15 అక్టోబర్ 2026 నుండి అమల్లోకి రానున్న నిబంధనలు',
    previewFutureRules: 'రాబోయే కొత్త నిబంధనలు చూడండి (15 అక్టోబర్ 2026)',
    activeRulesToday: 'నేటి ప్రస్తుత నిబంధనలను వాడండి',
    dateNoticeUpcoming: 'కొత్త UPI MDR నిబంధనలు 15 అక్టోబర్ 2026 నుండి అమల్లోకి వస్తాయి.',
    dateNoticeActive: 'ప్రస్తుతం అమల్లో ఉన్నది: ఆర్థిక మంత్రిత్వ శాఖ మార్గదర్శకాల ప్రకారం ప్రామాణిక UPI కి 0% MDR.',

    // Main Form
    formTitle: 'మీ UPI లావాదేవీ వివరాలు నమోదు చేయండి',
    formSubtitle: 'ఈ లావాదేవీకి MDR వర్తిస్తుందా, కస్టమర్ ఎంత చెల్లించాలి (₹0 ఛార్జ్), వ్యాపారికి ఎంత మొత్తం అందుతుందో తెలుసుకోండి.',
    fieldAmount: 'లావాదేవీ మొత్తం (₹)',
    fieldAmountPlaceholder: 'మొత్తం నమోదు చేయండి (ఉదా: 2,000)',
    quickChipsLabel: 'శీఘ్ర ఎంపిక బటన్లు',
    fieldType: 'లావాదేవీ రకం',
    typeP2P: 'వ్యక్తి నుండి వ్యక్తికి (P2P)',
    typeP2PDesc: 'మరో వ్యక్తి బ్యాంక్ ఖాతాకు నేరుగా డబ్బు పంపడం',
    typeP2M: 'వ్యాపారికి చెల్లింపు (P2M)',
    typeP2MDesc: 'దుకాణం, వ్యాపారి క్యూఆర్ కోడ్ లేదా సర్వీస్‌కు చేసే చెల్లింపు',
    fieldPaymentInstrument: 'చెల్లింపు విధానం (పేమెంట్ సాధనం)',
    instrumentBank: 'బ్యాంక్ ఖాతా (ప్రామాణిక UPI)',
    instrumentBankDesc: 'సేవింగ్స్ బ్యాంక్ ఖాతాతో లింక్ అయిన UPI (Google Pay, PhonePe, Paytm, BHIM)',
    instrumentWallet: 'ప్రీపెయిడ్ వాలెట్ / PPI (UPI క్యూఆర్ పై వాలెట్)',
    instrumentWalletDesc: 'మర్చంట్ క్యూఆర్ కోడ్ స్కాన్ చేయడానికి ఉపయోగించే Paytm/PhonePe వాలెట్ బ్యాలెన్స్',
    fieldCategory: 'వ్యాపారి వర్గం (మర్చంట్ కేటగిరీ)',
    btnCalculate: 'UPI MDR లెక్కించండి',
    btnReset: 'మొదటినుండి ప్రారంభించండి',

    // Results Card
    resultHeading: 'లావాదేవీ లెక్కింపు సారాంశం',
    resultStatusMdrApplicable: 'MDR వర్తిస్తుంది',
    resultStatusNoMdr: 'MDR లేదు (100% ఉచితం)',
    labelTxAmount: 'లావాదేవీ మొత్తం',
    labelCustomerPays: 'కస్టమర్ చెల్లించే మొత్తం',
    labelCustomerCharge: 'కస్టమర్ UPI ఛార్జ్',
    labelApplicableRate: 'వర్తించే MDR రేటు',
    labelEstimatedMdr: 'అంచనా వేసిన వ్యాపారి MDR',
    labelEstimatedSettlement: 'వ్యాపారికి అందే మొత్తం (సెటిల్మెంట్)',
    capAppliedBadge: 'గరిష్ట MDR పరిమితి వర్తించబడింది',
    customerZeroFeeBadge: 'కస్టమర్లకు UPI 100% ఉచితం',
    coreMdrNotice:
      'UPI MDR అనేది వ్యాపారి వైపు వర్తించే చెల్లింపు వ్యవస్థ ఛార్జ్. దీనిని కస్టమర్పై అదనపు UPI ఛార్జ్గా భావించకండి.',

    // Merchant Mode
    merchantModeTab: 'వ్యాపార నెలవారీ అంచనా',
    simpleModeTab: 'సింగిల్ లావాదేవీ కాలిక్యులేటర్',
    merchantModeTitle: 'వ్యాపారుల కోసం నెలవారీ & వార్షిక MDR అంచనా కాలిక్యులేటర్',
    merchantModeSubtitle:
      'మీ రోజువారీ దుకాణ లావాదేవీల ఆధారంగా నెలవారీ మరియు వార్షిక MDR ఖర్చులను అంచనా వేయండి.',
    fieldAvgTicket: 'సగటు UPI లావాదేవీ మొత్తం (₹)',
    fieldDailyTx: 'రోజుకు జరిగే UPI లావాదేవీల సంఖ్య',
    fieldBusinessDays: 'నెలలో వ్యాపార దినాలు (రోజులు)',
    labelMonthlySales: 'నెలవారీ మొత్తం UPI అమ్మకాలు',
    labelMonthlyTxCount: 'మొత్తం నెలవారీ లావాదేవీలు',
    labelTxSubjectToMdr: 'MDR వర్తించే లావాదేవీల సంఖ్య',
    labelEstimatedMonthlyMdr: 'అంచనా వేసిన నెలవారీ MDR',
    labelEstimatedAnnualMdr: 'అంచనా వేసిన వార్షిక MDR',
    labelEstimatedNetMonthlySettlement: 'వ్యాపారికి అందే నికర నెలవారీ మొత్తం',
    merchantEstimateDisclaimer:
      'ఈ గణాంకాలు సగటు లావాదేవీ విలువ ఆధారంగా చేసిన అంచనాలు మాత్రమే. వాస్తవ బ్యాంక్ సెటిల్మెంట్ ఛార్జీలు మరియు GST నిబంధనలపై ఆధారపడి ఉంటాయి.',

    // Comparison Table
    tableTitle: 'అధికారిక నిబంధనల ప్రకారం ఉదాహరణల పట్టిక',
    tableSubtitle: 'వివిధ లావాదేవీ మొత్తాలకు కస్టమర్ ఛార్జ్ మరియు వ్యాపారి MDR ఎలా ఉంటాయో చూడండి.',
    colPaymentType: 'లావాదేవీ రకం',
    colAmount: 'మొత్తం',
    colCustomerPays: 'కస్టమర్ చెల్లింపు',
    colCustomerCharge: 'కస్టమర్ ఛార్జ్',
    colMdrRate: 'MDR రేటు',
    colMerchantMdr: 'వ్యాపారి MDR',
    colMerchantNet: 'వ్యాపారికి అందేది',

    // What is MDR
    whatIsMdrTitle: 'UPI MDR అంటే ఏమిటి? (పూర్తి వివరాలు)',
    whatIsMdrSubtitle: 'కస్టమర్లు మరియు చిన్న వ్యాపారులకు అర్థమయ్యే సరళమైన వివరణ.',
    p2pDefTitle: '1. వ్యక్తి నుండి వ్యక్తికి (P2P) అంటే ఏమిటి?',
    p2pDefBody:
      'మీరు మీ మిత్రులకు, కుటుంబ సభ్యులకు లేదా తెలిసిన వ్యక్తులకు వారి మొబైల్ నంబర్ లేదా వ్యక్తిగత క్యూఆర్ కోడ్ ద్వారా నేరుగా బ్యాంక్ ఖాతాకు పంపే నగదు బదిలీ. P2P బదిలీలు పంపేవారికి మరియు స్వీకరించేవారికి పూర్తిగా ఉచితం (0% ఛార్జీలు).',
    p2mDefTitle: '2. వ్యాపారికి చెల్లింపు (P2M) అంటే ఏమిటి?',
    p2mDefBody:
      'దుకాణాలు, కిరాణా షాపులు, సూపర్ మార్కెట్లు, హోటళ్లు లేదా ఆన్‌లైన్ స్టోర్లలో వ్యాపారి క్యూఆర్ కోడ్ స్కాన్ చేసి లేదా మర్చంట్ UPI ID ద్వారా జరిపే చెల్లింపులు. ఇవి వ్యాపార బ్యాంకింగ్ వ్యవస్థ ద్వారా ప్రాసెస్ చేయబడతాయి.',
    mdrDefTitle: '3. మర్చంట్ డిస్కౌంట్ రేట్ (MDR) అంటే ఏమిటి?',
    mdrDefBody:
      'MDR అంటే వ్యాపారి డిజిటల్ చెల్లింపును స్వీకరించినప్పుడు, వర్తించే సందర్భాల్లో చెల్లింపు వ్యవస్థలో (బ్యాంకులు, గేట్‌వేలు, NPCI) నిర్వహణ కోసం విధించే రుసుము. ముఖ్యంగా: MDR అనేది వ్యాపారి వైపు రుసుము మాత్రమే, ఇది కస్టమర్ బిల్లుపై అదనపు ఛార్జ్ కాదు.',
    thresholdDefTitle: '4. ₹2,000 పరిమితి (Threshold) అంటే ఏమిటి?',
    thresholdDefBody:
      'నిబంధనల ప్రకారం, ₹2,000 వరకు జరిగే లావాదేవీలన్నింటికీ 100% మినహాయింపు (0% MDR) ఉంటుంది. దీనివల్ల నిత్యావసరాలు, కిరాణా, టీ, టిఫిన్ వంటి రోజువారీ చిన్న కొనుగోళ్లకు వ్యాపారులపై ఎటువంటి ఛార్జీ ఉండదు.',
    capDefTitle: '5. గరిష్ట MDR పరిమితి (MDR Cap) అంటే ఏమిటి?',
    capDefBody:
      'పెద్ద మొత్తంలో లావాదేవీ జరిగినప్పటికీ, వ్యాపారి ఒక లావాదేవీకి గరిష్టంగా ఎంత MDR చెల్లించవచ్చో ప్రభుత్వం పరిమితి (Cap) విధించింది (ఉదాహరణకు చిన్న వ్యాపారులకు గరిష్టంగా ₹15, సాధారణ వ్యాపారులకు ₹30). లావాదేవీ ఎంత పెద్దదైనా ఈ పరిమితి కంటే ఎక్కువ ఛార్జ్ ఉండదు.',

    // FAQs
    faqTitle: 'తరచుగా అడిగే ప్రశ్నలు (FAQs)',
    faqSubtitle: 'RBI, NPCI మరియు కేంద్ర ఆర్థిక మంత్రిత్వ శాఖ అధికారిక ఉత్తర్వుల ఆధారంగా సమాధానాలు.',

    // Privacy & Disclaimer
    privacyTitle: 'గోప్యత మరియు భద్రతా హామీ',
    privacyBody:
      'ఈ కాలిక్యులేటర్ పూర్తిగా మీ పరికరంలో మాత్రమే (ఆఫ్‌లైన్‌లో కూడా) పనిచేస్తుంది. మేము మీ UPI ID, ఫోన్ నంబర్, బ్యాంక్ ఖాతా నంబర్ లేదా బ్యాంక్ SMS వివరాలను సేకరించము లేదా సర్వర్‌కు పంపము. లాగిన్ అవసరం లేదు.',
    disclaimerTitle: 'అధికారిక నిరాకరణ (Disclaimer)',
    officialSourcesTitle: 'ధృవీకరించబడిన అధికారిక వనరులు',
    independenceNotice:
      'ఈ అప్లికేషన్ ఒక స్వతంత్ర సమాచార సాధనం. ఇది రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా (RBI), NPCI లేదా భారత ప్రభుత్వ అధికారిక అప్లికేషన్ కాదు మరియు వాటితో ఎటువంటి అనుబంధం లేదు.',
    installAppBtn: 'యాప్‌ను ఇన్‌స్టాల్ చేయండి',
    offlineActiveBadge: 'ఆఫ్‌లైన్‌లో సిద్ధంగా ఉంది',
  },
};

export const FAQ_DATA = [
  {
    id: 'faq_customer_free',
    questionEn: 'Is UPI free for customers?',
    questionTe: 'కస్టమర్లకు UPI ఉచితమా?',
    answerEn:
      'Yes, UPI is 100% free for customers. Customers do not pay any MDR or transaction fees when sending money to individuals or paying at merchant shops. The amount you see is the exact amount deducted from your bank account.',
    answerTe:
      'అవును, కస్టమర్లకు UPI 100% పూర్తిగా ఉచితం. వ్యక్తులకు డబ్బు పంపినప్పుడు లేదా దుకాణాల్లో వస్తువులు కొనుగోలు చేసినప్పుడు కస్టమర్ ఎలాంటి అదనపు రుసుము లేదా MDR చెల్లించాల్సిన అవసరం లేదు.',
  },
  {
    id: 'faq_what_is_mdr',
    questionEn: 'What is UPI MDR?',
    questionTe: 'UPI MDR అంటే ఏమిటి?',
    answerEn:
      'MDR stands for Merchant Discount Rate. It is the service charge applicable to the merchant’s acquiring ecosystem for processing digital payments. It is handled on the merchant settlement side, not charged to the paying customer.',
    answerTe:
      'MDR అంటే మర్చంట్ డిస్కౌంట్ రేట్ (Merchant Discount Rate). వ్యాపారి డిజిటల్ చెల్లింపును స్వీకరించినప్పుడు, చెల్లింపు వ్యవస్థ నిర్వహణ కోసం వ్యాపారి ఖాతా నుండి మినహాయించే రుసుము.',
  },
  {
    id: 'faq_who_pays_mdr',
    questionEn: 'Who pays MDR?',
    questionTe: 'MDR ఎవరు చెల్లిస్తారు?',
    answerEn:
      'MDR is borne by the merchant where applicable. It is deducted from the merchant’s payout during settlement by the acquiring bank or payment service provider. The customer never pays MDR.',
    answerTe:
      'వర్తించే సందర్భాల్లో MDR ను వ్యాపారి మాత్రమే చెల్లిస్తారు. బ్యాంక్ లేదా పేమెంట్ సంస్థ వ్యాపారి ఖాతాలో డబ్బు జమ చేసేటప్పుడు ఈ మొత్తాన్ని సర్దుబాటు చేస్తుంది. కస్టమర్ దీనిని చెల్లించరు.',
  },
  {
    id: 'faq_p2p_mdr',
    questionEn: 'Is MDR applicable to P2P transactions?',
    questionTe: 'వ్యక్తుల మధ్య బదిలీలకు (P2P) MDR వర్తిస్తుందా?',
    answerEn:
      'No. Person-to-Person (P2P) transactions between family, friends, or individuals carry zero MDR and zero charges under all RBI/NPCI guidelines.',
    answerTe:
      'లేదు. వ్యక్తుల మధ్య జరిగే (P2P) లావాదేవీలకు ఎటువంటి MDR వర్తించదు. ఇది ఎల్లప్పుడూ ఉచితం.',
  },
  {
    id: 'faq_what_is_p2p',
    questionEn: 'What is P2P?',
    questionTe: 'P2P అంటే ఏమిటి?',
    answerEn:
      'P2P means Person to Person. It refers to direct transfers from your personal bank account to another individual’s bank account using a phone number or personal UPI ID.',
    answerTe:
      'P2P అంటే పర్సన్ టు పర్సన్ (వ్యక్తి నుండి వ్యక్తికి). మీ వ్యక్తిగత బ్యాంక్ ఖాతా నుండి స్నేహితులు లేదా బంధువుల వ్యక్తిగత ఖాతాకు నేరుగా పంపే డబ్బు.',
  },
  {
    id: 'faq_what_is_p2m',
    questionEn: 'What is P2M?',
    questionTe: 'P2M అంటే ఏమిటి?',
    answerEn:
      'P2M means Person to Merchant. It refers to payments made to commercial shopkeepers, merchants, utility providers, or businesses by scanning a merchant QR code.',
    answerTe:
      'P2M అంటే పర్సన్ టు మర్చంట్ (వ్యాపారికి చెల్లింపు). దుకాణాల్లో, సూపర్ మార్కెట్లలో లేదా సర్వీస్ సెంటర్లలో వ్యాపారి క్యూఆర్ కోడ్ స్కాన్ చేసి చేసే వాణిజ్య చెల్లింపు.',
  },
  {
    id: 'faq_every_merchant',
    questionEn: 'Does MDR apply to every merchant payment?',
    questionTe: 'ప్రతి వ్యాపారి చెల్లింపుపై MDR వర్తిస్తుందా?',
    answerEn:
      'No. Transactions up to ₹2,000 are completely exempt (0% MDR). Furthermore, under current rules (until 14 October 2026), standard account-to-account UPI has 0% MDR under the zero-MDR mandate.',
    answerTe:
      'లేదు. ₹2,000 లోపు ఉండే లావాదేవీలన్నింటికీ 0% MDR (పూర్తి మినహాయింపు). అలాగే ప్రస్తుత మార్గదర్శకాల ప్రకారం ప్రామాణిక బ్యాంక్-టు-బ్యాంక్ UPI పై 0% MDR ఉంది.',
  },
  {
    id: 'faq_above_2000',
    questionEn: 'What happens when my payment is above ₹2,000?',
    questionTe: 'చెల్లింపు మొత్తం ₹2,000 దాటితే ఏమవుతుంది?',
    answerEn:
      'Under the newly announced framework (effective 15 October 2026), transactions above ₹2,000 are subject to tiered MDR rates (0.30% for small merchants up to a ₹15 cap, 0.65% for regular merchants up to a ₹30 cap). The customer still pays ₹0 extra.',
    answerTe:
      'కొత్త నిబంధనల ప్రకారం (15 అక్టోబర్ 2026 నుండి), ₹2,000 దాటినప్పుడు చిన్న వ్యాపారులకు 0.30% (గరిష్టంగా ₹15), సాధారణ వ్యాపారులకు 0.65% (గరిష్టంగా ₹30) వర్తిస్తుంది. కస్టమర్‌కు ఇప్పటికీ ఎటువంటి అదనపు ఛార్జ్ ఉండదు.',
  },
  {
    id: 'faq_small_exempt',
    questionEn: 'Are small merchants exempt?',
    questionTe: 'చిన్న వ్యాపారులకు మినహాయింపు ఉందా?',
    answerEn:
      'Yes. Small merchants with turnover under ₹20 Lakhs enjoy 0% MDR for all transactions up to ₹2,000, and a subsidized low cap of ₹15 even on larger transactions under the upcoming framework.',
    answerTe:
      'అవును. వార్షిక టర్నోవర్ ₹20 లక్షల లోపు ఉండే చిన్న వ్యాపారులకు ₹2,000 వరకు 0% MDR ఉంటుంది. ₹2,000 దాటినా గరిష్టంగా ₹15 మాత్రమే పరిమితి ఉంటుంది.',
  },
  {
    id: 'faq_customer_pay_mdr',
    questionEn: 'Does the customer have to pay MDR?',
    questionTe: 'కస్టమర్ ఎప్పుడైనా MDR చెల్లించాలా?',
    answerEn:
      'Never. No official rule requires consumers to pay MDR. Asking customers for extra fees when paying via UPI is strictly prohibited.',
    answerTe:
      'ఎప్పుడూ చెల్లించకూడదు. వినియోగదారులు MDR చెల్లించాలని ఎటువంటి నిబంధన లేదు. UPI ద్వారా చెల్లించినందుకు కస్టమర్ల నుండి అదనపు ఛార్జీలు వసూలు చేయడం నిబంధనలకు విరుద్ధం.',
  },
  {
    id: 'faq_max_mdr',
    questionEn: 'What is the maximum MDR cap?',
    questionTe: 'గరిష్ట MDR పరిమితి ఎంత?',
    answerEn:
      'Depending on the category, maximum MDR caps are ₹15 (small merchants & essential utilities), ₹30 (regular retail), and ₹45 (large enterprises). Regardless of amount (e.g. ₹50,000 or ₹1,00,000), the fee cannot exceed the cap.',
    answerTe:
      'వ్యాపారి వర్గాన్ని బట్టి గరిష్ట పరిమితి చిన్న వ్యాపారులకు ₹15, సాధారణ వ్యాపారులకు ₹30, పెద్ద సంస్థలకు ₹45. లావాదేవీ మొత్తం ఎంత పెద్దదైనా ఈ పరిమితి దాటి వసూలు చేయలేరు.',
  },
  {
    id: 'faq_effective_date',
    questionEn: 'When do the latest MDR rules become effective?',
    questionTe: 'తాజా MDR నిబంధనలు ఎప్పటి నుండి అమల్లోకి వస్తాయి?',
    answerEn:
      'The announced revised framework is scheduled to take effect from 15 October 2026. Prior to this date, the zero-MDR directive remains active.',
    answerTe:
      'ప్రకటించబడిన నూతన నిబంధనలు 15 అక్టోబర్ 2026 నుండి అమల్లోకి రానున్నాయి. ఆ తేదీ వరకు ప్రస్తుత 0% నిబంధనలే కొనసాగుతాయి.',
  },
  {
    id: 'faq_future_changes',
    questionEn: 'Can UPI rules change in the future?',
    questionTe: 'భవిష్యత్తులో UPI నిబంధనలు మారవచ్చా?',
    answerEn:
      'Yes. UPI rules are governed by the Reserve Bank of India (RBI), Ministry of Finance, and NPCI. Whenever new circulars are released, this calculator’s centralized rules engine is updated accordingly.',
    answerTe:
      'అవును. UPI నిబంధనలను RBI, ఆర్థిక మంత్రిత్వ శాఖ మరియు NPCI సమీక్షిస్తుంటాయి. ప్రభుత్వం నుండి అధికారిక సర్క్యులర్ వచ్చిన వెంటనే ఈ కాలిక్యులేటర్‌లోని నిబంధనలు నవీకరించబడతాయి.',
  },
];
