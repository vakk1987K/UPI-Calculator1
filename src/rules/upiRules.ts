/**
 * Verified Regulatory Configuration for UPI
 * Sourced directly from official documentation:
 * 1. Reserve Bank of India (RBI) Notification: Prohibition of MDR on UPI & RuPay (Section 10A PSS Act, Circular DPSS.CO.PD No.1164/02.14.003/2019-20)
 * 2. NPCI Official UPI Circulars (https://www.npci.org.in/what-we-do/upi/circulars)
 * 3. NPCI FAQs on PPI-on-UPI Charges (March 2023 Circular)
 * 4. NPCI Operating Circular on RuPay Credit Card on UPI (Operating Circular No. NPCI/2022-23/RuPay/001)
 *
 * Current Regulatory Verification: 2026 Active Framework
 */

import {
  PaymentInstrument,
  RegulatoryFrameworkMeta,
} from '../types/upi';

export const UPI_REGULATORY_META = {
  lastUpdated: '2 October 2026',
  lastUpdatedTe: '2 అక్టోబర్ 2026',
  sources: 'Reserve Bank of India (RBI) / National Payments Corporation of India (NPCI) / Ministry of Finance (DFS)',
  sourcesTe: 'భారత రిజర్వ్ బ్యాంక్ (RBI) / NPCI / ఆర్థిక మంత్రిత్వ శాఖ (DFS)',
  educationalDisclaimerEn:
    'This calculator is an independent simulation and educational tool based on published RBI and NPCI notifications. Bank-account UPI operates under a statutory zero-MDR directive (Section 10A PSS Act). For PPI wallets and RuPay credit cards, interchange and commercial merchant charges depend on acquiring bank agreements.',
  educationalDisclaimerTe:
    'ఈ కాలిక్యులేటర్ RBI మరియు NPCI అధికారిక నిబంధనల ఆధారంగా రూపొందించబడిన స్వతంత్ర విద్యా సాధనం. బ్యాంక్ ఖాతా UPI కి చట్టబద్ధంగా 0% MDR వర్తిస్తుంది. వాలెట్లు మరియు రూపే క్రెడిట్ కార్డులకు సంబంధించి వాస్తవ ఛార్జీలు బ్యాంక్ ఒప్పందాలపై ఆధారపడి ఉంటాయి.',
  disclaimerEn:
    'Independent educational calculator. Bank Account UPI is legally 0% MDR under Section 10A PSS Act. Wallet & RuPay CC charges depend on acquiring arrangements.',
  disclaimerTe:
    'బ్యాంక్ ఖాతా UPI కి సెక్షన్ 10A PSS చట్టం ప్రకారం 0% MDR వర్తిస్తుంది.',
  independentStatementEn:
    'This is an independent educational tool and is not an official tool of RBI, NPCI or the Government of India.',
  independentStatementTe:
    'ఇది ఒక స్వతంత్ర విద్యా సాధనం మరియు RBI, NPCI లేదా భారత ప్రభుత్వ అధికారిక సాధనం కాదు.',
  officialLinks: [
    {
      label: 'RBI Notification: Section 10A PSS Act (Zero MDR on UPI)',
      url: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11776&Mode=0',
    },
    {
      label: 'NPCI UPI Official Circulars',
      url: 'https://www.npci.org.in/what-we-do/upi/circulars',
    },
    {
      label: 'NPCI UPI FAQs (PPI-on-UPI Charges & Zero Customer Fee)',
      url: 'https://www.npci.org.in/what-we-do/upi/faqs',
    },
    {
      label: 'NPCI RuPay Credit Card on UPI Operating Circular',
      url: 'https://www.npci.org.in/what-we-do/rupay/rupay-credit-card-on-upi',
    },
  ],
};

