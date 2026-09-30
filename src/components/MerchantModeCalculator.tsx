import React, { useState } from 'react';
import { Store, TrendingDown, Calendar, AlertTriangle, Layers } from 'lucide-react';
import { MerchantCategoryKey, SupportedLanguage } from '../types/upi';
import { MERCHANT_CATEGORIES } from '../rules/upiRules';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateMerchantProjections } from '../calculator/calculateMdr';
import { cleanNumericInput, formatINR, formatPercent } from '../utils/formatters';

interface MerchantModeCalculatorProps {
  lang: SupportedLanguage;
  evaluationDate?: string;
}

export const MerchantModeCalculator: React.FC<MerchantModeCalculatorProps> = ({
  lang,
  evaluationDate,
}) => {
  const t = TRANSLATIONS[lang];

  const [avgTicket, setAvgTicket] = useState<number>(3500);
  const [dailyTx, setDailyTx] = useState<number>(25);
  const [businessDays, setBusinessDays] = useState<number>(26);
  const [category, setCategory] = useState<MerchantCategoryKey>('small_merchant');

  const projection = calculateMerchantProjections({
    averageAmount: avgTicket,
    dailyTransactions: dailyTx,
    businessDaysPerMonth: businessDays,
    merchantCategory: category,
    evaluationDate,
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-100 mb-6">
        <div className="rounded-2xl bg-emerald-600 p-2.5 text-white shrink-0 shadow-xs">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t.merchantModeTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {t.merchantModeSubtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Average Ticket Size */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.fieldAvgTicket}
            </label>
            <div className="relative rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600 bg-slate-50/50">
              <span className="absolute left-3.5 top-3 text-slate-500 font-bold">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={avgTicket === 0 ? '' : avgTicket}
                onChange={(e) => setAvgTicket(cleanNumericInput(e.target.value))}
                className="w-full py-2.5 pl-8 pr-4 text-base font-bold text-slate-900 bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Daily Transactions */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.fieldDailyTx}
            </label>
            <input
              type="number"
              min="1"
              value={dailyTx === 0 ? '' : dailyTx}
              onChange={(e) => setDailyTx(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="w-full rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600 bg-slate-50/50 px-4 py-2.5 text-base font-bold text-slate-900 outline-none"
            />
          </div>

          {/* Business Days */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.fieldBusinessDays}
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={businessDays === 0 ? '' : businessDays}
              onChange={(e) =>
                setBusinessDays(Math.min(31, Math.max(0, parseInt(e.target.value, 10) || 0)))
              }
              className="w-full rounded-2xl border-2 border-slate-200 focus-within:border-emerald-600 bg-slate-50/50 px-4 py-2.5 text-base font-bold text-slate-900 outline-none"
            />
          </div>

          {/* Merchant Category */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              {t.fieldCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MerchantCategoryKey)}
              className="w-full rounded-2xl border-2 border-slate-200 focus:border-emerald-600 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {MERCHANT_CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {lang === 'te' ? cat.labelTe : cat.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Projection Results */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/20 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'te' ? 'నెలవారీ అంచనా ఫలితాలు' : 'Monthly Projections'}
            </span>
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
              {lang === 'te' ? 'అంచనాలు మాత్రమే' : 'Estimates Only'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sales Volume */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t.labelMonthlySales}
              </span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {formatINR(projection.monthlySalesVolume)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {projection.monthlyTransactions.toLocaleString('en-IN')}{' '}
                {lang === 'te' ? 'లావాదేవీలు' : 'transactions'}
              </span>
            </div>

            {/* Estimated Monthly MDR */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-amber-900 block">
                {t.labelEstimatedMonthlyMdr}
              </span>
              <span className="text-lg font-black text-amber-950 block mt-0.5">
                {formatINR(projection.estimatedMonthlyMdr, true)}
              </span>
              <span className="text-[10px] text-amber-800 font-medium">
                ~{formatINR(projection.estimatedMdrPerTransaction, true)}{' '}
                {lang === 'te' ? 'ఒక లావాదేవీకి' : 'per transaction'}
              </span>
            </div>

            {/* Estimated Annual MDR */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t.labelEstimatedAnnualMdr}
              </span>
              <span className="text-lg font-black text-slate-900 block mt-0.5">
                {formatINR(projection.estimatedAnnualMdr, true)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {lang === 'te' ? '12 నెలల మొత్తం అంచనా' : 'Annualised estimate'}
              </span>
            </div>

            {/* Net Monthly Settlement */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-900 block">
                {t.labelEstimatedNetMonthlySettlement}
              </span>
              <span className="text-lg font-black text-emerald-950 block mt-0.5">
                {formatINR(projection.estimatedNetMonthlySettlement, true)}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {lang === 'te' ? 'బ్యాంక్ ఖాతాలో జమ అయ్యేది' : 'Net merchant bank credit'}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 pt-2 text-[11px] text-slate-500 leading-snug">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>{t.merchantEstimateDisclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
