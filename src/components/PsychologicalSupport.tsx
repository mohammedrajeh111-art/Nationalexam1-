import React, { useState, useEffect } from 'react';
import {
  Heart,
  Wind,
  ShieldCheck,
  Sparkles,
  Smile,
  Send,
  HelpCircle,
  Lightbulb,
  Moon,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle,
  Bot,
} from 'lucide-react';

interface PsychAdvice {
  empathyOpening: string;
  cognitiveReframing: string;
  actionableSteps: string[];
  doctorMantra: string;
}

const COMMON_WORRIES = [
  {
    title: 'أشعر أنني نسيت كل شيء وتطايرت المعلومات!',
    worry: 'أشعر بخوف شديد من أنني نسيت ما درسته في الباطنة والجراحة، وأشعر بفراغ في عقلي وكأنني لم أدرس شيئاً.',
  },
  {
    title: 'أشعر بضيق الوقت حتى موعد 22/12/2026',
    worry: 'الوقت المتبقي للامتحان الوطني يسبب لي توتراً كبيراً وأشعر بتراكم المنهاج وضخامة المواد الطبية.',
  },
  {
    title: 'المقارنة مع زملائي وشعوري بالتأخر عنهم',
    worry: 'أشعر بالإحباط عندما أسمع زملائي يتحدثون عن إنجازهم لدورات كاملة وأشعر أنني أبطأ منهم بكثير.',
  },
  {
    title: 'الإرهاق النفسي وثقل فتح المراجع (الاحتراق النفسي)',
    worry: 'أجلس أمام الكتب لساعات ولا أستطيع التركيز، وأشعر بانطفاء الشغف والإرهاق الجسدي والنفسي.',
  },
];

