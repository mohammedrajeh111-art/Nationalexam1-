import express, { Request, Response } from 'express';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SPECIALTY_MAP: Record<string, string> = {
  internal_medicine: 'أمراض الباطنة (الداخلية)',
  surgery: 'الجراحة العامة والجراحات التخصصية',
  obgyn: 'النسائية والتوليد',
  pediatrics: 'طب الأطفال وحديثي الولادة',
  ent: 'أمراض وجراحة الأذن والأنف والحنجرة (الأذنية)',
  ophthalmology: 'أمراض وجراحة العين (العينية)',
  comprehensive: 'الامتحان الوطني الموحد الشامل (مختلط من كافة الاختصاصات الطبية)',
};

const SUBTOPICS_MAP: Record<string, string[]> = {
  internal_medicine: [
    'أمراض القلب والأوعية (المتلازمات الإكليلية الحادة STEMI و NSTEMI، قصور القلب الحاد، اللانظميات والرجفان الأذيني، الصدمة القلبية، واعتلال الصمامات)',
    'أمراض الصدر والجهاز التنفسي (الربو الحاد، الداء الرئوي الانسدادي المزمن COPD، ذات الرئة الجرثومية المكتسبة بالمجتمع، الانصباب الجنبي)',
    'أمراض الجهاز الهضمي والكبد (نزف السبيل الهضمي العلوي دوالي المريء وقرحة المعدة، تشمع الكبد واعتلال الدماغ الكبدي، التهاب البنكرياس الحاد، داء كرون والتهاب القولون القرحي)',
    'أمراض الكلية والشوارد (القصور الكلوي الحاد AKI، اضطرابات الصوديوم والبوتاسيوم، التهاب كبيبات الكلى السريع الترقي، المتلازمة النفروزية)',
    'أمراض الغدد والسكري (قصور الكظر الحاد أزمة أديسون، داء غريفز وعاصفة الدرق Thyroid Storm، الحماض الكيتوني السكري DKA، ورم القواتم Pheochromocytoma)',
    'الأمراض العصبية (السكتة الدماغية الإقفارية والنزفية وحل الخثرة، التصلب اللويحي المتعدد MS، الوهن العضلي الوبيل Myasthenia Gravis، متلازمة غيلان باريه، التهاب السحايا)',
    'أمراض المفاصل والروماتيزم (الذئبة الحمامية الجهازية SLE، التهاب المفاصل الرثياني RA، النقرس الحاد، التهاب الشرايين ذو الخلايا العملاقة، داء بهجت)',
    'أمراض الدم والأورام (فقر الدم الانحلالي، اعتلال الصفيحات الخثاري TTP، فرفرية نقص الصفيحات المناعية ITP، اللمفوما، المايلوما المتعددة Multiple Myeloma)',
    'الأمراض الإنتانية والمعدية (الصدمة الإنتانية وبروتوكول الساعات الأولى، الحمى المالطية، التهاب الشغاف الإنتاني، التهاب الحويضة والكلية الحاد)',
  ],
  surgery: [
    'جراحة البطن الحاد والسبيل الهضمي (التهاب المرارة الحاد واليرقان الانسدادي، التهاب الرتوج، انثقاب القرحة الهضمية، فتق مغبني مختنق)',
    'الرضوض والحوادث (تقييم الإصابات الشديدة ATLS، النزف خلف البريتوان، تمزق الطحال الحاد، تمزق الكبد والصدمة النزفية)',
    'جراحة الصدر الإسعافية (استرواح الصدر المصراع Tension Pneumothorax، النزف الصدري الغزير Hemothorax، تمزق المريء متلازمة بورهيف)',
    'جراحة الأوعية المحيطية (نقص التروية الحاد في الطرف السفلي Acute Limb Ischemia، أم دم الأبهر البطني المتمزقة AAA، تسلخ الأبهر الصدري)',
    'جراحة البولية الإسعافية (انفتال الخصية الإسعافي Testicular Torsion، احتباس البول الحاد وتضخم البروستات، حصيات الحالب الانسدادية مع حرارة)',
    'الجراحة العظمية والرضية (الكسور المفتوحة، متلازمة الحجرات Compartment Syndrome، خلع المفصل الإسعافي، التهاب العظم والنقي القيحي)',
    'جراحة الغدد الصم والعنق (عقيدات وسرطان الدرق وتدبير استئصال الدرق، فرط نشاط جارات الدرق وفرط الكالسيوم، أورام الكظر)',
  ],
  obgyn: [
    'اختلاطات الحمل الباكر (الحمل الهاجر المنفجر Ectopic Pregnancy، الإسقاط العفوي والمهدد، الداء العداري الخبيث والسليم)',
    'نزوف الثلث الثالث من الحمل (المشيمة المنزاحة Placenta Previa، انفكاك المشيمة الباكر Abruptio Placentae، تمزق الرحم، الأوعية المنزاحة)',
    'ارتفاع الضغط الحملي ومقدمات الارتعاج الشديدة (Preeclampsia) والارتعاج ومتلازمة HELLP',
    'المخاض والولادة والتدبير الإسعافي (عسرة ولادة الكتف، المجيء المقعدي، هبوط الحبل السري، النزف التالي للوضع PPH)',
    'أمراض النساء والأورام (سرطان عنق الرحم واللطاخة، سرطان بطانة الرحم، أورام وكيسات المبيض الملتوية، داء بطانة الرحم الهاجرة Endometriosis)',
    'الإنتانات التوليدية والنسائية (الداء الحوضي الالتهابي PID، إنتان النفاس، متلازمة الصدمة السمية)',
  ],
  pediatrics: [
    'طب الولدان والإنعاش الوليدي (متلازمة الضائقة التنفسية عند الخديج RDS، يرقان الوليد النووي Kernicterus، استنشاق العقي)',
    'أمراض الجهاز الهضمي والرضع (داء هرشسبرنغ Hirschsprung، اندخال الأمعاء Intussusception، تضيق البواب، التجفاف الحاد ومحاليل الإماهة)',
    'أمراض الجهاز التنفسي عند الأطفال (التهاب القصيبات الشعرية RSV، الربو الطفولي الحاد، الخناق Croup، التهاب لسان المزمار Epiglottitis)',
    'أمراض الدم والمناعة عند الأطفال (فرفرية هينوخ شونلاين Henoch-Schonlein، فقر الدم المنجلي وأزمة الانسداد الوعائي، داء كاواساكي Kawasaki)',
    'الأمراض العصبية والتطورية (الاختلاجات الحرارية البسيطة والمعقدة، الصرع الطفولي، تأخر التطور الحركي، التهاب السحايا عند الرضع)',
    'الأمراض الإنتانية والطفوح عند الأطفال (الحصبة، الحصبة الألمانية، النكاف، جدري الماء، الحمى القرمزية، الإنتان الوليدي)',
  ],
  ent: [
    'أمراض الأذن والسمع (الورم الكوليسترولي واختلاطاته العظمية، داء مينيير Meniere، الدوار الموضعي الحركي السليم BPPV، شلل بيل ورامزي هانت)',
    'أمراض الأنف والجيوب (الرعاف الخلفي الغزير وربط الشريان، التهاب الجيوب واختلاطاته الحجاجية الخراجية، كسر الأنف والورم الدموي بالوتيرة)',
    'أمراض البلعوم والحنجرة (خراج حول اللوزة Peritonsillar Abscess، التهاب لسان المزمار الحاد عند البالغين، شلل الحبال الصوتية بعد استئصال الدرق)',
    'أورام وكتل العنق (الكيسة الدرقية اللسانية، الكيسة الخيشومية، أورام الغدد اللعابية، سرطان البلعوم الأنفي NPC)',
  ],
  ophthalmology: [
    'العين الحمراء الحادة والتشخيص التفريقي (التهاب القزحية الأمامي الحاد Anterior Uveitis، التهاب القرنية الجرثومي والفيروسي، التهاب باطن المقلة Endophthalmitis)',
    'الزرق الحاد والمزمن (نوبة الزرق الحاد مغلق الزاوية وخطورة موسعات الحدقة، والزرق مفتوح الزاوية)',
    'أمراض الشبكية الوعائية والنزفية (انسداد شريان الشبكية المركزي CRAO، انسداد وريد الشبكية المركزي CRVO، اعتلال الشبكية السكري التكاثري)',
    'اضطرابات الرؤية الحادة والمفاجئة (انفصال الشبكية، التهاب العصب البصري Optic Neuritis، وذمة حليمة العصب البصري Papilledema)',
    'رضوض العين والإسعافات العينية (الحروق الكيميائية القلوية وغسيل العين الفوري، الأجسام الأجنبية داخل المقلة، نزف الغرفة الأمامية Hyphema)',
  ],
  comprehensive: [
    'حالة إسعافية متعددة التخصصات (Polytrauma & Emergency Medicine)',
    'تدبير سريري باطني جراحي مشترك (Medical-Surgical Interface)',
    'أدوية الخط الأول والتداخلات الدوائية الخطرة ومضادات الاستطباب في الامتحان الوطني',
    'استقصاءات تمييزية وتفسير تحاليل وصور شعاعية وطبقي محوري',
  ],
};

