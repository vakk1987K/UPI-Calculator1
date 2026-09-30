import React from 'react';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { formatINR } from '../utils/formatters';

interface ThresholdExplainerCardProps {
  lang: SupportedLanguage;
  onSelectAmount: (amount: number) => void;
}

export const ThresholdExplainerCard: React.FC<ThresholdExplainerCardProps> = ({
  lang,
  onSelectAmount,
}) => {
  return (
    <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-sky-50/70 to-emerald-50/60 p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-xs shadow-xs">
              ₹
            </span>
            <h2 className="text-lg sm:text-xl font-black text-indigo-950 tracking-tight">
              {lang === 'te'
                ? '₹2,000 నిబంధన: ₹2,000 లోపు మరియు ₹2,000 దాటితే ఛార్జీలు ఏమిటి?'
                : 'The ₹2,000 Rule: Charges for ₹2,000 vs. Above ₹2,000'}
            </h2>
          </div>
          <p className="mt-1 text-xs text-indigo-900/80 font-medium">
            {lang === 'te'
              ? 'RBI మరియు NPCI అధికారిక మార్గదర్శకాల ప్రకారం పూర్తి వివరాలు'
              : 'Official RBI & NPCI framework breakdown for customers and merchants'}
          </p>
        </div>

        {/* Quick Test Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectAmount(2000)}
            className="rounded-lg border border-indigo-300 bg-white px-2.5 py-1 text-xs font-bold text-indigo-800 hover:bg-indigo-50 transition shadow-2xs"
          >
            {lang === 'te' ? '₹2,000 (0% ఫీజు)' : 'Test ₹2,000 (Free)'}
          </button>
          <button
            type="button"
            onClick={() => onSelectAmount(2005)}
            className="rounded-lg border border-emerald-300 bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-2xs"
          >
            {lang === 'te' ? '₹2,005 (> ₹2,000)' : 'Test ₹2,005 (> ₹2k)'}
          </button>
          <button
            type="button"
            onClick={() => onSelectAmount(5000)}
            className="rounded-lg border border-blue-300 bg-blue-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-800 transition shadow-2xs"
          >
            {lang === 'te' ? '₹5,000 (గరిష్ట పరిమితి)' : 'Test ₹5,000 (Cap)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: At or Below ₹2,000 */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-4.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-900 border border-emerald-200">
              {lang === 'te' ? '₹2,000 లేదా అంతకంటే తక్కువ' : 'At or Below ₹2,000 (≤ ₹2,000)'}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Free
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'కస్టమర్ చెల్లింపు / ఛార్జ్:' : 'Customer Charge:'}
              </span>
              <span className="font-bold text-emerald-700">₹0 (Free / ఉచితం)</span>
            </div>
            <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'వ్యాపారి MDR రేటు:' : 'Merchant MDR Rate:'}
              </span>
              <span className="font-bold text-emerald-700">0% (100% Exempt)</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'వ్యాపారికి అందేది:' : 'Merchant Receives:'}
              </span>
              <span className="font-bold text-slate-900">100% of amount (పూర్తి మొత్తం)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-normal bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
            {lang === 'te'
              ? 'కిరాణా, టీ, కూరగాయలు, నిత్యావసరాల వంటి రోజువారీ చిన్న లావాదేవీలకు బ్యాంక్ ఖాతా లేదా వాలెట్ ఏది వాడినా వ్యాపారికి లేదా కస్టమర్‌కు 0% ఛార్జీ ఉంటుంది.'
              : 'For all daily micro-transactions (milk, groceries, food), zero MDR applies across all merchants and payment modes.'}
          </p>
        </div>

        {/* Box 2: Above ₹2,000 */}
        <div className="rounded-2xl border border-indigo-200 bg-white p-4.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-extrabold text-indigo-900 border border-indigo-200">
              {lang === 'te' ? '₹2,000 కంటే ఎక్కువ (> ₹2,000)' : 'Above ₹2,000 (> ₹2,000)'}
            </span>
            <span className="text-xs font-bold text-blue-700">
              {lang === 'te' ? 'రాయితీ MDR వర్తిస్తుంది' : 'Tiered Merchant MDR'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'కస్టమర్ చెల్లింపు / ఛార్జ్:' : 'Customer Charge:'}
              </span>
              <span className="font-bold text-emerald-700">
                ₹0 (Always Free / కస్టమర్‌కు ఉచితం)
              </span>
            </div>
            <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'బ్యాంక్ ఖాతా UPI (15 Oct):' : 'Bank UPI (from 15 Oct):'}
              </span>
              <span className="font-bold text-indigo-900">
                0.30% - 0.65% (Cap: ₹15 - ₹30)
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">
                {lang === 'te' ? 'వాలెట్/PPI UPI (NPCI):' : 'Wallet/PPI (NPCI rule):'}
              </span>
              <span className="font-bold text-amber-900">
                0.50% - 1.1% (వ్యాపారి వైపు)
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-normal bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            {lang === 'te'
              ? 'ముఖ్య గమనిక: చెల్లింపు ₹2,000 దాటినా కస్టమర్ ఎప్పుడూ ₹0 ఛార్జ్ మాత్రమే చెల్లిస్తారు. MDR ఛార్జీ కేవలం వ్యాపారి వైపు మాత్రమే వర్తిస్తుంది మరియు దానికి గరిష్ట పరిమితులు (Caps) ఉంటాయి.'
              : 'Crucial: Even above ₹2,000, paying customers NEVER pay an extra fee. MDR is strictly borne by the merchant ecosystem with regulatory caps.'}
          </p>
        </div>
      </div>
    </div>
  );
};