export const PsychologicalSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vent' | 'breathing' | 'truths'>('vent');
  const [customWorry, setCustomWorry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [psychAdvice, setPsychAdvice] = useState<PsychAdvice | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState<'شهيق عميق' | 'حبس النفس' | 'زفير بطيء' | 'استرخاء'>('شهيق عميق');
  const [breathingSeconds, setBreathingSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  useEffect(() => {
    if (!isBreathingActive) return;
    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          setBreathingPhase((phase) => {
            if (phase === 'شهيق عميق') return 'حبس النفس';
            if (phase === 'حبس النفس') return 'زفير بطيء';
            if (phase === 'زفير بطيء') return 'استرخاء';
            return 'شهيق عميق';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const handleAskSupport = async (text: string) => {
    const input = text.trim();
    if (!input) return;

    setIsLoading(true);
    setErrorNotice(null);
    setPsychAdvice(null);

    try {
      const res = await fetch('/api/psych-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worry: input }),
      });

      const rawText = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error('حدث ضغط مؤقت في الاتصال، يرجى النقر على إرسال مرة ثانية للمحاولة.');
      }

      if (!res.ok || !json || !json.success) {
        throw new Error(json?.error || 'تعذر الحصول على الدعم النفسي حالياً.');
      }

      setPsychAdvice(json.data);
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-sky-900 to-indigo-950 text-white p-6 shadow-lg border border-blue-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/40 text-xs font-semibold text-blue-200">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>واحة السكينة والدعم النفسي لطبيب المستقبل</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <span>أنت لست آلة.. سلامك النفسي جزء من تدبيرك السريري</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>

            <p className="text-xs md:text-sm text-blue-200 leading-relaxed max-w-2xl">
              هنا مساحتك الآمنة للتخفيف من ضغط التحضير، تفكيك وهم النسيان، واستعادة الهدوء لتدخل امتحان 22/12/2026 بذهن صافٍ وقلب واثق.
            </p>
          </div>
        </div>

        {/* Sub-navigation inside psych corner */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-blue-800/60 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('vent')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'vent'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-500" />
            <span>تفريغ القلق واستشارة المرشد النفسي</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('breathing');
              setIsBreathingActive(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'breathing'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>تمرين التنفس المهدئ لنبضات القلب (4-4-4-4)</span>
          </button>

          <button
            onClick={() => setActiveTab('truths')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'truths'
                ? 'bg-white text-blue-950 shadow-xs'
                : 'text-blue-200 hover:bg-blue-800/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>حقائق عصبية وسريرية لطمأنة عقلك</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Venting & AI Support Consultation */}
      {activeTab === 'vent' && (
        <div className="space-y-5">
          {/* Quick Worries Pills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>مخاوف كلاسيكية يشعر بها أطباء الامتياز (اضغط للمواساة الفورية):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {COMMON_WORRIES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomWorry(item.worry);
                    handleAskSupport(item.worry);
                  }}
                  disabled={isLoading}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-right transition cursor-pointer space-y-1"
                >
                  <span className="font-bold text-xs text-blue-950 block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.worry}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Smile className="w-4 h-4 text-emerald-600" />
              <span>أو اكتب ما يقلقك بحرية وسيقوم المرشد النفسي بتحليله وتخفيفه:</span>
            </label>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskSupport(customWorry);
              }}
              className="space-y-3"
            >
              <textarea
                rows={3}
                value={customWorry}
                onChange={(e) => setCustomWorry(e.target.value)}
                placeholder="اكتب هنا أي شعور بالضغط، الخوف، التعب، أو الشك بالقدرات..."
                className="w-full p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-hidden"
                disabled={isLoading}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !customWorry.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري صياغة الدعم النفسي...</span>
                    </>
                  ) : (
                    <>
                      <span>طلب الدعم والتطمين</span>
                      <Send className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Error Notice */}
          {errorNotice && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* AI Response Display */}
          {psychAdvice && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-6 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Empathy Opening */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 fill-rose-500" />
                <p className="text-sm text-blue-950 font-medium leading-relaxed text-justify">
                  {psychAdvice.empathyOpening}
                </p>
              </div>

              {/* Cognitive Reframing */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>تفكيك المشوه المعرفي (منظور علم الأعصاب):</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed text-justify">
                  {psychAdvice.cognitiveReframing}
                </div>
              </div>

              {/* 3 Practical Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3 خطوات عملية وبسيطة تطبقها اليوم لاستعادة التوازن:</span>
                </h4>
                <div className="space-y-2">
                  {psychAdvice.actionableSteps.map((step, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Mantra */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-200/80 text-center space-y-1">
                <span className="text-xs font-bold text-amber-900 block">
                  رسالة السكينة واليقين الذهبية:
                </span>
                <p className="text-base font-extrabold text-blue-950 leading-relaxed">
                  "{psychAdvice.doctorMantra}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Breathing Exercise */}
      {activeTab === 'breathing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <Wind className="w-5 h-5 text-sky-500" />
              <span>تمرين التنفس الصندوقي (4-4-4-4)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              تقنية سريرية مثبتة تُستخدم لدى جراحي الطوارئ لخفض هرمون الكورتيزول، تنشيط العصب المبهم (Vagus Nerve)، وإعادة تدفق الدم للقشرة الدماغية.
            </p>
          </div>

          {/* Interactive Breathing Visualizer */}
          <div className="relative w-56 h-56 mx-auto flex items-center justify-center my-6">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 opacity-20 blur-xl transition-all duration-1000 ${
                breathingPhase === 'شهيق عميق'
                  ? 'scale-125'
                  : breathingPhase === 'زفير بطيء'
                  ? 'scale-75'
                  : 'scale-100'
              }`}
            />
            <div
              className={`w-44 h-44 rounded-full border-4 border-blue-500/40 flex flex-col items-center justify-center bg-blue-50 shadow-inner transition-all duration-1000 ${
                breathingPhase === 'شهيق عميق'
                  ? 'scale-110 bg-blue-100 border-blue-600'
                  : breathingPhase === 'زفير بطيء'
                  ? 'scale-90 bg-sky-50 border-sky-400'
                  : 'scale-100 bg-blue-50'
              }`}
            >
              <span className="text-lg font-black text-blue-900 mb-1">
                {breathingPhase}
              </span>
              <span className="text-3xl font-extrabold text-blue-600 font-mono">
                {breathingSeconds}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsBreathingActive((prev) => !prev)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              {isBreathingActive ? 'إيقاف مؤقت' : 'بدء التمرين'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: Scientific Clinical Mindset Truths */}
      {activeTab === 'truths' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-800">وهم النسيان السريري</h4>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              حين تشعر أنك لا تتذكر شيئاً، فإن دماغك لا يمحو البيانات، بل يدخرها في (Implicit Memory). فور قراءتك لنص السؤال والخيارات الخمسة، يطلق الدماغ إشارات التعرف (Recognition) لتجد الإجابة حاضرة تلقائياً!
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-800">نومك هو معالج التثبيت</h4>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              النوم لمدة 7 ساعات ليلاً هو العملية العصبية التي تنقل خلالها المشابك العصبية المعلومات من الحصين (Hippocampus) المؤقت إلى القشرة المخية الدائمة. السهر المفرط يقلل استرجاعك بنسبة 40%.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-800">قاعدة المقارنة الصفرية</h4>
            <p className="text-xs text-slate-600 leading-relaxed text-justify">
              لا تنخدع بما يقوله زملاؤك عن عدد الدورات التي أنهوها؛ سر الامتحان الوطني الموحد ليس في القراءة السريعة بل في ترسيخ "اللآلئ السريرية والتدابير الإسعافية". سؤال واحد تفهمه بعمق يعادل 10 أسئلة تقرؤها بسطحية.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
