import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Stethoscope,
  Lightbulb,
  MessageSquare,
  AlertCircle,
  HeartHandshake,
} from 'lucide-react';
import { SpecialtyKey } from '../data/questionBank';

interface AiMedicalConsultantProps {
  defaultSpecialty?: SpecialtyKey | 'comprehensive';
}

interface ConsultEntry {
  id: string;
  question: string;
  specialtyArabic: string;
  answer: string;
  timestamp: string;
}

const SUGGESTED_EXAM_QUESTIONS = [
  {
    specialty: 'internal_medicine',
    specialtyArabic: 'الباطنة',
    question: 'كيف أفرق بسرعة بين احتشاء STEMI السفلي واحتشاء البطين الأيمن وما هو الدواء الممنوع فيه؟',
  },
  {
    specialty: 'obgyn',
    specialtyArabic: 'النسائية والتوليد',
    question: 'ما هي المقارنة الدقيقة بين انفكاك المشيمة الباكر والمشيمة المنزاحة من حيث الألم وطبيعة النزف؟',
  },
  {
    specialty: 'surgery',
    specialtyArabic: 'الجراحة',
    question: 'ما هي علامات وأولوية تدبير استرواح الصدر الضاغط مقارنة بالاندحاس القلبي في ردهة الإسعاف؟',
  },
  {
    specialty: 'pediatrics',
    specialtyArabic: 'الأطفال',
    question: 'ما هو الاضطراب الشاردي والقاعدي الحامضي لتضيق البواب الضخامي ولماذا يحدث؟',
  },
  {
    specialty: 'ent',
    specialtyArabic: 'الأذنية',
    question: 'ما هي مواصفات الورم الكوليسترولي (Cholesteatoma) واختلاطاته المهددة للحياة في الأذن؟',
  },
  {
    specialty: 'ophthalmology',
    specialtyArabic: 'العينية',
    question: 'ما هو الفرق الفوري بين انسداد الشريان الشبكي المركزي وانسداد الوريد في فحص قعر العين؟',
  },
];

