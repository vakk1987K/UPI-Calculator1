import React, { useState } from 'react';
import { User, Store, ChevronDown, ChevronUp, RotateCcw, Building2, Wallet } from 'lucide-react';
import {
  MerchantCategoryKey,
  PaymentInstrument,
  SupportedLanguage,
  TransactionType,
} from '../types/upi';
import { MERCHANT_CATEGORIES } from '../rules/upiRules';
import { TRANSLATIONS } from '../i18n/translations';
import { cleanNumericInput, formatINR } from '../utils/formatters';

interface MainCalculatorProps {
  lang: SupportedLanguage;
  amount: number;
  onAmountChange: (amount: number) => void;
  transactionType: TransactionType;
  onTransactionTypeChange: (type: TransactionType) => void;
  paymentInstrument: PaymentInstrument;
  onPaymentInstrumentChange: (instrument: PaymentInstrument) => void;
  merchantCategory: MerchantCategoryKey;
  onMerchantCategoryChange: (category: MerchantCategoryKey) => void;
  onCalculate: () => void;
  onReset: () => void;
}

const QUICK_AMOUNTS = [
  { val: 500, label: '₹500' },
  { val: 1000, label: '₹1,000' },
  { val: 2000, label: '₹2,000 (ఉచితం / 0% ఫీజు)', isHighlight: true },
  { val: 2005, label: '₹2,005 (MDR వర్తిస్తుంది)', isHighlight: true },
  { val: 2500, label: '₹2,500' },
  { val: 5000, label: '₹5,000' },
];