const MODELS_TO_TRY = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

async function generateWithFallback(callFn: (model: string) => Promise<any>) {
  let lastError: any = null;
  for (const model of MODELS_TO_TRY) {
    try {
      return await callFn(model);
    } catch (err: any) {
      console.warn(`Model ${model} failed, attempting next model if available. Error:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError;
}

function safeJsonParse(rawText: string): any {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  // Strip markdown code blocks if model enclosed output in ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Find outermost object { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    throw new Error('تعذر معالجة صيغة السؤال، جاري إعادة المحاولة.');
  }
}

// Dynamic Motivation Generation by AI (No pre-saved quotes)
app.post('/api/generate-motivation', async (req: Request, res: Response) => {
  try {
    const { recentQuotes = [] } = req.body;

    const prompt = `أنت طبيب استشاري ومرشد نفسي وأكاديمي لطلاب كلية الطب المقبلين على "الامتحان الوطني الموحد للطب البشري" في 22/12/2026.
المطلوب صياغة عبارة تحفيزية فريدة وملهمة وجديدة كلياً تمس قلب طالب الطب المتعب من ساعات الدراسة الشاقة وسهر المشافي.
${recentQuotes.length > 0 ? `مهم جداً: تجنب تكرار أي صياغة أو كلمات قريبة من هذه العبارات الأخيرة: ${recentQuotes.slice(-4).join(' --- ')}` : ''}

المطلوب إرجاع JSON حصراً وفق المخطط التالي:
- quote: العبارة التحفيزية الملهمة (بين 20 و 45 كلمة) بأسلوب راقٍ يجمع بين روح الطب والأمل.
- doctorWisdom: ومضة حكمة سريرية وتطمين نفسي عميق.
- author: صفة الكاتب (مثال: "وصية استشاري لزميل الغد", "نبض أطباء المستقبل", "من ردهات الإسعاف", "إلهام سريري").
- category: تصنيف العبارة ("يقين وهدوء", "عزيمة وصمود", "رسالة إنسانية", "شغف الشفاء").`;

    const response = await generateWithFallback((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
          systemInstruction: 'أنت مرشد أطباء المستقبل للامتحان الوطني. أجب بصيغة JSON حصراً بسرعة وبدون وسوم markdown.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quote: { type: Type.STRING },
              doctorWisdom: { type: Type.STRING },
              author: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ['quote', 'doctorWisdom', 'author', 'category'],
          },
        },
      })
    );

    const parsed = safeJsonParse(response.text || '{}');
    return res.json({
      success: true,
      data: {
        id: `mot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        ...parsed,
      },
    });
  } catch (error: any) {
    console.error('Error generating motivation quote:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'تعذر توليد عبارة تحفيزية',
    });
  }
});

