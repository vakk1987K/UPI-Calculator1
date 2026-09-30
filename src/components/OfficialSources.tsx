import React from 'react';
import { Landmark, Shield, FileCheck2, ExternalLink, Lock } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';
import { UPI_REGULATORY_META } from '../rules/upiRules';

interface OfficialSourcesProps {
  lang: SupportedLanguage;
}

interface SourceItem {
  nameEn: string;
  nameTe: string;
  authority: string;
  roleEn: string;
  roleTe: string;
  documentRefEn: string;
  documentRefTe: string;
}

const SOURCES: SourceItem[] = [
  {
    nameEn: 'Reserve Bank of India (RBI)',
    nameTe: 'భారత రిజర్వ్ బ్యాంక్ (RBI)',
    authority: 'Central Banking & Payment Regulator',
    roleEn: 'Issues overarching Payment & Settlement Systems circulars, MDR caps, and merchant classification directives.',
    roleTe: 'చెల్లింపు మరియు సెటిల్మెంట్ వ్యవస్థల నిబంధనలు, MDR పరిమితులు మరియు మార్గదర్శకాలను జారీ చేస్తుంది.',
    documentRefEn: 'Payment and Settlement Systems Act Notifications & Master Directions',
    documentRefTe: 'చెల్లింపు మరియు సెటిల్మెంట్ సిస్టమ్స్ చట్టం నోటిఫికేషన్లు',
  },
  {
    nameEn: 'National Payments Corporation of India (NPCI)',
    nameTe: 'నేషనల్ పేమెంట్స్ కార్పొరేషన్ ఆఫ్ ఇండియా (NPCI)',
    authority: 'UPI Umbrella Clearing & Operating Body',
    roleEn: 'Operates the Unified Payments Interface (UPI) network, interchange schedules, and operational member circulars.',
    roleTe: 'UPI నెట్‌వర్క్ నిర్వహణ, ఇంటర్‌ఛేంజ్ మరియు ఆపరేషనల్ సర్క్యులర్లను అమలు చేస్తుంది.',
    documentRefEn: 'UPI Product Operating Guidelines & Merchant Circulars',
    documentRefTe: 'UPI ఆపరేటింగ్ మార్గదర్శకాలు మరియు మర్చంట్ సర్క్యులర్లు',
  },
  {
    nameEn: 'Department of Financial Services (DFS) — Ministry of Finance',
    nameTe: 'ఆర్థిక సేవల విభాగం (DFS) — కేంద్ర ఆర్థిక మంత్రిత్వ శాఖ',
    authority: 'Government of India',
    roleEn: 'Mandates Section 10A PSS zero-MDR directives on digital payment modes and budgetary support mechanisms.',
    roleTe: 'డిజిటల్ చెల్లింపులపై జీరో-MDR విధానాలు మరియు ప్రభుత్వ ఆదేశాలను పర్యవేక్షిస్తుంది.',
    documentRefEn: 'Section 10A of Payment and Settlement Systems Act & Gazetted notifications',
    documentRefTe: 'PSS చట్టం సెక్షన్ 10A మరియు గెజిట్ నోటిఫికేషన్లు',
  },
  {
    nameEn: 'Press Information Bureau (PIB)',
    nameTe: 'ప్రెస్ ఇన్ఫర్మేషన్ బ్యూరో (PIB), భారత ప్రభుత్వం',
    authority: 'Official Communication Agency of Govt of India',
    roleEn: 'Releases official clarification statements confirming zero customer charges and digital transaction status.',
    roleTe: 'కస్టమర్లకు UPI ఉచితం అని ధృవీకరించే అధికారిక ప్రభుత్వ ప్రకటనలను విడుదల చేస్తుంది.',
    documentRefEn: 'PIB Fact Checks & Ministry Press Releases',
    documentRefTe: 'PIB అధికారిక ప్రకటనలు మరియు వాస్తవ నిర్ధారణలు',
  },
];

export const OfficialSources: React.FC<OfficialSourcesProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="space-y-6">
      {/* Official Sources Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
          <Landmark className="w-6 h-6 text-blue-700" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.officialSourcesTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
              {lang === 'te'
                ? 'ఈ కాలిక్యులేటర్ క్రింది అధికారిక నియంత్రణ సంస్థల తాజా ఉత్తర్వుల ఆధారంగా రూపొందించబడింది.'
                : 'Formulated strictly in compliance with official regulatory notifications.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SOURCES.map((src, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4.5 space-y-2 hover:bg-slate-50 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  {lang === 'te' ? src.nameTe : src.nameEn}
                </h3>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 shrink-0">
                  {src.authority}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {lang === 'te' ? src.roleTe : src.roleEn}
              </p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {lang === 'te' ? src.documentRefTe : src.documentRefEn}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Independence Disclaimer Banner */}
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-2.5">
            <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                {lang === 'te' ? 'స్వతంత్ర సమాచార ప్రకటన' : 'Independent Declaration'}
              </span>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                {lang === 'te'
                  ? UPI_REGULATORY_META.independentStatementTe
                  : UPI_REGULATORY_META.independentStatementEn}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Disclaimer Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Privacy Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              {t.privacyTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t.privacyBody}
          </p>
        </div>

        {/* Disclaimer Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              {t.disclaimerTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {lang === 'te'
              ? UPI_REGULATORY_META.disclaimerTe
              : UPI_REGULATORY_META.disclaimerEn}
          </p>
        </div>
      </div>
    </div>
  );
};
