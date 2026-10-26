export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalHours: number;
  isPast: boolean;
  formattedTargetDate: string;
  recommendedDailyQuestions: number;
  studyStageMessage: string;
}

export const EXAM_DATE = new Date(2026, 11, 22, 9, 0, 0); // 22 December 2026, 09:00 AM

export function calculateExamCountdown(now: Date = new Date()): CountdownResult {
  const diffMs = EXAM_DATE.getTime() - now.getTime();
  const isPast = diffMs <= 0;

  if (isPast) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalHours: 0,
      isPast: true,
      formattedTargetDate: '22 كانون الأول / ديسمبر 2026',
      recommendedDailyQuestions: 0,
      studyStageMessage: 'حان موعد الامتحان الوطني الموحد! بالتوفيق لجميع زملائنا الأطباء.',
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalHours = Math.floor(totalSeconds / 3600);

  // Dynamic recommendations based on remaining time
  let recommendedDailyQuestions = 30;
  let studyStageMessage = '';

  if (days > 120) {
    recommendedDailyQuestions = 25;
    studyStageMessage = 'مرحلة التأسيس وتثبيت المفاهيم السريرية الكبرى';
  } else if (days > 60) {
    recommendedDailyQuestions = 40;
    studyStageMessage = 'مرحلة التركيز وربط الاختصاصات وحل أسئلة الدورات الوطنية السابقة';
  } else if (days > 30) {
    recommendedDailyQuestions = 60;
    studyStageMessage = 'المرحلة الذهبية المكثفة: مراجعة اللآلئ السريرية وتدارك نقاط الضعف';
  } else if (days > 10) {
    recommendedDailyQuestions = 75;
    studyStageMessage = 'مرحلة الامتحانات التجريبية وسرعة الحل تحت الضغط الزمني';
  } else {
    recommendedDailyQuestions = 30;
    studyStageMessage = 'الأيام الأخيرة: استقرار نفسي، تثبيت الملاحظات، والنوم الكافي';
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalHours,
    isPast: false,
    formattedTargetDate: '22 كانون الأول / ديسمبر 2026 (22/12/2026)',
    recommendedDailyQuestions,
    studyStageMessage,
  };
}
