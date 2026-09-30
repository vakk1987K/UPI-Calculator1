import React, { useState } from 'react';
import { Table, Building2, Wallet } from 'lucide-react';
import {
  MerchantCategoryKey,
  PaymentInstrument,
  SupportedLanguage,
  TransactionType,
} from '../types/upi';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateUpiMdr } from '../calculator/calculateMdr';
import { formatINR, formatPercent } from '../utils/formatters';

interface ComparisonTableProps {
  lang: SupportedLanguage;
  evaluationDate?: string;
}

interface BenchmarkItem {
  type: TransactionType;
  instrument?: PaymentInstrument;
  category?: MerchantCategoryKey;
  amount: number;
  highlightNote?: string;
}

const BENCHMARK_ITEMS: BenchmarkItem[] = [
  // P2P
  { type: 'P2P', amount: 500, highlightNote: 'P2P (Always Free)' },
  { type: 'P2P', amount: 5000, highlightNote: 'P2P (Always Free)' },
  // At or Below ₹2,000 (Exempt)
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'small_merchant',
    amount: 500,
    highlightNote: '≤ ₹2,000 (100% Free)',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 1999,
    highlightNote: '≤ ₹2,000 (100% Free)',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 2000,
    highlightNote: 'Exact ₹2k Boundary (Free)',
  },
  {
    type: 'P2M',
    instrument: 'ppi_wallet',
    category: 'regular_merchant',
    amount: 2000,
    highlightNote: 'Wallet ≤ ₹2k (0% Fee)',
  },
  // Above ₹2,000 (MDR Trigger)
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'small_merchant',
    amount: 2001,
    highlightNote: '> ₹2k Boundary',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 2001,
    highlightNote: '> ₹2k Boundary',
  },
  {
    type: 'P2M',
    instrument: 'ppi_wallet',
    category: 'regular_merchant',
    amount: 2001,
    highlightNote: 'Wallet > ₹2k (1.1%)',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'small_merchant',
    amount: 5000,
    highlightNote: 'Small Merchant',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 5000,
    highlightNote: 'Hits ₹30 Cap',
  },
  {
    type: 'P2M',
    instrument: 'ppi_wallet',
    category: 'essential_services',
    amount: 5000,
    highlightNote: 'Wallet Utilities (0.5%)',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 10000,
    highlightNote: 'Hits ₹30 Cap',
  },
  {
    type: 'P2M',
    instrument: 'bank_account',
    category: 'regular_merchant',
    amount: 100000,
    highlightNote: 'Hits ₹30 Cap',
  },
];

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  lang,
  evaluationDate,
}) => {
  const t = TRANSLATIONS[lang];
  const [filterType, setFilterType] = useState<'all' | 'P2P' | 'bank' | 'wallet'>('all');

  const filteredItems = BENCHMARK_ITEMS.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'P2P') return item.type === 'P2P';
    if (filterType === 'bank') return item.type === 'P2M' && item.instrument === 'bank_account';
    if (filterType === 'wallet') return item.type === 'P2M' && item.instrument === 'ppi_wallet';
    return true;
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-700" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.tableTitle}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            {t.tableSubtitle}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center rounded-xl bg-slate-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'te' ? 'అన్నీ' : 'All'}
          </button>
          <button
            type="button"
            onClick={() => setFilterType('P2P')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              filterType === 'P2P'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            P2P
          </button>
          <button
            type="button"
            onClick={() => setFilterType('bank')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              filterType === 'bank'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank UPI
          </button>
          <button
            type="button"
            onClick={() => setFilterType('wallet')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              filterType === 'wallet'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallet/PPI
          </button>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5">{t.colPaymentType}</th>
              <th className="py-3 px-3.5">{t.colAmount}</th>
              <th className="py-3 px-3.5">{t.colCustomerPays}</th>
              <th className="py-3 px-3.5">{t.colCustomerCharge}</th>
              <th className="py-3 px-3.5">{t.colMdrRate}</th>
              <th className="py-3 px-3.5">{t.colMerchantMdr}</th>
              <th className="py-3 px-3.5">{t.colMerchantNet}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredItems.map((item, idx) => {
              const res = calculateUpiMdr({
                amount: item.amount,
                transactionType: item.type,
                paymentInstrument: item.instrument,
                merchantCategory: item.category,
                evaluationDate,
              });

              return (
                <tr
                  key={`${item.type}-${item.instrument}-${item.category}-${item.amount}-${idx}`}
                  className="hover:bg-slate-50/70 transition"
                >
                  <td className="py-3 px-3.5">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 font-bold text-[10px] ${
                            item.type === 'P2P'
                              ? 'bg-blue-100 text-blue-800'
                              : item.instrument === 'ppi_wallet'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.type === 'P2P'
                            ? 'P2P'
                            : item.instrument === 'ppi_wallet'
                            ? 'Wallet'
                            : 'Bank UPI'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {item.type === 'P2P'
                            ? 'Peer to Peer'
                            : item.category === 'small_merchant'
                            ? lang === 'te'
                              ? 'చిన్న వ్యాపారి'
                              : 'Small Merchant'
                            : item.category === 'essential_services'
                            ? lang === 'te'
                              ? 'విద్యుత్ / ఇంధనం'
                              : 'Utilities'
                            : lang === 'te'
                            ? 'రెగ్యులర్'
                            : 'Regular'}
                        </span>
                      </div>
                      {item.highlightNote && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {item.highlightNote}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 font-bold text-slate-900">
                    {formatINR(res.amount)}
                  </td>
                  <td className="py-3 px-3.5 text-slate-900 font-bold">
                    {formatINR(res.customerTotalPays)}
                  </td>
                  <td className="py-3 px-3.5 text-emerald-700 font-extrabold">
                    ₹0 (Free)
                  </td>
                  <td className="py-3 px-3.5">
                    {formatPercent(res.applicableMdrRatePercent)}
                  </td>
                  <td className="py-3 px-3.5">
                    <span
                      className={`font-bold ${
                        res.isMdrApplicable ? 'text-amber-800' : 'text-slate-900'
                      }`}
                    >
                      {formatINR(res.estimatedMdr, true)}
                    </span>
                    {res.mdrCapApplied && (
                      <span className="ml-1 text-[9px] font-bold bg-amber-100 text-amber-900 px-1 py-0.2 rounded">
                        CAP
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 font-bold text-blue-900">
                    {formatINR(res.estimatedMerchantSettlement, true)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-slate-400 italic">
        * {lang === 'te'
          ? 'గమనిక: కస్టమర్ ఎల్లప్పుడూ ₹0 ఛార్జ్ మాత్రమే చెల్లిస్తారు. ₹2,000 లోపు వ్యాపారికి కూడా 0% MDR ఉంటుంది.'
          : 'Note: Customer always pays ₹0 extra. Transactions at or below ₹2,000 carry 0% MDR for merchants.'}
      </p>
    </div>
  );
};
