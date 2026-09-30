import React from 'react';
import { ShieldCheck, CalendarCheck, Globe } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';
import { UPI_REGULATORY_META } from '../rules/upiRules';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  lang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, onLanguageChange }) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-emerald-800 flex items-center justify-center shadow-md text-white font-black text-lg">
              <span className="tracking-tighter">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">
                  {lang === 'te' ? t.appTeluguName : t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Official Rules
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'te'
                  ? 'UPI MDR & మర్చంట్ సెటిల్మెంట్ కాలిక్యులేటర్'
                  : 'Official UPI MDR & Merchant Settlement Guide'}
              </p>
            </div>
          </div>

          {/* Actions: Install Button & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <PWAInstallButton lang={lang} />

            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  lang === 'en'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('te')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                  lang === 'te'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>

        {/* Sub-header meta bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-1.5 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>
              <strong>{t.lastUpdatedLabel}:</strong>{' '}
              {lang === 'te' ? UPI_REGULATORY_META.lastUpdatedTe : UPI_REGULATORY_META.lastUpdated}
            </span>
          </div>
          <div className="flex items-center gap-1.5 truncate max-w-md">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              <strong>{t.sourcesLabel}:</strong>{' '}
              {lang === 'te' ? UPI_REGULATORY_META.sourcesTe : UPI_REGULATORY_META.sources}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
