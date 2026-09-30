import React from 'react';
import { HelpCircle, Users, Store, Percent, ShieldCheck, Tag } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';

interface WhatIsMdrProps {
  lang: SupportedLanguage;
}

export const WhatIsMdr: React.FC<WhatIsMdrProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
        <HelpCircle className="w-6 h-6 text-blue-700" />
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.whatIsMdrTitle}
          </h2>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
            {t.whatIsMdrSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* P2P Card */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4.5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-blue-950">
              {t.p2pDefTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t.p2pDefBody}
          </p>
        </div>

        {/* P2M Card */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4.5">
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-emerald-950">
              {t.p2mDefTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t.p2mDefBody}
          </p>
        </div>

        {/* MDR Card */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4.5 md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-950">
              {t.mdrDefTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {t.mdrDefBody}
          </p>
          <div className="mt-3 rounded-xl bg-white p-3 border border-amber-200/70 text-xs text-amber-900 font-semibold">
            {lang === 'te'
              ? 'ముఖ్య గమనిక: MDR అనేది కస్టమర్లపై అదనపు ఛార్జ్ కాదు. కస్టమర్ ఎల్లప్పుడూ ₹0 ఛార్జ్ తో ఉచితంగా చెల్లిస్తారు.'
              : 'Crucial Rule: MDR is NEVER passed on as an extra fee to the paying consumer. The customer always pays ₹0 extra.'}
          </div>
        </div>

        {/* Threshold Card */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-4.5">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-5 h-5 text-purple-700" />
            <h3 className="text-sm font-bold text-purple-950">
              {t.thresholdDefTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t.thresholdDefBody}
          </p>
        </div>

        {/* Cap Card */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4.5">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h3 className="text-sm font-bold text-teal-950">
              {t.capDefTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {t.capDefBody}
          </p>
        </div>
      </div>
    </div>
  );
};