export const AiMedicalConsultant: React.FC<AiMedicalConsultantProps> = ({
  defaultSpecialty = 'comprehensive',
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(defaultSpecialty);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [consultHistory, setConsultHistory] = useState<ConsultEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAsk = async (questionText: string, specialtyKey?: string) => {
    const textToAsk = questionText.trim();
    if (!textToAsk) return;

    const chosenSpecialty = specialtyKey || selectedSpecialty;
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentResponse(null);

    try {
      const res = await fetch('/api/ask-ai-medical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToAsk,
          specialty: chosenSpecialty,
        }),
      });

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch (_parseErr) {
        throw new Error('حدث ضغط مؤقت في معالجة السؤال، يرجى النقر على إرسال مرة ثانية للمحاولة فوراً.');
      }

      if (!res.ok || !data || !data.success) {
        throw new Error(data?.error || 'تعذر استلام إجابة من المستشار الطبي، يرجى إعادة المحاولة.');
      }

      setCurrentResponse(data.answer);

      // Add to history
      const newEntry: ConsultEntry = {
        id: `q-${Date.now()}`,
        question: textToAsk,
        specialtyArabic: getSpecialtyLabel(chosenSpecialty),
        answer: data.answer,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };
      setConsultHistory((prev) => [newEntry, ...prev]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخدمة الذكية');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSpecialtyLabel = (key: string) => {
    switch (key) {
      case 'internal_medicine':
        return 'الباطنة';
      case 'surgery':
        return 'الجراحة';
      case 'obgyn':
        return 'النسائية والتوليد';
      case 'pediatrics':
        return 'الأطفال';
      case 'ent':
        return 'الأذنية';
      case 'ophthalmology':
        return 'العينية';
      default:
        return 'كافة الاختصاصات';
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 shadow-lg border border-blue-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/40 text-xs font-semibold text-blue-200">
              <Bot className="w-3.5 h-3.5 text-sky-300" />
              <span>مستشارك الأكاديمي والسريري الذكي للامتحان الوطني</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>اسأل الذكاء الاصطناعي أي سؤال طبي متعلق بالامتحان</span>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>
            <p className="text-xs md:text-sm text-blue-200 leading-relaxed max-w-2xl">
              اطرح أي مفهوم طبي ملتبس، أو سؤال دورة سابقة، أو اطلب مقارنة تشخيصية تفريقية. يقدم لك الذكاء الاصطناعي إجابة مبسطة مريحة للعين تركز على لآلئ الامتحان الموحد لدفعة 22/12/2026.
            </p>
          </div>
        </div>
      </div>

      {/* Query Input Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>حدد التخصص واكتب سؤالك الطبي:</span>
          </label>

          {/* Specialty Selector Dropdown / Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">مجال السؤال:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 text-blue-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="comprehensive">كافة الاختصاصات (شامل)</option>
              <option value="internal_medicine">أمراض الباطنة</option>
              <option value="surgery">الجراحة العامة والتخصصية</option>
              <option value="obgyn">النسائية والتوليد</option>
              <option value="pediatrics">طب الأطفال</option>
              <option value="ent">الأذنية (ENT)</option>
              <option value="ophthalmology">العينية (Ophthalmology)</option>
            </select>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: كيف أفرق بين احتشاء البطين الأيمن والأيسر في التدبير الإسعافي؟ أو اشرح لي بروتوكول علاج التهاب الشغاف الجرثومي بالامتحان الوطني..."
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 text-slate-800 text-sm placeholder:text-slate-400 resize-none transition outline-hidden"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
            <span className="text-xs text-slate-400 text-center sm:text-right">
              نصيحة: يمكنك نسخ أي سؤال دورة سابقة كامل وسيقوم الذكاء الاصطناعي بتشريحه سريرياً
            </span>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحليل وتوليد الإجابة...</span>
                </>
              ) : (
                <>
                  <span>إرسال السؤال للمستشار الطبي</span>
                  <Send className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggested Quick Questions */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>أسئلة شائعة ومربكة في الامتحان الوطني (اضغط للسؤال فوراً):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {SUGGESTED_EXAM_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.question);
                  setSelectedSpecialty(item.specialty);
                  handleAsk(item.question, item.specialty);
                }}
                disabled={isLoading}
                className="text-right p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-xs text-slate-700 transition flex items-start gap-2 cursor-pointer"
              >
                <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold shrink-0 text-[10px]">
                  {item.specialtyArabic}
                </span>
                <span className="line-clamp-2 leading-relaxed">{item.question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Current AI Response Display */}
      {currentResponse && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-md p-5 sm:p-7 space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-950">
                  إجابة المستشار الطبي للأمتحان الوطني
                </h4>
                <span className="text-xs text-slate-500">
                  مبنية على أحدث المراجع السريرية وأسلوب أتمتة البورد الموحد
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopy(currentResponse)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 transition"
              title="نسخ الإجابة"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>نسخ الإجابة</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Answer Body */}
          <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-800 leading-relaxed font-sans whitespace-pre-line text-justify bg-blue-50/30 p-4 sm:p-5 rounded-xl border border-blue-100/60">
            {currentResponse}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-blue-800 bg-blue-50/80 px-3 py-2 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              <span>نتمنى لك دوام التوفيق والتميز في امتحان 22/12/2026!</span>
            </div>
          </div>
        </div>
      )}

      {/* Past Queries in this session */}
      {consultHistory.length > 1 && (
        <div className="space-y-3 pt-4">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>الأسئلة السابقة التي طرحتها في هذه الجلسة ({consultHistory.length})</span>
          </h4>

          <div className="space-y-3">
            {consultHistory.slice(1).map((item) => (
              <details
                key={item.id}
                className="group rounded-xl bg-white border border-slate-200 overflow-hidden shadow-xs"
              >
                <summary className="p-3.5 text-right font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-2 list-none">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                      {item.specialtyArabic}
                    </span>
                    <span>{item.question}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-normal shrink-0">{item.timestamp}</span>
                </summary>
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line text-justify">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