app.post('/api/generate-question', async (req: Request, res: Response) => {
  try {
    const {
      specialty = 'internal_medicine',
      subtopic: reqSubtopic,
      focusArea,
      excludeTopics = [],
      previousQuestionSnippets = [],
    } = req.body;
    const specialtyNameArabic = SPECIALTY_MAP[specialty] || SPECIALTY_MAP.internal_medicine;

    // Pick a diverse subtopic that hasn't been recently asked to prevent repetition
    const availableSubtopics = SUBTOPICS_MAP[specialty] || SUBTOPICS_MAP.internal_medicine;
    let candidates = availableSubtopics.filter(
      (s) => !excludeTopics.some((ex: string) => s.includes(ex) || ex.includes(s))
    );
    if (candidates.length === 0) {
      candidates = availableSubtopics; // reset if all were touched
    }
    const selectedSubtopic = reqSubtopic || candidates[Math.floor(Math.random() * candidates.length)];

    const prompt = `أنت خبير معتمد في كتابة أسئلة "الامتحان الوطني الموحد للطب البشري".
المطلوب صياغة سؤال أتمتة سريري واقعي مبتكر وجديد تماماً (MCQ Clinical Vignette) من مستوى التخرج.

التخصص: ${specialtyNameArabic}
الموضوع الطبي المطلوب: ${selectedSubtopic}
${focusArea ? `التركيز الخاص: ${focusArea}` : ''}
${
  previousQuestionSnippets.length > 0
    ? `تنبيه حاسم لعدم التكرار: لا تكرر إطلاقاً الحالات أو الأمراض أو السيناريوهات السابقة التالية: ${previousQuestionSnippets.slice(-6).join(' | ')}`
    : ''
}

شروط السؤال الصارمة:
1. السؤال جديد وغير مكرر، مكون بالضبط من 5 خيارات (أ، ب، ج، د، هـ).
2. سيناريو سريري واقعي ومباشر (عمر، جنس، شكوى، علامات حيوية، نتائج فحص أو تحاليل).
3. خيار واحد فقط صحيح ومضللات ممتازة.
4. شرح علمي متين لسبب الإجابة الصحيحة واستبعاد غيرها.
5. عبارة تطمين ومديح مخصصة عند الإجابة الصحيحة.
6. عبارة تحفيزية تشد العزم عند الخطأ وتذكر بامتحان 22/12/2026.
7. لؤلؤة سريرية ذهبية (Clinical Pearl) سريعة الحفظ.`;

    const response = await generateWithFallback((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
          systemInstruction:
            'أنت بروفيسور خبير في الامتحان الوطني للطب البشري. أجب بصيغة JSON بسرعة وبدون تفكير مطول وفق المخطط المطلوب.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenario: {
                type: Type.STRING,
                description: 'نص القصة السريرية المفصلة والفحص والاستقصاءات',
              },
              question: {
                type: Type.STRING,
                description: 'صيغة السؤال المطلوب بدقة',
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'مصفوفة تحتوي على 5 خيارات محددة تماماً (أ، ب، ج، د، هـ)',
              },
              correctAnswerIndex: {
                type: Type.INTEGER,
                description: 'مؤشر الخيار الصحيح (من 0 إلى 4)',
              },
              explanation: {
                type: Type.STRING,
                description: 'الشرح السريري المفصل لسبب صحة الخيار واستبعاد باقي الخيارات',
              },
              reassuranceOnSuccess: {
                type: Type.STRING,
                description: 'عبارة تطمين وتشجيع للطالب عند الإجابة الصحيحة بأسلوب طبي أخوي دافئ',
              },
              encouragementOnFailure: {
                type: Type.STRING,
                description: 'عبارة تحفيزية لطيفة عند الإجابة الخاطئة تؤكد أن الخطأ خطوة للتعلم قبل 22/12/2026',
              },
              clinicalPearl: {
                type: Type.STRING,
                description: 'لؤلؤة سريرية ذهبية ملخصة وسريعة الحفظ',
              },
            },
            required: [
              'scenario',
              'question',
              'options',
              'correctAnswerIndex',
              'explanation',
              'reassuranceOnSuccess',
              'encouragementOnFailure',
              'clinicalPearl',
            ],
          },
        },
      })
    );

    const text = response.text;
    if (!text) {
      throw new Error('لم يتم استلام نص من النموذج');
    }

    const parsed = safeJsonParse(text);
    return res.json({
      success: true,
      data: {
        id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        specialty,
        specialtyArabic: specialtyNameArabic,
        subtopic: selectedSubtopic.split('(')[0].trim(),
        ...parsed,
      },
    });
  } catch (error: any) {
    console.error('Error generating medical question:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'فشل توليد السؤال، سيتم الانتقال للبنك السريري المدمج',
    });
  }
});