export const REGULATORY_FRAMEWORKS: Record<PaymentInstrument, RegulatoryFrameworkMeta> = {
  bank_account: {
    instrument: 'bank_account',
    titleEn: 'Bank Account UPI (Standard Bank-to-Bank)',
    titleTe: 'బ్యాంక్ ఖాతా UPI (ప్రామాణికం)',
    regulatoryStatusEn: 'Active Statutory Zero-MDR Framework (Section 10A PSS Act)',
    regulatoryStatusTe: 'చట్టబద్ధమైన జీరో-MDR విధానం (సెక్షన్ 10A PSS చట్టం)',
    customerChargeEn: '₹0 (Zero fee / Surcharge strictly prohibited by law)',
    customerChargeTe: '₹0 (కస్టమర్‌పై ఎటువంటి ఛార్జీ ఉండదు)',
    merchantMdrEn: '0% (Nil MDR legally mandated across all transaction amounts)',
    merchantMdrTe: '0% MDR (వ్యాపారికి ఎటువంటి కోత ఉండదు - 100% ఉచితం)',
    acquirerCommercialNoteEn:
      'Under Government of India and RBI directives (Section 10A of the Payment and Settlement Systems Act), no MDR can be collected from merchants or users for standard bank-account UPI transactions at any amount. Merchant receives 100% settlement.',
    acquirerCommercialNoteTe:
      'భారత ప్రభుత్వం మరియు RBI నిబంధనల ప్రకారం (సెక్షన్ 10A PSS చట్టం), ప్రామాణిక బ్యాంక్ UPI లావాదేవీలపై వ్యాపారుల నుండి లేదా కస్టమర్ల నుండి ఎటువంటి MDR వసూలు చేయడం చట్టరీత్యా నిషేధం.',
    officialSource: 'RBI Notification DPSS.CO.PD No.1164/02.14.003/2019-20 (Section 10A PSS Act)',
    officialSourceUrl: 'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11776&Mode=0',
  },

  ppi_wallet: {
    instrument: 'ppi_wallet',
    titleEn: 'Prepaid Wallet / PPI on UPI QR (Paytm/PhonePe Wallet)',
    titleTe: 'ప్రిపేడ్ వాలెట్ / PPI UPI',
    regulatoryStatusEn: 'NPCI PPI Interchange Framework (March 2023 Circular)',
    regulatoryStatusTe: 'NPCI PPI ఇంటర్‌ఛేంజ్ నిబంధనలు',
    customerChargeEn: '₹0 (Customers pay NO extra convenience charge for wallet UPI)',
    customerChargeTe: '₹0 (వాలెట్ వినియోగదారులకు ఎటువంటి అదనపు రుసుము ఉండదు)',
    merchantMdrEn:
      '≤ ₹2,000 & Small Vendors: Nil (0%) | > ₹2,000: Up to 1.10% ecosystem interchange (Acquirer-to-Issuer)',
    merchantMdrTe:
      '₹2,000 వరకు ఉచితం | ₹2,000 దాటితే 1.10% వరకు ఇంటర్‌ఛేంజ్',
    acquirerCommercialNoteEn:
      'Interchange is an inter-provider ecosystem fee paid by the acquirer to the wallet issuer. The merchant’s actual settlement deduction is not a fixed government deduction, but is governed by their commercial agreement with their acquiring bank/payment aggregator (e.g. blended pricing model).',
    acquirerCommercialNoteTe:
      'ఇంటర్‌ఛేంజ్ అనేది బ్యాంకులు/వాలెట్ల మధ్య వర్తించే అంతర్గత రుసుము. వ్యాపారికి వర్తించే వాస్తవ ఛార్జీలు వారి పేమెంట్ గేట్‌వే ఒప్పందంపై ఆధారపడి ఉంటాయి.',
    officialSource: 'NPCI Operating Circular on PPI Interchange on UPI',
    officialSourceUrl: 'https://www.npci.org.in/what-we-do/upi/circulars',
  },

  rupay_credit_card: {
    instrument: 'rupay_credit_card',
    titleEn: 'RuPay Credit Card on UPI',
    titleTe: 'రూపే క్రెడిట్ కార్డ్ UPI (RuPay CC)',
    regulatoryStatusEn: 'NPCI RuPay Credit Card on UPI Operating Circular',
    regulatoryStatusTe: 'NPCI రూపే క్రెడిట్ కార్డ్ UPI మార్గదర్శకాలు',
    customerChargeEn: '₹0 (Customer surcharge strictly prohibited on UPI)',
    customerChargeTe: '₹0 (కస్టమర్‌పై ఎటువంటి సర్‌ఛార్జ్ ఉండదు)',
    merchantMdrEn:
      'Qualifying Small Offline Merchants (≤ ₹2,000): Mandated Nil MDR (0%) | Other: Commercial Acquirer Pricing',
    merchantMdrTe:
      'చిన్న ఆఫ్లైన్ వ్యాపారులకు (≤ ₹2,000): 0% Nil MDR | ఇతరులకు: బ్యాంక్ వాణిజ్య రేట్లు',
    acquirerCommercialNoteEn:
      'NPCI’s operating circular mandates Nil MDR strictly for qualifying small offline merchant transactions up to ₹2,000. For transactions exceeding ₹2,000 or at standard/online merchants, MDR is not a statutory universal 2%; it is determined by the merchant’s contract with their acquiring bank/payment provider.',
    acquirerCommercialNoteTe:
      'NPCI మార్గదర్శకాల ప్రకారం కేవలం చిన్న ఆఫ్లైన్ వ్యాపారులకు మాత్రమే ₹2,000 వరకు Nil MDR వర్తిస్తుంది. ఇతర లావాదేవీలకు వర్తించే రేట్లు వ్యాపారి బ్యాంక్ ఒప్పందంపై ఆధారపడి ఉంటాయి.',
    officialSource: 'NPCI RuPay Credit Card on UPI Operating Circular',
    officialSourceUrl: 'https://www.npci.org.in/what-we-do/rupay/rupay-credit-card-on-upi',
  },
};
