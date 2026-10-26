import {
  Stethoscope,
  Calendar,
  Sparkles,
  Bot,
  Layers,
  BookmarkCheck,
  Moon,
  Sun,
  Award,
  Heart,
} from 'lucide-react';

export type AppTab = 'practice' | 'ai_consult' | 'psych_support' | 'mock_exam' | 'bookmarks';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isEyeComfortDark: boolean;
  onToggleEyeComfort: () => void;
  onOpenMockExam: () => void;
  bookmarksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isEyeComfortDark,
  onToggleEyeComfort,
  onOpenMockExam,
  bookmarksCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  الامتحان الوطني الموحد
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  <Calendar className="w-3 h-3" />
                  22/12/2026
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
                المنصة الدراسية السريرية لطلاب وخريجي كلية الطب البشري
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Mock Exam Trigger */}
            <button
              onClick={onOpenMockExam}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-bold border border-blue-200 dark:border-blue-800 transition cursor-pointer"
            >
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>بدء محاكاة امتحانية</span>
            </button>

            {/* Eye comfort theme toggle (Shades of soothing blue) */}
            <button
              onClick={onToggleEyeComfort}
              title={isEyeComfortDark ? 'التحويل للوضع الأزرق النهاري' : 'التحويل للوضع الليلي المريح للعين'}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {isEyeComfortDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">أزرق نهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">أزرق ليلي مريح</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 sm:space-x-2 space-x-reverse overflow-x-auto py-2.5 no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
          {/* Tab 1: 6 Specialties Practice */}
          <button
            onClick={() => onTabChange('practice')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>أسئلة الاختصاصات الستة</span>
          </button>

          {/* Tab 2: Ask AI Medical Consultant */}
          <button
            onClick={() => onTabChange('ai_consult')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              activeTab === 'ai_consult'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-sky-300" />
            <span>اسأل الذكاء الاصطناعي الطبي</span>
          </button>

          {/* Tab 3: Psychological Support Corner (New!) */}
          <button
            onClick={() => onTabChange('psych_support')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              activeTab === 'psych_support'
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>واحة الدعم النفسي</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 font-bold">
              جديد
            </span>
          </button>

          {/* Tab 3: Mock Exam */}
          <button
            onClick={() => onTabChange('mock_exam')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              activeTab === 'mock_exam'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>امتحان تجريبي موحد</span>
          </button>

          {/* Tab 4: Bookmarks & Review */}
          <button
            onClick={() => onTabChange('bookmarks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>المحفوظات وسجل الأخطاء</span>
            {bookmarksCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                {bookmarksCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
