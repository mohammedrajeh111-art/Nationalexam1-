import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, HeartHandshake, ShieldCheck, Quote, Bot } from 'lucide-react';

export interface GeneratedMotivation {
  id: string;
  quote: string;
  author: string;
  category: string;
  doctorWisdom: string;
}

export const MotivationalHero: React.FC = () => {
  const [motivation, setMotivation] = useState<GeneratedMotivation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [seenQuotes, setSeenQuotes] = useState<string[]>([]);

  const fetchAiMotivation = async (currentSeen: string[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recentQuotes: currentSeen }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMotivation(json.data);
        setSeenQuotes((prev) => [...prev.slice(-8), json.data.quote]);
      } else {
        throw new Error('Failed to generate motivation');
      }
    } catch (err) {
      console.error(err);
      // In unlikely event of failure, generate a fresh fallback text
      setMotivation({
        id: `mot-local-${Date.now()}`,
        quote: 'كل ساعة تقضيها اليوم في استيعاب المفاهيم السريرية، هي نبض أمل وحياة ستنقذها غداً في ردهات الإسعاف والمشافي.',
        author: 'نبض أطباء المستقبل',
        category: 'يقين ورسالة',
        doctorWisdom: 'الامتحان الوطني في 22/12/2026 محطة لتأكيد جدارتك وليس عائقاً، استمر بعزم وهدوء.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiMotivation([]);
  }, []);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/70 border border-blue-200/80 p-5 md:p-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Bot className="w-4 h-4 text-sky-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <span>جرعة التحفيز واليقين اليومية (مولدة لحظياً بالذكاء الاصطناعي)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                غير مكررة ✨
              </span>
            </h3>
            <p className="text-xs text-blue-700/80">كلمات حية يكتبها الذكاء الاصطناعي خصيصاً لطبيب المستقبل</p>
          </div>
        </div>

        <button
          onClick={() => fetchAiMotivation(seenQuotes)}
          disabled={isLoading}
          title="توليد عبارة تحفيزية جديدة"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100/70 text-blue-800 text-xs font-semibold border border-blue-200 shadow-xs hover:shadow transition active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'جاري الصياغة...' : 'توليد تحفيز جديد'}</span>
        </button>
      </div>

      <div className="relative bg-white/90 backdrop-blur-xs rounded-xl p-4 sm:p-5 border border-blue-100 shadow-xs min-h-[110px] flex flex-col justify-center">
        <Quote className="w-8 h-8 text-blue-200/80 absolute top-2 right-2 pointer-events-none" />

        {isLoading && !motivation ? (
          <div className="space-y-2 py-2 animate-pulse pr-6">
            <div className="h-4 bg-blue-200/60 rounded-md w-5/6" />
            <div className="h-4 bg-blue-100/80 rounded-md w-4/6" />
            <div className="h-3 bg-slate-100 rounded-md w-2/6 mt-2" />
          </div>
        ) : motivation ? (
          <div className="relative z-10 pr-6">
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed font-sans mb-3 text-justify">
              "{motivation.quote}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-100/80 text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-medium">
                <HeartHandshake className="w-3.5 h-3.5 text-blue-600" />
                <span>{motivation.author}</span>
                {motivation.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                    {motivation.category}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-slate-600 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{motivation.doctorWisdom}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
