import React, { useState, useEffect } from 'react';
import { MedicalQuestion, CURATED_QUESTION_BANK, SpecialtyKey } from '../data/questionBank';
import {
  Timer,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: MedicalQuestion[];
}

export const MockExamModal: React.FC<MockExamModalProps> = ({ isOpen, onClose, questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(questions.length * 90); // 1.5 mins per question

  useEffect(() => {
    if (!isOpen || isFinished) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isFinished]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct += 1;
      }
    });
    return {
      correct,
      total: totalQ,
      percent: Math.round((correct / totalQ) * 100),
    };
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const resetExam = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsFinished(false);
    setSecondsRemaining(questions.length * 90);
  };

  const score = calculateScore();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-blue-200 overflow-hidden my-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-800 text-sky-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                محاكاة الامتحان الوطني الموحد (امتحان تدريبي)
              </h3>
              <span className="text-xs text-blue-200">
                {isFinished ? 'النتائج والتقييم النهائي' : `السؤال ${currentIndex + 1} من ${totalQ}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isFinished && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-950/80 border border-blue-400/30 text-amber-300 font-mono text-sm font-bold">
                <Timer className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-blue-800/80 hover:bg-blue-700 text-blue-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isFinished ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Question Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
              />
            </div>

            {/* Specialty tag */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-xs font-bold">
                {currentQ.specialtyArabic}
              </span>
              <span className="text-xs text-slate-500">{currentQ.subtopic}</span>
            </div>

            {/* Scenario */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed text-justify">
              {currentQ.scenario}
            </div>

            {/* Question */}
            <h4 className="font-bold text-base text-blue-950">{currentQ.question}</h4>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    role="button"
                    tabIndex={0}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm font-medium transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 border text-slate-600'
                      }`}
                    >
                      {['أ', 'ب', 'ج', 'د', 'هـ'][idx]}
                    </span>
                    <span className="flex-1 leading-relaxed text-justify">{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold disabled:opacity-40 transition"
              >
                السابق
              </button>

              <div className="flex items-center gap-2">
                {currentIndex === totalQ - 1 ? (
                  <button
                    onClick={() => setIsFinished(true)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    إنهاء الامتحان وتصحيح الإجابات
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(totalQ - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    التالي
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Finished State & Score Review */
          <div className="p-6 space-y-6">
            <div className="text-center space-y-3 py-4 bg-gradient-to-b from-blue-50 to-white rounded-2xl border border-blue-100">
              <div className="inline-flex p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="text-xl font-extrabold text-blue-950">
                نتيجة الامتحان التجريبي
              </h3>
              <div className="text-4xl font-black text-blue-700 font-mono">
                {score.percent}%
              </div>
              <p className="text-sm text-slate-600">
                أجبت بشكل صحيح على <strong className="text-emerald-600 font-bold">{score.correct}</strong> من أصل{' '}
                <strong>{score.total}</strong> أسئلة
              </p>

              {/* Dynamic Encouragement */}
              <div className="max-w-md mx-auto p-3 rounded-xl bg-blue-100/70 text-blue-900 text-xs font-semibold">
                {score.percent >= 80
                  ? 'أداء استثنائي ومستوى استشاري رفيع! أنت تسير بخطى واثقة نحو نيل أعلى درجات الامتحان الوطني.'
                  : score.percent >= 60
                  ? 'مستوى جيد جداً، مع تثبيت الملاحظات السريرية ستضمن التميز التام في 22/12/2026.'
                  : 'بداية ممتازة للتعلم! كل سؤال أخطأت فيه اليوم هو فرصة ذهبية لسد ثغرة قبل الامتحان الحقيقي.'}
              </div>
            </div>

            {/* Answer Key & Rationales Breakdown */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <h4 className="text-sm font-bold text-slate-700">مراجعة أسئلة الامتحان:</h4>
              {questions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correctAnswerIndex;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs sm:text-sm ${
                      isCorrect ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 font-bold">
                      <span className="text-slate-800">س {idx + 1}: {q.question}</span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 shrink-0">
                          <CheckCircle className="w-4 h-4" /> صحيح
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 shrink-0">
                          <XCircle className="w-4 h-4" /> غير صحيح
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed text-justify">
                      {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={resetExam}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition"
              >
                إغلاق والعودة للدراسة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
