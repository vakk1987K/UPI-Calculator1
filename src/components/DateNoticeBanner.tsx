import React from 'react';
import { Calendar, Info, Clock, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';

interface DateNoticeBannerProps {
  lang: SupportedLanguage;
  isFuturePreview: boolean;
  onToggleFuturePreview: (preview: boolean) => void;
}

export const DateNoticeBanner: React.FC<DateNoticeBannerProps> = ({
  lang,
  isFuturePreview,
  onToggleFuturePreview,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-emerald-50/70 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Notice Details */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-xl bg-blue-600 p-2 text-white shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900 border border-blue-200">
                <Calendar className="w-3.5 h-3.5 text-blue-700" />
                {isFuturePreview ? t.scheduledFrameworkBadge : t.activeFrameworkBadge}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {isFuturePreview ? '(Effective 15 Oct 2026)' : '(Valid through 14 Oct 2026)'}
              </span>
            </div>

            <p className="mt-1.5 text-sm font-semibold text-slate-800">
              {isFuturePreview ? t.dateNoticeUpcoming : t.dateNoticeActive}
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              {lang === 'te'
                ? 'నేడు జరిగే లావాదేవీలకు ప్రస్తుత నిబంధనలు వర్తిస్తాయి. 15 అక్టోబర్ 2026 తర్వాత వర్తించే ఛార్జీలను ముందే తెలుసుకోవడానికి పక్కనే ఉన్న బటన్ ఉపయోగించండి.'
                : 'Transactions occurring today follow current zero-MDR rules. Switch between active and upcoming frameworks to preview upcoming changes.'}
            </p>
          </div>
        </div>

        {/* Right Side: Toggle button */}
        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={() => onToggleFuturePreview(!isFuturePreview)}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
              isFuturePreview
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            {isFuturePreview ? (
              <>
                <span>{t.activeRulesToday}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <Info className="w-3.5 h-3.5" />
                <span>{t.previewFutureRules}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
