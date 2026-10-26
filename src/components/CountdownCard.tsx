import React, { useState, useEffect } from 'react';
import { calculateExamCountdown, CountdownResult } from '../utils/countdown';
import { Calendar, Clock, Sparkles, Award, Target, Flame } from 'lucide-react';

export const CountdownCard: React.FC = () => {
  const [countdown, setCountdown] = useState<CountdownResult>(calculateExamCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateExamCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl p-5 md:p-6 border border-blue-700/50">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title and metadata */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-400/30 text-xs font-semibold text-blue-100">
            <Calendar className="w-3.5 h-3.5 text-sky-300" />
            <span>موعد الامتحان الوطني الموحد:</span>
            <span className="text-yellow-300 font-bold">22 كانون الأول 2026 (22/12/2026)</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>العد التنازلي ليوم الحسم والقطاف</span>
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </h2>

          <p className="text-sm text-blue-200 max-w-xl leading-relaxed">
            {countdown.studyStageMessage} • كل يوم تقضيه في المذاكرة يقربك من هدفك وصناعة طبيب ناجح يثق به المرضى.
          </p>
        </div>

        {/* Countdown digits */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
          {/* Days */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 shadow-inner min-w-[70px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-sky-200 font-mono">
              {countdown.days}
            </span>
            <span className="text-xs font-medium text-blue-300 mt-1">أيام متبقية</span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 shadow-inner min-w-[70px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-200 font-mono">
              {String(countdown.hours).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-blue-300 mt-1">ساعة</span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 shadow-inner min-w-[70px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-200 font-mono">
              {String(countdown.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-blue-300 mt-1">دقيقة</span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-950/70 border border-blue-500/30 shadow-inner min-w-[70px] sm:min-w-[85px]">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300 font-mono">
              {String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium text-blue-300 mt-1">ثانية</span>
          </div>
        </div>
      </div>

      {/* Target pacing note */}
      <div className="relative z-10 mt-4 pt-3 border-t border-blue-700/40 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-sky-300" />
          <span>المعدل الموصى به حالياً: <strong className="text-white">{countdown.recommendedDailyQuestions} سؤال يومياً</strong> مع فهم الشروح السريرية</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-300">
          <Clock className="w-3.5 h-3.5" />
          <span>الوقت الإجمالي التقريبي: {countdown.totalHours} ساعة تركيز</span>
        </div>
      </div>
    </div>
  );
};
