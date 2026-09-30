import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { SupportedLanguage } from '../types/upi';
import { FAQ_DATA, TRANSLATIONS } from '../i18n/translations';

interface FaqSectionProps {
  lang: SupportedLanguage;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const q = lang === 'te' ? faq.questionTe : faq.questionEn;
    const a = lang === 'te' ? faq.answerTe : faq.answerEn;
    const query = searchQuery.toLowerCase();
    return q.toLowerCase().includes(query) || a.toLowerCase().includes(query);
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-blue-700" />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.faqTitle}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500 font-medium">
              {t.faqSubtitle}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={lang === 'te' ? 'ప్రశ్నలలో వెతకండి...' : 'Search questions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <p className="text-center py-6 text-xs text-slate-400 font-medium">
            {lang === 'te' ? 'ఎటువంటి ప్రశ్నలు కనుగొనబడలేదు.' : 'No matching questions found.'}
          </p>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const question = lang === 'te' ? faq.questionTe : faq.questionEn;
            const answer = lang === 'te' ? faq.answerTe : faq.answerEn;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50/70 transition"
                >
                  <span className="pr-4">{question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 border-t border-slate-100 bg-slate-50/40">
                    {answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
