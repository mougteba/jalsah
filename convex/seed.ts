import { mutation } from "./_generated/server";

export const seedStages = mutation({
  handler: async (ctx) => {
    const stages = [
      // ===== مسار AI =====
      {
        track: "ai" as const, order: 1,
        title: "ما هو الذكاء الاصطناعي؟",
        description: "تعرف على مفهوم الذكاء الاصطناعي وأهم تطبيقاته في حياتنا اليومية وسوق العمل.",
        externalUrl: "https://www.youtube.com/watch?v=2QPdPBk51B4",
        phase: "الأساسيات",
        adminLocked: false,
        questions: [
          { text: "ما هو الذكاء الاصطناعي؟", type: "mcq" as const, options: ["محاكاة الذكاء البشري بالحاسوب","برنامج ألعاب فقط","شبكة إنترنت متطورة","نوع من أنواع الروبوتات"], answer: "محاكاة الذكاء البشري بالحاسوب" },
          { text: "الذكاء الاصطناعي سيؤثر على 300 مليون وظيفة بحلول 2030", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أي من هذه الأدوات يستخدم الذكاء الاصطناعي؟", type: "mcq" as const, options: ["ChatGPT","Microsoft Word","Google Chrome","Adobe Photoshop"], answer: "ChatGPT" },
        ],
      },
      {
        track: "ai" as const, order: 2,
        title: "كيف يتعلم الذكاء الاصطناعي؟",
        description: "افهم كيف تعمل خوارزميات Machine Learning وDeep Learning وكيف يتعلم النموذج من البيانات.",
        externalUrl: "https://www.youtube.com/watch?v=0I9qt2YQlvM",
        phase: "الأساسيات",
        adminLocked: false,
        questions: [
          { text: "ما الفرق بين Machine Learning وDeep Learning؟", type: "mcq" as const, options: ["Deep Learning فرع من Machine Learning","هما نفس الشيء","Machine Learning أحدث","لا علاقة بينهما"], answer: "Deep Learning فرع من Machine Learning" },
          { text: "يحتاج الذكاء الاصطناعي إلى بيانات للتعلم", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما الذي يميز Deep Learning؟", type: "mcq" as const, options: ["يستخدم شبكات عصبية متعددة الطبقات","يعمل بدون بيانات","أسرع دائماً من Machine Learning","لا يحتاج معالج قوي"], answer: "يستخدم شبكات عصبية متعددة الطبقات" },
        ],
      },
      {
        track: "ai" as const, order: 3,
        title: "النماذج اللغوية الكبيرة LLMs",
        description: "اكتشف ما هي LLMs وكيف تختلف عن NLP التقليدي وكيف تستخدمها في مشاريعك.",
        externalUrl: "https://www.youtube.com/watch?v=Rft-NYjolgw",
        phase: "الأساسيات",
        adminLocked: false,
        questions: [
          { text: "ماذا تعني LLM؟", type: "mcq" as const, options: ["Large Language Model","Low Level Machine","Linear Learning Method","Large Logic Module"], answer: "Large Language Model" },
          { text: "ChatGPT مبني على نموذج LLM", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما الفرق الرئيسي بين LLM وNLP التقليدي؟", type: "mcq" as const, options: ["LLM يفهم السياق بشكل أعمق","NLP أذكى","هما متماثلان","LLM أقدم"], answer: "LLM يفهم السياق بشكل أعمق" },
        ],
      },
      {
        track: "ai" as const, order: 4,
        title: "Prompt Engineering — كيف تكتب احترافياً",
        description: "تعلم أسس هندسة الأوامر وكيف تكتب prompts احترافية تعطيك نتائج دقيقة ومفيدة.",
        externalUrl: "https://www.youtube.com/watch?v=2_3WuekEg4s",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما هو Prompt Engineering؟", type: "mcq" as const, options: ["فن كتابة الأوامر للحصول على نتائج أفضل","برمجة نماذج AI","تصميم واجهات المستخدم","تحليل البيانات"], answer: "فن كتابة الأوامر للحصول على نتائج أفضل" },
          { text: "كلما كان الـ Prompt أوضح كلما كانت النتيجة أفضل", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أي من هذه تقنيات Prompt Engineering؟", type: "mcq" as const, options: ["Few-shot prompting","Python scripting","API calling","Database query"], answer: "Few-shot prompting" },
        ],
      },
      {
        track: "ai" as const, order: 5,
        title: "أدوات AI الأساسية — ChatGPT وClaude وGemini",
        description: "قارن بين أشهر أدوات الذكاء الاصطناعي واعرف متى تستخدم كل أداة لتحقيق أفضل النتائج.",
        externalUrl: "https://www.youtube.com/watch?v=0CTR57uY6Kw",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما الشركة التي طورت Claude؟", type: "mcq" as const, options: ["Anthropic","OpenAI","Google","Meta"], answer: "Anthropic" },
          { text: "Gemini طورته شركة Google", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أي أداة الأنسب لتحليل البيانات والأكواد البرمجية؟", type: "mcq" as const, options: ["Claude","Instagram","TikTok","WhatsApp"], answer: "Claude" },
        ],
      },
      {
        track: "ai" as const, order: 6,
        title: "AI في الحياة اليومية وتحقيق الدخل",
        description: "اكتشف خارطة الطريق لتطبيق الذكاء الاصطناعي في حياتك وكيف تحوله إلى مصدر دخل حقيقي.",
        externalUrl: "https://www.youtube.com/watch?v=wEQlr9n6hII",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "أي من هذه مجالات تحقيق الدخل عبر AI؟", type: "mcq" as const, options: ["كتابة المحتوى بمساعدة AI","لعب الألعاب","مشاهدة الأفلام","التسوق الإلكتروني"], answer: "كتابة المحتوى بمساعدة AI" },
          { text: "يمكن استخدام AI لأتمتة مهام تستغرق ساعات في دقائق", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما أول خطوة في خارطة طريق تعلم AI؟", type: "mcq" as const, options: ["فهم الأساسيات والمفاهيم","برمجة نماذج من الصفر","شراء GPU قوي","تعلم Python أولاً"], answer: "فهم الأساسيات والمفاهيم" },
        ],
      },

      // ===== مسار Automation =====
      {
        track: "automation" as const, order: 1,
        title: "ما هي الأتمتة؟",
        description: "تعرف على مفهوم AI Automation وكيف تغير طريقة العمل وتوفر ساعات من المهام المتكررة.",
        externalUrl: "https://www.youtube.com/watch?v=9bMy9C8wIyg",
        phase: "الأساسيات",
        adminLocked: false,
        questions: [
          { text: "ما هدف الأتمتة الرئيسي؟", type: "mcq" as const, options: ["توفير الوقت وتقليل الأخطاء البشرية","استبدال البشر كلياً","تعقيد العمليات","زيادة التكاليف"], answer: "توفير الوقت وتقليل الأخطاء البشرية" },
          { text: "n8n أداة مجانية ومفتوحة المصدر للأتمتة", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أي من هذه أمثلة على الأتمتة؟", type: "mcq" as const, options: ["إرسال بريد إلكتروني تلقائي عند تسجيل عميل جديد","كتابة رسالة يدوياً","فتح برنامج Excel","طباعة ورقة"], answer: "إرسال بريد إلكتروني تلقائي عند تسجيل عميل جديد" },
        ],
      },
      {
        track: "automation" as const, order: 2,
        title: "أدوات الأتمتة — Make وZapier وn8n",
        description: "قارن بين أشهر أدوات الأتمتة واعرف أيها يناسب مشروعك من حيث السعر والمرونة.",
        externalUrl: "https://www.youtube.com/watch?v=cI2iVCOBqVY",
        phase: "الأساسيات",
        adminLocked: false,
        questions: [
          { text: "أي الأدوات مفتوح المصدر ويمكن تشغيله على سيرفرك الخاص؟", type: "mcq" as const, options: ["n8n","Zapier","Make","HubSpot"], answer: "n8n" },
          { text: "Zapier يدعم آلاف التطبيقات", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما ميزة Make على Zapier؟", type: "mcq" as const, options: ["واجهة بصرية أقوى وأسعار أفضل","أسرع دائماً","يعمل بدون إنترنت","لا يحتاج إعداد"], answer: "واجهة بصرية أقوى وأسعار أفضل" },
        ],
      },
      {
        track: "automation" as const, order: 3,
        title: "بناء أول Workflow تلقائي",
        description: "طبّق عملياً وابنِ أول workflow تلقائي باستخدام n8n من الصفر خطوة بخطوة.",
        externalUrl: "https://www.youtube.com/watch?v=mCy_v_O4gT0",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما هو الـ Trigger في الـ Workflow؟", type: "mcq" as const, options: ["الحدث الذي يبدأ تشغيل الأتمتة","النتيجة النهائية","أداة الربط","قاعدة البيانات"], answer: "الحدث الذي يبدأ تشغيل الأتمتة" },
          { text: "يمكن ربط n8n بـ Google Sheets", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما أول خطوة لبناء Workflow في n8n؟", type: "mcq" as const, options: ["تحديد الـ Trigger","كتابة الكود","شراء الاشتراك","تثبيت Python"], answer: "تحديد الـ Trigger" },
        ],
      },
      {
        track: "automation" as const, order: 4,
        title: "ربط APIs مع AI",
        description: "تعلم كيف توظّف جيشاً من AI Agents عبر ربط APIs مع n8n لأتمتة مهام معقدة.",
        externalUrl: "https://www.youtube.com/watch?v=pNVkW8RxEIY",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما هو الـ API؟", type: "mcq" as const, options: ["واجهة برمجية لربط التطبيقات","نوع من قواعد البيانات","لغة برمجة","أداة تصميم"], answer: "واجهة برمجية لربط التطبيقات" },
          { text: "يمكن ربط ChatGPT API مع n8n", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما فائدة AI Agent في الأتمتة؟", type: "mcq" as const, options: ["اتخاذ قرارات ذكية تلقائياً","تصميم الشعارات","إدارة الملفات يدوياً","تصفح الإنترنت"], answer: "اتخاذ قرارات ذكية تلقائياً" },
        ],
      },
      {
        track: "automation" as const, order: 5,
        title: "أتمتة المهام المتكررة وتحقيق الدخل",
        description: "اكتشف كيف يحقق المحترفون دخلاً حقيقياً من خلال بناء حلول أتمتة للشركات والأفراد.",
        externalUrl: "https://www.youtube.com/watch?v=F2ft6e-3R20",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "كيف يمكن تحقيق دخل من الأتمتة؟", type: "mcq" as const, options: ["بناء حلول أتمتة للشركات","بيع الأجهزة","تصميم المواقع يدوياً","تعليم اللغات"], answer: "بناء حلول أتمتة للشركات" },
          { text: "الأتمتة تناسب فقط الشركات الكبيرة", type: "truefalse" as const, options: [], answer: "خطأ" },
          { text: "ما أكثر المهام المناسبة للأتمتة؟", type: "mcq" as const, options: ["إرسال التقارير الدورية","الاجتماعات الإبداعية","التفاوض مع العملاء","التصميم الجرافيكي"], answer: "إرسال التقارير الدورية" },
        ],
      },
      {
        track: "automation" as const, order: 6,
        title: "بناء AI Agent كامل",
        description: "تعلم كيف تبني وكيل ذكاء اصطناعي كامل يعمل باستقلالية ويكمل مهام معقدة.",
        externalUrl: "https://www.youtube.com/watch?v=WVzNoXBqNSY",
        phase: "المتقدم",
        adminLocked: false,
        questions: [
          { text: "ما الفرق بين AI Agent والـ Chatbot العادي؟", type: "mcq" as const, options: ["Agent يتخذ قرارات ويكمل مهام متعددة","Chatbot أذكى","هما نفس الشيء","Agent أبطأ"], answer: "Agent يتخذ قرارات ويكمل مهام متعددة" },
          { text: "AI Agent يمكنه استخدام أدوات خارجية", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أي مكون أساسي في AI Agent؟", type: "mcq" as const, options: ["الذاكرة والأدوات والتخطيط","الشاشة والكاميرا","الطابعة والماسح","الميكروفون فقط"], answer: "الذاكرة والأدوات والتخطيط" },
        ],
      },

      // ===== مسار Vibe Coding =====
      {
        track: "vibe" as const, order: 1,
        title: "ما هو Vibe Coding؟",
        description: "اكتشف ثورة البرمجة الجديدة التي تمكنك من بناء تطبيقات حقيقية بدون كتابة سطر كود.",
        externalUrl: "https://www.youtube.com/watch?v=VSQ5JBH3dVw",
        phase: "المفاهيم",
        adminLocked: false,
        questions: [
          { text: "ما هو Vibe Coding؟", type: "mcq" as const, options: ["البرمجة بمساعدة AI بدون كتابة كود يدوياً","نوع من موسيقى البرمجة","لغة برمجة جديدة","إطار عمل JavaScript"], answer: "البرمجة بمساعدة AI بدون كتابة كود يدوياً" },
          { text: "Vibe Coding يتطلب خبرة برمجية عميقة", type: "truefalse" as const, options: [], answer: "خطأ" },
          { text: "من صاغ مصطلح Vibe Coding؟", type: "mcq" as const, options: ["Andrej Karpathy","Elon Musk","Sam Altman","Bill Gates"], answer: "Andrej Karpathy" },
        ],
      },
      {
        track: "vibe" as const, order: 2,
        title: "أدوات البناء — Cursor وBolt وLovable",
        description: "تعرف على أقوى أدوات Vibe Coding وكيف تختار المناسب منها لمشروعك.",
        externalUrl: "https://www.youtube.com/watch?v=ge0KZU2GPzM",
        phase: "الأدوات",
        adminLocked: false,
        questions: [
          { text: "ما هو Cursor؟", type: "mcq" as const, options: ["محرر كود يدمج AI لمساعدتك في البرمجة","موقع تصميم","قاعدة بيانات","خدمة استضافة"], answer: "محرر كود يدمج AI لمساعدتك في البرمجة" },
          { text: "Bolt.new يمكنه بناء تطبيق كامل من وصف نصي", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما ميزة Lovable؟", type: "mcq" as const, options: ["متخصص في بناء تطبيقات الويب بسرعة","للتصميم الجرافيكي فقط","لتعديل الصور","لتحرير الفيديو"], answer: "متخصص في بناء تطبيقات الويب بسرعة" },
        ],
      },
      {
        track: "vibe" as const, order: 3,
        title: "بناء أول مشروع بالذكاء الاصطناعي",
        description: "طبّق عملياً وابنِ أول تطبيق حقيقي باستخدام Cursor من الصفر حتى النهاية.",
        externalUrl: "https://www.youtube.com/watch?v=kS6tF-22YNA",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما أول خطوة لبناء مشروع في Cursor؟", type: "mcq" as const, options: ["كتابة وصف واضح لما تريد بناءه","تثبيت Python","شراء اشتراك","تعلم HTML أولاً"], answer: "كتابة وصف واضح لما تريد بناءه" },
          { text: "يمكن بناء تطبيق كامل في ساعة واحدة باستخدام Cursor", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ماذا يعني Deploy للمشروع؟", type: "mcq" as const, options: ["نشر المشروع ليكون متاحاً للعموم","حذف المشروع","نسخ الكود","تصميم الواجهة"], answer: "نشر المشروع ليكون متاحاً للعموم" },
        ],
      },
      {
        track: "vibe" as const, order: 4,
        title: "كيف تصف ما تريد بناءه — Prompting للكود",
        description: "تعلم فن كتابة الأوامر للكود وكيف تجعل نتائج Cursor مختلفة ومميزة.",
        externalUrl: "https://www.youtube.com/watch?v=kMbmMAOJYjU",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما أهم عنصر في Prompt الكود؟", type: "mcq" as const, options: ["الدقة والتفصيل في الوصف","الطول فقط","استخدام كلمات تقنية","الكتابة بالإنجليزية دائماً"], answer: "الدقة والتفصيل في الوصف" },
          { text: "إعطاء مثال للنتيجة المطلوبة يحسن جودة الكود", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ماذا تضيف لـ Prompt لتحسين النتيجة؟", type: "mcq" as const, options: ["سياق المشروع والتقنيات المستخدمة","أي كلمات عشوائية","طول النص فقط","أسماء المبرمجين"], answer: "سياق المشروع والتقنيات المستخدمة" },
        ],
      },
      {
        track: "vibe" as const, order: 5,
        title: "نشر مشروعك — Deploy",
        description: "تعلم 3 طرق فعالة لنشر مواقعك وتطبيقاتك باستخدام Cursor AI وجعلها متاحة للعالم.",
        externalUrl: "https://www.youtube.com/watch?v=XfG1Zr-60NA",
        phase: "التطبيق",
        adminLocked: false,
        questions: [
          { text: "ما أسهل منصة لنشر مشاريع Next.js؟", type: "mcq" as const, options: ["Vercel","Amazon","Microsoft","Apple"], answer: "Vercel" },
          { text: "يمكن نشر موقع مجاناً على Vercel", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما هو GitHub في سياق النشر؟", type: "mcq" as const, options: ["منصة لحفظ الكود ومشاركته","موقع تسوق","شبكة اجتماعية","خدمة بريد إلكتروني"], answer: "منصة لحفظ الكود ومشاركته" },
        ],
      },
      {
        track: "vibe" as const, order: 6,
        title: "بناء منتج كامل بـ AI Agent",
        description: "جرّب أقوى AI في مشروع Full Stack حقيقي وشاهد كيف يبني Agent كامل من الصفر.",
        externalUrl: "https://www.youtube.com/watch?v=7NOfj99dvec",
        phase: "المتقدم",
        adminLocked: false,
        questions: [
          { text: "ما هو Full Stack؟", type: "mcq" as const, options: ["تطوير الواجهة الأمامية والخلفية معاً","تصميم الشعارات","إدارة قواعد البيانات فقط","كتابة المحتوى"], answer: "تطوير الواجهة الأمامية والخلفية معاً" },
          { text: "AI Agent يمكنه كتابة وتشغيل الكود تلقائياً", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما الفائدة من بناء منتج كامل كمشروع تخرج؟", type: "mcq" as const, options: ["إثبات المهارات لسوق العمل","مجرد تمرين","لا فائدة منه","لتعلم التصميم فقط"], answer: "إثبات المهارات لسوق العمل" },
        ],
      },

      // ===== مسار Vibe Engineering =====
      {
        track: "engineering" as const, order: 1,
        title: "ما هو Vibe Engineering؟",
        description: "تعرف على المستوى المتقدم من Vibe Coding وكيف تصبح AI Builder محترف.",
        externalUrl: "https://www.youtube.com/watch?v=VSQ5JBH3dVw",
        phase: "المفاهيم",
        adminLocked: true,
        questions: [
          { text: "ما الفرق بين Vibe Coding وVibe Engineering؟", type: "mcq" as const, options: ["Engineering أعمق وتشمل بنية المشاريع الكاملة","هما نفس الشيء","Coding أصعب","لا فرق"], answer: "Engineering أعمق وتشمل بنية المشاريع الكاملة" },
          { text: "Vibe Engineering تتطلب فهم بنية المشاريع", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "من هو AI Builder؟", type: "mcq" as const, options: ["شخص يبني منتجات حقيقية بمساعدة AI","مصمم جرافيك","مدير مشاريع","كاتب محتوى"], answer: "شخص يبني منتجات حقيقية بمساعدة AI" },
        ],
      },
      {
        track: "engineering" as const, order: 2,
        title: "أدوات Cursor المتقدمة",
        description: "أتقن الميزات المتقدمة في Cursor وتعلم كيف تستخدمه للمشاريع الكبيرة والمعقدة.",
        externalUrl: "https://www.youtube.com/watch?v=ge0KZU2GPzM",
        phase: "الأدوات",
        adminLocked: true,
        questions: [
          { text: "ما هو Cursor Rules؟", type: "mcq" as const, options: ["ملف يحدد قواعد وأسلوب الكود للمشروع","نوع من الألعاب","إضافة للمتصفح","خدمة سحابية"], answer: "ملف يحدد قواعد وأسلوب الكود للمشروع" },
          { text: "يمكن ربط Cursor بقواعد البيانات مباشرة", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما فائدة Composer في Cursor؟", type: "mcq" as const, options: ["تعديل ملفات متعددة في نفس الوقت","تشغيل الموسيقى","تصميم الشعار","إرسال الإيميلات"], answer: "تعديل ملفات متعددة في نفس الوقت" },
        ],
      },
      {
        track: "engineering" as const, order: 3,
        title: "بناء مشروع Full Stack كامل",
        description: "ابنِ تطبيقاً كاملاً من الصفر يشمل الواجهة والخادم وقاعدة البيانات والنشر.",
        externalUrl: "https://www.youtube.com/watch?v=kS6tF-22YNA",
        phase: "التطبيق",
        adminLocked: true,
        questions: [
          { text: "ما مكونات مشروع Full Stack؟", type: "mcq" as const, options: ["Frontend وBackend وDatabase","الشعار والألوان فقط","النصوص والصور","الدومين فقط"], answer: "Frontend وBackend وDatabase" },
          { text: "Next.js يدعم بناء Full Stack في مشروع واحد", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما دور قاعدة البيانات في المشروع؟", type: "mcq" as const, options: ["حفظ واسترجاع البيانات","عرض الواجهة","معالجة الصور","إرسال الإشعارات"], answer: "حفظ واسترجاع البيانات" },
        ],
      },
      {
        track: "engineering" as const, order: 4,
        title: "AI Agents مع CrewAI",
        description: "تعلم بناء فرق من AI Agents باستخدام CrewAI لأتمتة مهام معقدة تحتاج تعاون متعدد الوكلاء.",
        externalUrl: "https://www.youtube.com/watch?v=DDR4A8-MLQs",
        phase: "المتقدم",
        adminLocked: true,
        questions: [
          { text: "ما هو CrewAI؟", type: "mcq" as const, options: ["إطار لبناء فرق من AI Agents تتعاون","موقع لتصميم الشعارات","أداة لتحرير الفيديو","خدمة استضافة"], answer: "إطار لبناء فرق من AI Agents تتعاون" },
          { text: "يمكن لـ Agents مختلفة التخصص في مهام مختلفة", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما فائدة تعدد الـ Agents في المشروع؟", type: "mcq" as const, options: ["معالجة مهام معقدة بتوزيع العمل","تقليل السرعة","زيادة التكلفة","تعقيد الكود"], answer: "معالجة مهام معقدة بتوزيع العمل" },
        ],
      },
      {
        track: "engineering" as const, order: 5,
        title: "نشر وتوسيع المشاريع",
        description: "تعلم كيف تنشر مشاريعك الكبيرة وتوسّعها لتستوعب آلاف المستخدمين.",
        externalUrl: "https://www.youtube.com/watch?v=XfG1Zr-60NA",
        phase: "المتقدم",
        adminLocked: true,
        questions: [
          { text: "ما هو Scaling في المشاريع؟", type: "mcq" as const, options: ["توسيع القدرة لاستيعاب المزيد من المستخدمين","تصغير الموقع","تقليل الميزات","حذف البيانات"], answer: "توسيع القدرة لاستيعاب المزيد من المستخدمين" },
          { text: "Docker يساعد في نشر التطبيقات بشكل موحد", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما أفضل منصة للمشاريع الكبيرة؟", type: "mcq" as const, options: ["AWS أو Google Cloud","USB فلاش","البريد الإلكتروني","WhatsApp"], answer: "AWS أو Google Cloud" },
        ],
      },
      {
        track: "engineering" as const, order: 6,
        title: "بناء منتج SaaS كامل",
        description: "المرحلة النهائية — ابنِ منتج SaaS حقيقي كامل يمكن بيعه وتحقيق دخل منه.",
        externalUrl: "https://www.youtube.com/watch?v=7NOfj99dvec",
        phase: "المتقدم",
        adminLocked: true,
        questions: [
          { text: "ما هو SaaS؟", type: "mcq" as const, options: ["Software as a Service — برنامج كخدمة عبر الإنترنت","نوع من قواعد البيانات","لغة برمجة","أداة تصميم"], answer: "Software as a Service — برنامج كخدمة عبر الإنترنت" },
          { text: "يمكن بناء SaaS كامل باستخدام Vibe Engineering", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "ما نموذج الدخل الشائع في SaaS؟", type: "mcq" as const, options: ["الاشتراك الشهري","البيع مرة واحدة","الإعلانات فقط","التبرعات"], answer: "الاشتراك الشهري" },
        ],
      },
      {
        track: "engineering" as const, order: 7,
        title: "مشروع التخرج — AI Builder",
        description: "المرحلة الختامية — طبّق كل ما تعلمته في مشروع تخرج حقيقي يثبت مهاراتك كـ AI Builder.",
        externalUrl: "https://www.youtube.com/watch?v=DDR4A8-MLQs",
        phase: "المتقدم",
        adminLocked: true,
        questions: [
          { text: "ما أهمية مشروع التخرج؟", type: "mcq" as const, options: ["إثبات المهارات لسوق العمل والعملاء","مجرد واجب إضافي","لا أهمية له","للحصول على شهادة فقط"], answer: "إثبات المهارات لسوق العمل والعملاء" },
          { text: "يجب أن يحل مشروع التخرج مشكلة حقيقية", type: "truefalse" as const, options: [], answer: "صح" },
          { text: "أين تنشر مشروع التخرج ليراه الناس؟", type: "mcq" as const, options: ["GitHub وLinkedIn وProductHunt","فقط على هاتفك","في مجلد محلي","عبر البريد الإلكتروني"], answer: "GitHub وLinkedIn وProductHunt" },
        ],
      },
    ];

    for (const stage of stages) {
      await ctx.db.insert("stages", stage);
    }

    return `✅ تم إضافة ${stages.length} مرحلة`;
  },
});
