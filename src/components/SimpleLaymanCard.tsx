import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  UserCheck,
  Receipt,
} from 'lucide-react';
import { CalculationResult, SupportedLanguage } from '../types/upi';
import { formatINR } from '../utils/formatters';

interface SimpleLaymanCardProps {
  result: CalculationResult;
  lang: SupportedLanguage;
}

export const SimpleLaymanCard: React.FC<SimpleLaymanCardProps> = ({ result, lang }) => {
  const isFree = !result.isMdrApplicable || result.estimatedMdr === 0;
  const isUnder2000 = result.amount <= 2000;

  return (
    <div className="rounded-3xl border-3 border-emerald-500/80 bg-white p-5 sm:p-7 shadow-xl overflow-hidden relative transition-all">
      {/* Friendly soundbox style top banner */}
      <div
        className={`-mx-5 -mt-5 sm:-mx-7 sm:-mt-7 p-4 sm:p-5 flex items-center justify-between text-white ${
          isFree
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700'
            : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="rounded-full bg-white/20 p-2 text-white">
            <Store className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
              {lang === 'te' ? 'షాపు యజమాని & కస్టమర్ కోసం' : 'For Shop Owners & Customers'}
            </span>
            <h3 className="text-base sm:text-xl font-black tracking-tight">
              {lang === 'te' ? 'సులభమైన లెక్క (Layman Summary)' : 'Simple Money Summary'}
            </h3>
          </div>
        </div>

        {isFree ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-extrabold backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            {lang === 'te' ? '₹0 ఫీజు (ఉచితం!)' : '100% Free!'}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-extrabold backdrop-blur-xs">
            <TrendingDown className="w-4 h-4 text-blue-200" />
            {lang === 'te' ? 'MDR ఛార్జ్ వర్తిస్తుంది' : 'MDR Fee Applies'}
          </span>
        )}
      </div>

      {/* Giant 4-Step Plain Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {/* Step 1: Customer Pays */}
        <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              1. {lang === 'te' ? 'కస్టమర్ ఇచ్చే మొత్తం' : 'Customer Paid'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              {formatINR(result.amount)}
            </span>
          </div>
          <span className="mt-2 text-xs font-semibold text-slate-500">
            {lang === 'te' ? 'కస్టమర్ స్కాన్ చేసిన మొత్తం' : 'Exact amount scanned/sent'}
          </span>
        </div>

        {/* Step 2: Customer Extra Fee */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-4 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 block">
              2. {lang === 'te' ? 'కస్టమర్ అదనంగా ఇచ్చేది' : 'Customer Extra Fee'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block mt-1">
              ₹0 (సున్నా)
            </span>
          </div>
          <span className="mt-2 text-xs font-bold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {lang === 'te' ? 'కస్టమర్‌కు 100% ఉచితం' : 'UPI is always free for customers'}
          </span>
        </div>

        {/* Step 3: Bank Cut Fee */}
        <div
          className={`rounded-2xl border-2 p-4 flex flex-col justify-between ${
            isFree
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-amber-300 bg-amber-50/80'
          }`}
        >
          <div>
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider block ${
                isFree ? 'text-emerald-800' : 'text-amber-900'
              }`}
            >
              3. {lang === 'te' ? 'UPI / బ్యాంక్ కట్ చేసుకునేది' : 'UPI / Bank Cut Fee'}
            </span>
            <span
              className={`text-2xl sm:text-3xl font-black block mt-1 ${
                isFree ? 'text-emerald-700' : 'text-amber-950'
              }`}
            >
              {isFree ? '₹0 (సున్నా)' : formatINR(result.estimatedMdr, true)}
            </span>
          </div>
          <span
            className={`mt-2 text-xs font-bold ${
              isFree ? 'text-emerald-800' : 'text-amber-900'
            }`}
          >
            {isUnder2000
              ? lang === 'te'
                ? '₹2,000 లోపు ఏమీ కట్ అవ్వదు!'
                : 'Zero fee cut below ₹2,000!'
              : lang === 'te'
              ? result.mdrCapApplied
                ? `గరిష్ట పరిమితి వర్తించింది (Cap: ${formatINR(result.mdrCapAmount || 0)})`
                : `${result.applicableMdrRatePercent}% మాత్రమే కట్`
              : result.mdrCapApplied
              ? `Max Cap Applied (${formatINR(result.mdrCapAmount || 0)})`
              : `${result.applicableMdrRatePercent}% fee cut`}
          </span>
        </div>

        {/* Step 4: Merchant Bank Credit */}
        <div className="rounded-2xl border-2 border-blue-400 bg-blue-50/90 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900 block">
              4. {lang === 'te' ? 'షాపు ఖాతాలో పడే డబ్బు' : 'Merchant Gets in Bank'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-blue-950 block mt-1">
              {formatINR(result.estimatedMerchantSettlement, true)}
            </span>
          </div>
          <span className="mt-2 text-xs font-bold text-blue-800">
            {lang === 'te' ? 'వ్యాపారి ఖాతాలో జమ అయ్యే మొత్తం' : 'Net credited to merchant'}
          </span>
        </div>
      </div>

      {/* Layman Conclusion Banner in Big Telugu & English */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border-2 ${
          isUnder2000
            ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
            : isFree
            ? 'border-teal-300 bg-teal-50 text-teal-950'
            : 'border-blue-300 bg-blue-50 text-blue-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`rounded-xl p-2 shrink-0 ${
              isUnder2000 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1 w-full">
            <h4 className="font-black text-sm sm:text-base leading-snug">
              {lang === 'te' ? (
                isUnder2000 ? (
                  <>✅ ₹2,000 లేదా అంతకంటే తక్కువ: రూపాయి కూడా కట్ అవ్వదు!</>
                ) : (
                  <>
                    ℹ️ ₹2,000 దాటినందున ({formatINR(result.amount)}): బ్యాంక్/UPI ఛార్జ్{' '}
                    <span className="underline decoration-amber-500 font-black text-amber-950">
                      {formatINR(result.estimatedMdr, true)}
                    </span>{' '}
                    కట్ అవుతుంది.
                  </>
                )
              ) : isUnder2000 ? (
                <>✅ ₹2,000 or Less: Not a single rupee is cut!</>
              ) : (
                <>
                  ℹ️ Above ₹2,000 ({formatINR(result.amount)}): Bank cuts{' '}
                  <span className="underline decoration-amber-500 font-black text-amber-950">
                    {formatINR(result.estimatedMdr, true)}
                  </span>
                  . Merchant gets{' '}
                  <span className="font-black text-blue-950">
                    {formatINR(result.estimatedMerchantSettlement, true)}
                  </span>
                  .
                </>
              )}
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
              {lang === 'te' ? (
                isUnder2000 ? (
                  <>
                    కస్టమర్ చెల్లించిన మొత్తం <strong>{formatINR(result.amount)}</strong> పూర్తిగా
                    షాపు యజమాని బ్యాంక్ ఖాతాలో పడుతుంది. కస్టమర్ ఎటువంటి అదనపు రుసుము
                    చెల్లించక్కర్లేదు, వ్యాపారిపై కూడా ఏ ఫీజు ఉండదు.
                  </>
                ) : (
                  <>
                    కస్టమర్ యథావిధిగా <strong>{formatINR(result.amount)}</strong> మాత్రమే చెల్లిస్తారు
                    (కస్టమర్ అదనంగా పైసా కూడా ఇవ్వక్కర్లేదు). వ్యాపారికి మాత్రమే{' '}
                    <strong>{formatINR(result.estimatedMdr, true)}</strong> MDR కట్ అయి, మిగిలిన{' '}
                    <strong>{formatINR(result.estimatedMerchantSettlement, true)}</strong> బ్యాంక్ ఖాతాలో జమ అవుతుంది.
                  </>
                )
              ) : isUnder2000 ? (
                <>
                  The full <strong>{formatINR(result.amount)}</strong> enters the merchant bank account
                  without any deduction. Customer pays zero extra, merchant pays zero fee.
                </>
              ) : (
                <>
                  Customer pays only the exact <strong>{formatINR(result.amount)}</strong> (no extra charge).
                  The fee of <strong>{formatINR(result.estimatedMdr, true)}</strong> ({result.applicableMdrRatePercent}%) is deducted on the merchant side, and the merchant receives{' '}
                  <strong>{formatINR(result.estimatedMerchantSettlement, true)}</strong>.
                </>
              )}
            </p>

            {/* Transparent Bill Receipt for amounts > ₹2,000 */}
            {!isUnder2000 && (
              <div className="mt-3 pt-3 border-t border-blue-200/80 space-y-1.5 text-xs">
                <span className="font-extrabold text-blue-950 uppercase tracking-wider text-[11px] block">
                  {lang === 'te' ? '📋 లావాదేవీ స్పష్టమైన రసీదు:' : '📋 Transaction Breakdown Receipt:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                  <div className="rounded-lg bg-white/80 p-2 border border-blue-200">
                    <span className="text-slate-500 block text-[11px]">
                      {lang === 'te' ? 'కస్టమర్ చెల్లించే మొత్తం:' : 'Customer Pays:'}
                    </span>
                    <span className="font-black text-slate-900 text-sm">{formatINR(result.amount)}</span>
                    <span className="text-[10px] text-emerald-700 block">
                      {lang === 'te' ? '(కస్టమర్‌కు ₹0 ఛార్జ్)' : '(Customer fee: ₹0)'}
                    </span>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-2 border border-amber-200">
                    <span className="text-amber-900 block text-[11px]">
                      {lang === 'te'
                        ? `బ్యాంక్ కట్ చేసే MDR (${result.applicableMdrRatePercent}%):`
                        : `Bank MDR Cut (${result.applicableMdrRatePercent}%):`}
                    </span>
                    <span className="font-black text-amber-950 text-sm">
                      {formatINR(result.estimatedMdr, true)}
                    </span>
                    <span className="text-[10px] text-amber-800 block">
                      {result.mdrCapApplied
                        ? lang === 'te'
                          ? `(గరిష్ట పరిమితి వర్తించింది: ${formatINR(result.mdrCapAmount || 0)})`
                          : `(Capped at ${formatINR(result.mdrCapAmount || 0)})`
                        : lang === 'te'
                        ? '(వ్యాపారి వైపు MDR)'
                        : '(Merchant side fee)'}
                    </span>
                  </div>

                  <div className="sm:col-span-2 rounded-lg bg-emerald-100 p-2.5 border border-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="text-emerald-900 block text-[11px] font-bold">
                        {lang === 'te' ? 'వ్యాపారి బ్యాంక్ ఖాతాలో పడే నికర మొత్తం:' : 'Net Credited to Merchant:'}
                      </span>
                      <span className="text-[10px] text-emerald-800">
                        {formatINR(result.amount)} - {formatINR(result.estimatedMdr, true)}
                      </span>
                    </div>
                    <span className="font-black text-emerald-950 text-lg">
                      {formatINR(result.estimatedMerchantSettlement, true)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
