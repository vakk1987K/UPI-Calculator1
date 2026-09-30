import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';
import { UPI_REGULATORY_META } from '../rules/upiRules';

interface FooterProps {
  lang: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {lang === 'te' ? t.appTeluguName : t.appTitle}
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                PWA v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {lang === 'te'
                ? 'భారతదేశ వ్యాపారులు మరియు కస్టమర్ల కోసం స్వతంత్ర UPI MDR కాలిక్యులేటర్'
                : 'Free public utility calculator for Indian consumers and merchants'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.offlineActiveBadge}
            </span>
            <span>
              <strong>{t.lastUpdatedLabel}:</strong>{' '}
              {lang === 'te' ? UPI_REGULATORY_META.lastUpdatedTe : UPI_REGULATORY_META.lastUpdated}
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          <p>
            {lang === 'te'
              ? 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ వ్యాపారస్తుల సౌలభ్యం కోసం రూపొందించబడింది.'
              : 'Built for Andhra Pradesh, Telangana & Indian merchants and consumers.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
