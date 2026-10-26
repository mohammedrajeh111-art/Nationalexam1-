import React from 'react';
import { SpecialtyKey, SPECIALTY_INFO } from '../data/questionBank';
import {
  Stethoscope,
  Scissors,
  Baby,
  HeartHandshake,
  Ear,
  Eye,
  Layers,
  Sparkles,
  Bot,
} from 'lucide-react';

interface SpecialtySelectorProps {
  selectedSpecialty: SpecialtyKey | 'comprehensive';
  onSelectSpecialty: (specialty: SpecialtyKey | 'comprehensive') => void;
  onGenerateAiQuestion: (specialty: SpecialtyKey | 'comprehensive', subtopic?: string) => void;
  isGeneratingAi: boolean;
}

const SPECIALTY_BUTTONS: Array<{
  key: SpecialtyKey | 'comprehensive';
  label: string;
  subLabel: string;
  badge: string;
  icon: any;
}> = [
  {
    key: 'internal_medicine',
    label: 'اسألني بالباطنة',
    subLabel: 'قلبية، صدرية، هضمية، كلوية، عصبية، وغدية',
    badge: 'الخيار الأول',
    icon: Stethoscope,
  },
  {
    key: 'surgery',
    label: 'اسألني بالجراحة',
    subLabel: 'بطن حاد، حوادث ورضوض، وأوعية وصدرية',
    badge: 'الخيار الثاني',
    icon: Scissors,
  },
  {
    key: 'obgyn',
    label: 'اسألني بالنسائية والتوليد',
    subLabel: 'متابعة الحمل، النزوف التوليدية، وأمراض النساء',
    badge: 'الخيار الثالث',
    icon: Baby,
  },
  {
    key: 'pediatrics',
    label: 'اسألني بالأطفال',
    subLabel: 'إنعاش وليد، نمو وتطور، وإنتانات الأطفال',
    badge: 'الخيار الرابع',
    icon: HeartHandshake,
  },
  {
    key: 'ent',
    label: 'اسألني بالأذنية',
    subLabel: 'أمراض الأذن والأنف والبلعوم والرعاف',
    badge: 'الخيار الخامس',
    icon: Ear,
  },
  {
    key: 'ophthalmology',
    label: 'اسألني بالعينية',
    subLabel: 'العين الحمراء، الزرق، الشبكية، والرضوض',
    badge: 'الخيار السادس',
    icon: Eye,
  },
  {
    key: 'comprehensive',
    label: 'امتحان وطني شامل',
    subLabel: 'أسئلة سريرية مختلطة ومتنوعة من كافة التخصصات',
    badge: 'محاكاة كاملة',
    icon: Layers,
  },
];

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({
  selectedSpecialty,
  onSelectSpecialty,
  onGenerateAiQuestion,
  isGeneratingAi,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>اختر الاختصاص الطبي لبدء الأسئلة</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              6 خيارات تخصصية + شامل
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            اضغط على أي مادة للانتقال إلى بنك الأسئلة أو لتوليد سؤال سريري جديد
          </p>
        </div>

        <button
          onClick={() => onGenerateAiQuestion(selectedSpecialty)}
          disabled={isGeneratingAi}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 active:scale-95 transition disabled:opacity-60 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-sky-200" />
          <span>{isGeneratingAi ? 'جاري توليد سؤال سريري...' : 'توليد سؤال جديد بالذكاء الاصطناعي'}</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        </button>
      </div>

      {/* Grid of 6 Specialty Cards + Comprehensive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {SPECIALTY_BUTTONS.map((item) => {
          const isSelected = selectedSpecialty === item.key;
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => onSelectSpecialty(item.key)}
              role="button"
              tabIndex={0}
              className={`relative text-right p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-500/30'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {item.badge}
                </span>

                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-1">{item.label}</h4>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {item.subLabel}
              </p>

              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-blue-200 flex items-center justify-between text-[11px] text-blue-700 font-semibold">
                  <span>الاختصاص النشط</span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtopic Quick Filters for diversity */}
      <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 ml-1">المحاور الأكثر تكراراً بالامتحان (اختر للتنويع الفوري):</span>
        {selectedSpecialty === 'internal_medicine' && (
          <>
            {['أمراض القلب والشرايين', 'صدرية وتنفسية', 'هضمية وكبد', 'كلية وشوارد', 'عصبية وسكتات', 'غدد وسكري', 'رثوية ومناعة', 'دمويات وأورام', 'إنتانية'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('internal_medicine', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium border border-blue-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'surgery' && (
          <>
            {['بطن حاد ومرارة', 'رضوض ATLS', 'أوعية محيطية', 'صدرية إسعافية', 'بولية ورضوضها', 'كسور وعظمية'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('surgery', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-medium border border-indigo-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'obgyn' && (
          <>
            {['حمل هاجر وإسقاط', 'نزوف الثلث الثالث', 'مقدمات الارتعاج', 'عسرات المخاض وPPH', 'أورام نسائية'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('obgyn', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-medium border border-cyan-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'pediatrics' && (
          <>
            {['إنعاش وليد ويرقان', 'تضيق بواب وهرشسبرنغ', 'قصيبات وخناق طفولي', 'كاواراكي وهينوخ', 'اختلاجات حرارية'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('pediatrics', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium border border-sky-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'ent' && (
          <>
            {['ورم كوليسترولي ودوار', 'رعاف خلفي واختلاطات الجيوب', 'خراج حول اللوزة', 'شلل العصب الوجهي'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('ent', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-medium border border-teal-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'ophthalmology' && (
          <>
            {['زرق مغلق الزاوية', 'انسداد شريان ووريد الشبكية', 'انفصال شبكية وعصب بصري', 'حروق كيميائية ورضوض'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('ophthalmology', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-medium border border-blue-200 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
        {selectedSpecialty === 'comprehensive' && (
          <>
            {['حالات إسعاف طوارئ', 'تداخلات دوائية مميتة', 'استقصاءات تمييزية'].map((sub, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onGenerateAiQuestion('comprehensive', sub)}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium border border-slate-300 transition cursor-pointer"
              >
                + {sub}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
