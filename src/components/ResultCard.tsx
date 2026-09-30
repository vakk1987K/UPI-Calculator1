import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingDown,
  Info,
  Building2,
  Wallet,
} from 'lucide-react';
import { CalculationResult, SupportedLanguage } from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';
import { formatINR, formatPercent } from '../utils/formatters';

interface ResultCardProps {
  result: CalculationResult;
  lang: SupportedLanguage;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-md overflow-hidden relative">
      {/* Decorative top ribbon */}
      <div
        className={`absolute top-0 inset-x-0 h-2.5 ${
          result.isMdrApplicable
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-600'
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500'
        }`}
      />

      {/* Header: Title and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.resultHeading}
            </span>
            {result.transactionType === 'P2M' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {result.paymentInstrument === 'bank_account' ? (
                  <>
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span>Bank UPI</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-3 h-3 text-amber-600" />
                    <span>Wallet/PPI</span>
                  </>
                )}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
            {formatINR(result.amount)}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {result.amount <= 2000 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              ≤ ₹2,000 (0% MDR)
            </span>
          ) : result.isMdrApplicable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-900 border border-blue-200">
              <TrendingDown className="w-4 h-4 text-blue-700" />
              {t.resultStatusMdrApplicable}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {t.resultStatusNoMdr}
            </span>
          )}
        </div>
      </div>

      {/* Key Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-5">
        {/* Metric 1: Customer Pays */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <span className="text-xs font-semibold text-slate-500 block">
            {t.labelCustomerPays}
          </span>
          <span className="text-xl font-black text-slate-900 block mt-1">
            {formatINR(result.customerTotalPays)}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.customerZeroFeeBadge}
          </span>
        </div>

        {/* Metric 2: Customer UPI Charge */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <span className="text-xs font-semibold text-emerald-800 block">
            {t.labelCustomerCharge}
          </span>
          <span className="text-xl font-black text-emerald-900 block mt-1">
            ₹0
          </span>
          <span className="text-[11px] font-medium text-emerald-700 mt-1 block">
            {lang === 'te'
              ? 'కస్టమర్లకు ఎటువంటి అదనపు ఛార్జ్ ఉండదు'
              : 'Zero extra charge for customer'}
          </span>
        </div>

        {/* Metric 3: Applicable MDR Rate */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <span className="text-xs font-semibold text-slate-500 block">
            {t.labelApplicableRate}
          </span>
          <span className="text-xl font-black text-slate-900 block mt-1">
            {formatPercent(result.applicableMdrRatePercent)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {result.transactionType === 'P2P'
              ? 'P2P (100% Free)'
              : lang === 'te'
              ? result.merchantCategoryLabelTe || 'వ్యాపారి చెల్లింపు'
              : result.merchantCategoryLabelEn || 'Merchant Payment'}
          </span>
        </div>

        {/* Metric 4: Estimated Merchant MDR */}
        <div
          className={`rounded-2xl border p-4 ${
            result.isMdrApplicable
              ? 'border-amber-200 bg-amber-50/60'
              : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <span className="text-xs font-semibold text-slate-600 block">
            {t.labelEstimatedMdr}
          </span>
          <span
            className={`text-xl font-black block mt-1 ${
              result.isMdrApplicable ? 'text-amber-900' : 'text-slate-900'
            }`}
          >
            {formatINR(result.estimatedMdr, true)}
          </span>
          {result.mdrCapApplied && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-950 mt-1">
              <ShieldCheck className="w-3 h-3 text-amber-900" />
              {t.capAppliedBadge} ({formatINR(result.mdrCapAmount || 0)})
            </span>
          )}
        </div>

        {/* Metric 5: Estimated Merchant Settlement */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 block">
              {t.labelEstimatedSettlement}
            </span>
            <span className="text-[11px] font-semibold text-blue-700">
              {lang === 'te' ? 'వ్యాపారికి అందే మొత్తం' : 'Net to Merchant'}
            </span>
          </div>
          <span className="text-2xl font-black text-blue-950 block mt-1">
            {formatINR(result.estimatedMerchantSettlement, true)}
          </span>
          <span className="text-[11px] text-blue-800/80 block mt-1 font-medium">
            {lang === 'te'
              ? `లావాదేవీ మొత్తం (${formatINR(result.amount)}) - MDR (${formatINR(result.estimatedMdr, true)})`
              : `Total (${formatINR(result.amount)}) - MDR (${formatINR(result.estimatedMdr, true)})`}
          </span>
        </div>
      </div>

      {/* Explanation Box */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 space-y-2">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
            {lang === 'te' ? result.explanationTe : result.explanationEn}
          </p>
        </div>

        {/* Core MDR Notice */}
        <div className="pt-2 border-t border-slate-200/60 text-[11px] leading-relaxed text-slate-500 font-semibold italic">
          {t.coreMdrNotice}
        </div>
      </div>

      {/* Active Rule Source footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>
          <strong>Rule Source:</strong> {result.sourceNotice}
        </span>
        <span>
          <strong>Validity:</strong>{' '}
          {result.ruleEffectiveUntil
            ? `${result.ruleEffectiveFrom} to ${result.ruleEffectiveUntil}`
            : `From ${result.ruleEffectiveFrom}`}
        </span>
      </div>
    </div>
  );
};
