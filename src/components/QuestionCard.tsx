import React, { useState } from 'react';
import { MedicalQuestion } from '../data/questionBank';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Bookmark,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  Lightbulb,
  HeartHandshake,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface QuestionCardProps {
  question: MedicalQuestion;
  onNextQuestion: () => void;
  onPreviousQuestion?: () => void;
  hasPrevious?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  onBookmarkToggle?: (questionId: string) => void;
  isBookmarked?: boolean;
  onAnswerSelected?: (isCorrect: boolean, selectedIdx: number) => void;
}

const OPTION_PREFIXES = ['أ', 'ب', 'ج', 'د', 'هـ'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  hasPrevious = false,
  questionNumber,
  totalQuestions,
  onBookmarkToggle,
  isBookmarked = false,
  onAnswerSelected,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // Reset local state if question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
  }, [question.id]);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return; // locked once answered
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    setShowExplanation(true);
    const isCorrect = selectedOption === question.correctAnswerIndex;
    if (onAnswerSelected) {
      onAnswerSelected(isCorrect, selectedOption);
    }
  };

  const isCorrectAnswer = isSubmitted && selectedOption === question.correctAnswerIndex;
  const isWrongAnswer = isSubmitted && selectedOption !== null && selectedOption !== question.correctAnswerIndex;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6 transition-all duration-300">
      {/* Header bar: Specialty badge, Subtopic, Question counter & Bookmark */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
            {question.specialtyArabic}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {question.subtopic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {questionNumber !== undefined && totalQuestions !== undefined && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              السؤال {questionNumber} من {totalQuestions}
            </span>
          )}

          {onBookmarkToggle && (
            <button
              onClick={() => onBookmarkToggle(question.id)}
              title={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ السؤال للمراجعة'}
              className={`p-2 rounded-lg border transition ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Clinical Vignette (القصة السريرية) */}
      <div className="bg-gradient-to-r from-blue-50/70 via-sky-50/40 to-slate-50/70 rounded-xl p-4 sm:p-5 border border-blue-100/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>القصة السريرية والمعطيات الفاحصة (Clinical Vignette):</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-sans text-justify">
          {question.scenario}
        </p>
      </div>

      {/* Question Prompt (نص السؤال) */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-start gap-2 leading-relaxed">
          <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <span>{question.question}</span>
        </h3>
      </div>

      {/* 5 MCQ Options (الخيارات الخمسة) */}
      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const isChosen = selectedOption === idx;
          const isCorrectOption = idx === question.correctAnswerIndex;

          let optionStyle =
            'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-blue-300 text-slate-700';

          if (isSubmitted) {
            if (isCorrectOption) {
              optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/30';
            } else if (isChosen && !isCorrectOption) {
              optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300/30';
            } else {
              optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
            }
          } else if (isChosen) {
            optionStyle = 'bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/30';
          }

          return (
            <div
              key={idx}
              onClick={() => handleSelect(idx)}
              role="button"
              tabIndex={0}
              className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-sm sm:text-base font-medium transition-all duration-150 cursor-pointer ${optionStyle}`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition ${
                  isSubmitted && isCorrectOption
                    ? 'bg-emerald-600 text-white'
                    : isSubmitted && isChosen && !isCorrectOption
                    ? 'bg-rose-600 text-white'
                    : isChosen
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {OPTION_PREFIXES[idx]}
              </div>

              {/* Option Text */}
              <div className="flex-1 pt-0.5 text-justify leading-relaxed">
                {option.replace(/^[أ-يA-Ea-e0-9][\.\-–\)]\s*/, '')}
              </div>

              {/* Status Icons upon submission */}
              {isSubmitted && isCorrectOption && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
              )}
              {isSubmitted && isChosen && !isCorrectOption && (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Confirm Button */}
      {!isSubmitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            تأكيد الإجابة وعرض الشرح السريري
          </button>
        </div>
      )}

      {/* REASSURANCE (تطمين للطالب عند الإجابة الصحيحة) */}
      {isCorrectAnswer && (
        <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 p-4 sm:p-5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>إجابة صحيحة وموفقة جداً يا دكتور!</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-sans text-justify">
                {question.reassuranceOnSuccess}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOTIVATION & ENCOURAGEMENT (تحفيز ورفع معنويات إذا أخطأ) */}
      {isWrongAnswer && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 via-sky-50 to-amber-50/60 border border-blue-300 p-4 sm:p-5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
              <HeartHandshake className="w-5 h-5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
                <span>لا تقلق يا زميلنا الغالي! الخطأ هنا هو أثمن درس</span>
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                  تحفيز للاختبار
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-sans text-justify">
                {question.encouragementOnFailure}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CLINICAL EXPLANATION & CLINICAL PEARL */}
      {isSubmitted && (
        <div className="space-y-4 pt-2">
          {/* Explanation Box */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>الشرح والتعليل السريري المعتمد:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans text-justify">
              {question.explanation}
            </p>
          </div>

          {/* Clinical Pearl Box */}
          {question.clinicalPearl && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 sm:p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-900 block mb-0.5">
                  لؤلؤة سريرية للحفظ السريع (Clinical Pearl):
                </span>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                  {question.clinicalPearl}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      {isSubmitted && (
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {hasPrevious && onPreviousQuestion ? (
            <button
              onClick={onPreviousQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السؤال السابق</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onNextQuestion}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-95 transition cursor-pointer"
          >
            <span>السؤال التالي</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