export const MainCalculator: React.FC<MainCalculatorProps> = ({
  lang,
  amount,
  onAmountChange,
  transactionType,
  onTransactionTypeChange,
  paymentInstrument,
  onPaymentInstrumentChange,
  merchantCategory,
  onMerchantCategoryChange,
  onCalculate,
  onReset,
}) => {
  const t = TRANSLATIONS[lang];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = cleanNumericInput(e.target.value);
    onAmountChange(val);
  };

  return (
    <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-md">
      {/* Friendly Header */}
      <div className="pb-4 border-b border-slate-100 mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {lang === 'te'
            ? 'మీ UPI లావాదేవీ మొత్తం నమోదు చేయండి'
            : 'Enter UPI Payment Amount'}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
          {lang === 'te'
            ? 'కస్టమర్ ఎంత చెల్లించాలి? వ్యాపారికి ఎంత వస్తుంది? వెంటనే తెలుసుకోండి.'
            : 'Instant calculation: How much customer pays and what merchant receives in bank.'}
        </p>
      </div>

      <div className="space-y-6">
        {/* FIELD 1: Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
              {lang === 'te' ? 'లావాదేవీ మొత్తం (రూపాయలు)' : 'Payment Amount (₹)'}
            </label>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                amount <= 2000
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-blue-100 text-blue-900 border-blue-300'
              }`}
            >
              {amount <= 2000
                ? lang === 'te'
                  ? '₹2,000 లోపు: 0% ఫీజు (ఉచితం!)'
                  : '≤ ₹2,000: 0% Fee (Free!)'
                : lang === 'te'
                ? '₹2,000 దాటినందున: కొద్దిపాటి MDR'
                : '> ₹2,000: Small MDR Fee'}
            </span>
          </div>

          <div className="relative rounded-2xl border-3 border-slate-200 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-100 transition bg-slate-50">
            <span className="pointer-events-none absolute left-4 top-3 text-slate-400 font-black text-2xl">
              ₹
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={amount === 0 ? '' : amount}
              onChange={handleInputChange}
              placeholder="ఉదా: 2000"
              className="w-full py-3.5 pl-11 pr-4 text-2xl sm:text-3xl font-black text-slate-900 placeholder:text-slate-300 bg-transparent outline-none"
            />
          </div>

          {/* Quick Buttons */}
          <div className="mt-3">
            <span className="text-xs font-bold text-slate-500 block mb-1.5">
              {lang === 'te' ? 'త్వరిత బటన్లు (నొక్కండి):' : 'Quick select amount:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((item) => {
                const isSelected = amount === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => onAmountChange(item.val)}
                    className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-600'
                        : item.isHighlight
                        ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-300 hover:bg-emerald-100 font-black'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FIELD 2: Transaction Type */}
        <div>
          <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
            {lang === 'te' ? 'ఎవరికి చెల్లిస్తున్నారు?' : 'Payment Type'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Merchant Payment Button */}
            <button
              type="button"
              onClick={() => onTransactionTypeChange('P2M')}
              className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition ${
                transactionType === 'P2M'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`rounded-xl p-2.5 shrink-0 ${
                  transactionType === 'P2M'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-black text-sm sm:text-base text-slate-900">
                  {lang === 'te' ? '🏪 దుకాణం / వ్యాపారికి (Shop / Merchant QR)' : '🏪 Shop / Merchant QR'}
                </span>
                <span className="block text-xs text-slate-600 mt-0.5 font-medium leading-snug">
                  {lang === 'te'
                    ? 'కిరాణా, హోటల్, మార్కెట్, పెట్రోల్ బంక్, వ్యాపార QR'
                    : 'Kirana shop, restaurant, petrol pump, or store QR'}
                </span>
              </div>
            </button>

            {/* Friend / P2P Button */}
            <button
              type="button"
              onClick={() => onTransactionTypeChange('P2P')}
              className={`flex items-start gap-3.5 rounded-2xl border-2 p-4 text-left transition ${
                transactionType === 'P2P'
                  ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`rounded-xl p-2.5 shrink-0 ${
                  transactionType === 'P2P'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-black text-sm sm:text-base text-slate-900">
                  {lang === 'te' ? '👤 స్నేహితుడు / బంధువులకు (P2P)' : '👤 Friend / Person to Person'}
                </span>
                <span className="block text-xs text-slate-600 mt-0.5 font-medium leading-snug">
                  {lang === 'te'
                    ? 'ఖాతా నుండి ఖాతాకు పంపే నగదు (ఎల్లప్పుడూ 100% ఉచితం)'
                    : 'Direct bank transfer to friends/family (Always Free)'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Optional Advanced Settings Toggle (Keeps Layman UI uncluttered) */}
        {transactionType === 'P2M' && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              <span>
                {showAdvanced
                  ? lang === 'te'
                    ? 'ఇతర వివరాలను దాచు'
                    : 'Hide extra settings'
                  : lang === 'te'
                  ? '⚙️ ఇతర వివరాలు (బ్యాంక్ / వాలెట్ / కేటగిరీ మార్చుకోవడానికి)'
                  : '⚙️ Optional Settings (Change Bank/Wallet or Merchant Type)'}
              </span>
              {showAdvanced ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showAdvanced && (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                {/* Payment Instrument */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {lang === 'te' ? 'చెల్లింపు సాధనం:' : 'Payment Instrument:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onPaymentInstrumentChange('bank_account')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold text-left transition ${
                        paymentInstrument === 'bank_account'
                          ? 'border-blue-600 bg-white text-blue-900 shadow-2xs'
                          : 'border-slate-200 bg-white/60 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>{lang === 'te' ? 'బ్యాంక్ ఖాతా UPI (సాధారణం)' : 'Bank Account UPI (Normal)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPaymentInstrumentChange('ppi_wallet')}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold text-left transition ${
                        paymentInstrument === 'ppi_wallet'
                          ? 'border-amber-600 bg-white text-amber-900 shadow-2xs'
                          : 'border-slate-200 bg-white/60 text-slate-700'
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <span>{lang === 'te' ? 'Paytm/PhonePe వాలెట్' : 'Prepaid Wallet / PPI'}</span>
                    </button>
                  </div>
                </div>

                {/* Merchant Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    {lang === 'te' ? 'వ్యాపారి రకం:' : 'Merchant Type:'}
                  </label>
                  <select
                    value={merchantCategory}
                    onChange={(e) => onMerchantCategoryChange(e.target.value as MerchantCategoryKey)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  >
                    {MERCHANT_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {lang === 'te' ? cat.labelTe : cat.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onCalculate}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700 px-6 py-4 text-base sm:text-lg font-black text-white shadow-lg hover:from-emerald-700 hover:to-blue-800 active:scale-98 transition"
          >
            <span>{lang === 'te' ? '👉 UPI లెక్క చూడండి' : '👉 Check Calculation'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-300 bg-white px-4 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">{lang === 'te' ? 'మళ్లీ ప్రారంభించు' : 'Reset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
