import React, { useState } from 'react';
import { MedicalQuestion } from '../data/questionBank';
import { QuestionCard } from './QuestionCard';
import {
  Bookmark,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Trash2,
} from 'lucide-react';

interface BookmarksAndMistakesProps {
  bookmarkedQuestions: MedicalQuestion[];
  mistakeQuestions: MedicalQuestion[];
  onRemoveBookmark: (id: string) => void;
  onClearMistakes: () => void;
}

export const BookmarksAndMistakes: React.FC<BookmarksAndMistakesProps> = ({
  bookmarkedQuestions,
  mistakeQuestions,
  onRemoveBookmark,
  onClearMistakes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'mistakes'>('bookmarks');
  const [activeQuestion, setActiveQuestion] = useState<MedicalQuestion | null>(null);

  const list = activeSubTab === 'bookmarks' ? bookmarkedQuestions : mistakeQuestions;

  return (
    <div className="space-y-6">
      {/* Subtab selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveSubTab('bookmarks');
              setActiveQuestion(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'bookmarks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>الأسئلة المحفوظة للمراجعة ({bookmarkedQuestions.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('mistakes');
              setActiveQuestion(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer ${
              activeSubTab === 'mistakes'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>سجل الأسئلة التي أخطأت بها ({mistakeQuestions.length})</span>
          </button>
        </div>

        {activeSubTab === 'mistakes' && mistakeQuestions.length > 0 && (
          <button
            onClick={onClearMistakes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح سجل الأخطاء</span>
          </button>
        )}
      </div>

      {/* If a question is selected for full review */}
      {activeQuestion ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveQuestion(null)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <span>← العودة إلى القائمة</span>
            </button>
          </div>

          <QuestionCard
            question={activeQuestion}
            onNextQuestion={() => setActiveQuestion(null)}
            isBookmarked={bookmarkedQuestions.some((q) => q.id === activeQuestion.id)}
            onBookmarkToggle={onRemoveBookmark}
          />
        </div>
      ) : (
        /* List view */
        <div className="space-y-3">
          {list.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                {activeSubTab === 'bookmarks' ? (
                  <Bookmark className="w-6 h-6" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                )}
              </div>
              <h4 className="text-base font-bold text-slate-800">
                {activeSubTab === 'bookmarks'
                  ? 'لا توجد أسئلة محفوظة حتى الآن'
                  : 'سجل أخطائك نظيف تماماً! إجاباتك دقيقة ومتقنة.'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {activeSubTab === 'bookmarks'
                  ? 'يمكنك حفظ أي سؤال سريري مهم للعودة إليه قبل موعد الامتحان 22/12/2026 عبر زر الإشارة المرجعية.'
                  : 'عند الإجابة بشكل غير صحيح على أي سؤال تدريبي، سيُحفظ هنا تلقائياً لتتمكن من مراجعته وإتقانه.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {list.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setActiveQuestion(item)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition cursor-pointer text-right space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {item.specialtyArabic}
                    </span>
                    <span className="text-xs text-slate-400">{item.subtopic}</span>
                  </div>

                  <h5 className="font-bold text-sm text-slate-800 line-clamp-2">
                    {item.question}
                  </h5>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.scenario}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
                    <span>اضغط لمراجعة السؤال وشرحه</span>
                    <span>←</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