app.post('/api/ask-ai-medical', async (req: Request, res: Response) => {
  try {
    const { question, specialty = 'comprehensive', context } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'الرجاء إدخال سؤال طبي' });
    }

    const specialtyNameArabic = SPECIALTY_MAP[specialty] || 'كافة الاختصاصات الطبية';

    const prompt = `أنت بروفيسور واستشاري خبير في تدريس وتدريب طلاب كلية الطب على اجتياز "الامتحان الوطني الموحد للطب البشري" بدرجة امتياز.
طالب طب مقبل على الامتحان الوطني بتاريخ 22/12/2026 يطرح عليك هذا السؤال الطبي:

السؤال: "${question.trim()}"
الاختصاص: ${specialtyNameArabic}
${context ? `سياق إضافي: ${context}` : ''}

المطلوب تقديم إجابة سريعة، علمية، مركزة للامتحان الوطني:
1. الجواب المباشر الواضح (Direct Answer).
2. التفريق السريري ونقاط الامتحانات (Clinical Clues & Distinctions).
3. لؤلؤة سريرية ذهبية (High-Yield Exam Pearl).
4. كلمة تشجيع وتطمين أخوية دافئة.`;

    const response = await generateWithFallback((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
          systemInstruction:
            'أنت مستشار الامتحان الوطني الموحد للطب البشري. هدفك تقديم إجابة مباشرة ودقيقة وسريعة لطالب الطب مع التحفيز والتطمين.',
        },
      })
    );

    const answer = response.text || 'عذراً، لم نتمكن من الحصول على الإجابة حالياً. يرجى إعادة المحاولة.';
    return res.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    console.error('Error answering medical question:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ أثناء معالجة السؤال الطبي.',
    });
  }
});

app.post('/api/psych-support', async (req: Request, res: Response) => {
  try {
    const { worry } = req.body;
    if (!worry || typeof worry !== 'string' || worry.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'الرجاء كتابة ما يقلقك' });
    }

    const prompt = `أنت استشاري طب نفسي سريري ومرشد أكاديمي مخصص لطلاب كلية الطب المقبلين على الامتحان الوطني الموحد للطب البشري بتاريخ 22/12/2026.
طالب الطب يعبر لك عن قلقه وإجهاده النفسي قائلاً:
"${worry.trim()}"

المطلوب تقديم دعم نفسي عميق ومريح للعين، مستنداً إلى علم النفس العصبي والطب السريري بروح أخوية دافئة جداً:
1. empathyOpening: تفهم وتعاطف صادق يُشعر الطالب بأن مشاعره طبيعية ويمر بها معظم الأطباء المتفوقين.
2. cognitiveReframing: تصحيح وتفكيك المشوه المعرفي (مثل وهم النسيان، أو وهم تأخر الإنجاز) من منظور علم الأعصاب (Neuroscience).
3. actionableSteps: 3 خطوات عملية سريعة ومريحة لليوم (تخفيف عبء، أسلوب دراسي، تنظيم نوم).
4. doctorMantra: رسالة يقين وطمأنينة قوية تمنحه السلام الداخلي ليوم 22/12/2026.`;

    const response = await generateWithFallback((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
          systemInstruction:
            'أنت المرشد النفسي لطلاب كلية الطب. أجب بصيغة JSON حصراً بسرعة ورأفة ومواساة طبية عالية.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              empathyOpening: { type: Type.STRING },
              cognitiveReframing: { type: Type.STRING },
              actionableSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              doctorMantra: { type: Type.STRING },
            },
            required: ['empathyOpening', 'cognitiveReframing', 'actionableSteps', 'doctorMantra'],
          },
        },
      })
    );

    const parsed = safeJsonParse(response.text || '{}');
    return res.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error('Error generating psych support:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'حدث خطأ في تقديم الدعم النفسي، يرجى المحاولة ثانية',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Medical Board App running at http://localhost:${port}`);
  });
}

startServer();
