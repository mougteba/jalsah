import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Zap, Code2, Cpu, ArrowLeft, CheckCircle, Quote } from "lucide-react";

const tracks = [
  { id:"ai", icon:Brain, title:"الذكاء الاصطناعي", sub:"AI Foundations", desc:"افهم كيف يعمل AI واستخدمه عملياً", stages:6 },
  { id:"automation", icon:Zap, title:"الأتمتة", sub:"AI Automation", desc:"أتمت مهامك بأدوات Make و n8n و Zapier", stages:6 },
  { id:"vibe", icon:Code2, title:"Vibe Coding", sub:"من الفكرة للتطبيق", desc:"ابنِ تطبيقات حقيقية بالذكاء الاصطناعي", stages:6 },
  { id:"engineering", icon:Cpu, title:"Vibe Engineering", sub:"المستوى المتقدم", desc:"حوّل نفسك إلى AI Builder محترف", stages:7 },
];

const stats = [
  { value:"300M", label:"وظيفة ستتأثر بالذكاء الاصطناعي بحلول 2030" },
  { value:"85%", label:"من تفاعلات خدمة العملاء تتم عبر AI" },
  { value:"80%", label:"من الشركات الكبرى تستخدم الذكاء الاصطناعي" },
  { value:"2029", label:"العام الذي يتوقع فيه كورزويل بلوغ AI قدرة الدماغ البشري" },
];

const quotes = [
  { text: "الذكاء الاصطناعي هو الكهرباء الجديدة — سيغير كل شيء نعرفه.", author: "أندرو نغ", role: "رائد الذكاء الاصطناعي" },
  { text: "الذكاء الاصطناعي قد يكون أعظم إنجاز في تاريخ البشرية.", author: "ستيفن هوكينغ", role: "عالم فيزياء نظرية" },
  { text: "من لا يتعلم الذكاء الاصطناعي اليوم، سيكون خارج سوق العمل غداً.", author: "سام ألتمان", role: "الرئيس التنفيذي لـ OpenAI" },
  { text: "أي تقنية تخلق ذكاءً فائقاً ستكون الأداة الأقوى لتغيير العالم.", author: "إيلون ماسك", role: "مؤسس Tesla و SpaceX" },
];

const features = [
  "مسارات تعليمية متدرجة ومنظمة",
  "اختبارات فهم بعد كل مرحلة",
  "تتبع تقدمك خطوة بخطوة",
  "محتوى عربي متخصص في AI",
  "مجتمع نشط من المتعلمين",
  "روابط لأفضل المصادر العالمية",
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/redirect");

  return (
    <main dir="rtl" style={{background:"#080808", minHeight:"100vh", fontFamily:"'IBM Plex Sans Arabic', sans-serif"}} className="flex flex-col">

      <header style={{borderBottom:"1px solid #141414", background:"#080808"}} className="px-5 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div style={{background:"#C9A84C", borderRadius:"8px"}} className="w-7 h-7 flex items-center justify-center">
            <Brain size={15} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{color:"#fff"}} className="font-bold text-lg">جلسة</span>
        </div>
        <Link href="/sign-in" style={{border:"1px solid #1e1e1e", color:"#666", borderRadius:"100px"}}
          className="text-xs px-4 py-2 hover:border-yellow-900 hover:text-yellow-600 transition-all">
          تسجيل الدخول
        </Link>
      </header>

      <section className="px-5 py-20 text-center flex flex-col items-center gap-6 relative">
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(ellipse at 50% 0%, #C9A84C08 0%, transparent 65%)",pointerEvents:"none"}} />
        <div style={{background:"#111", border:"1px solid #1e1e1e", color:"#C9A84C", borderRadius:"100px"}} className="text-xs px-4 py-1.5 flex items-center gap-2">
          <span style={{width:6,height:6,background:"#C9A84C",borderRadius:"50%",display:"inline-block"}} className="animate-pulse" />
          منصة تعليمية للشباب الموريتاني
        </div>
        <h1 style={{color:"#fff", letterSpacing:"-0.5px", lineHeight:"1.2"}} className="text-4xl font-bold">
          تعلّم الذكاء الاصطناعي<br />
          <span style={{color:"#C9A84C"}}>وطبّقه فوراً</span>
        </h1>
        <p style={{color:"#444", lineHeight:"1.9"}} className="text-sm max-w-xs">
          مسارات تعليمية احترافية في AI والأتمتة وVibe Engineering، مع اختبارات فهم وتتبع تقدمك خطوة بخطوة.
        </p>
        <div className="flex gap-3">
          <Link href="/sign-up" style={{background:"#C9A84C", color:"#000", borderRadius:"100px"}}
            className="px-7 py-3 font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
            ابدأ الآن <ArrowLeft size={14} />
          </Link>
          <Link href="/sign-in" style={{border:"1px solid #1e1e1e", color:"#555", borderRadius:"100px"}}
            className="px-7 py-3 text-sm hover:border-yellow-900 transition-colors">
            لديّ حساب
          </Link>
        </div>
      </section>

      <section className="px-5 py-10 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.value} style={{background:"#0e0e0e", border:"1px solid #161616", borderRadius:"16px"}} className="p-4 text-center space-y-1">
            <p style={{color:"#C9A84C"}} className="text-2xl font-bold">{s.value}</p>
            <p style={{color:"#444"}} className="text-xs leading-relaxed">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="px-5 py-10 space-y-3">
        <div className="mb-6">
          <p style={{color:"#C9A84C"}} className="text-xs uppercase tracking-widest mb-1">المسارات</p>
          <h2 style={{color:"#fff"}} className="text-xl font-bold">أربعة مسارات احترافية</h2>
          <p style={{color:"#444"}} className="text-xs mt-1">من المبتدئ حتى AI Builder محترف</p>
        </div>
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div key={track.id} style={{background:"#0e0e0e", border:"1px solid #161616", borderRadius:"16px"}} className="p-4 flex items-center gap-4">
              <div style={{background:"#141414", border:"1px solid #1e1e1e", borderRadius:"12px", padding:"10px"}}>
                <Icon size={20} color="#C9A84C" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p style={{color:"#fff"}} className="font-semibold text-sm">{track.title}</p>
                <p style={{color:"#C9A84C"}} className="text-xs">{track.sub}</p>
                <p style={{color:"#3a3a3a"}} className="text-xs mt-0.5">{track.desc}</p>
              </div>
              <p style={{color:"#2a2a2a"}} className="text-xs shrink-0">{track.stages} مراحل</p>
            </div>
          );
        })}
      </section>

      <section className="px-5 py-10 space-y-4">
        <div className="mb-6">
          <p style={{color:"#C9A84C"}} className="text-xs uppercase tracking-widest mb-1">ماذا يقولون</p>
          <h2 style={{color:"#fff"}} className="text-xl font-bold">أقوال رواد الذكاء الاصطناعي</h2>
        </div>
        {quotes.map((q, i) => (
          <div key={i} style={{background:"#0e0e0e", border:"1px solid #161616", borderRadius:"16px"}} className="p-5 space-y-3">
            <Quote size={16} color="#C9A84C44" />
            <p style={{color:"#888", lineHeight:"1.8"}} className="text-sm">"{q.text}"</p>
            <div className="flex items-center gap-2">
              <div style={{width:1, height:24, background:"#C9A84C"}} />
              <div>
                <p style={{color:"#C9A84C"}} className="text-xs font-semibold">{q.author}</p>
                <p style={{color:"#333"}} className="text-xs">{q.role}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 py-10">
        <div className="mb-6">
          <p style={{color:"#C9A84C"}} className="text-xs uppercase tracking-widest mb-1">لماذا جلسة</p>
          <h2 style={{color:"#fff"}} className="text-xl font-bold">كل ما تحتاجه في مكان واحد</h2>
        </div>
        <div style={{background:"#0e0e0e", border:"1px solid #161616", borderRadius:"20px"}} className="p-5 space-y-4">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CheckCircle size={15} color="#C9A84C" strokeWidth={2} className="shrink-0" />
              <p style={{color:"#666"}} className="text-sm">{f}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-10 space-y-4">
        <div className="mb-6">
          <p style={{color:"#C9A84C"}} className="text-xs uppercase tracking-widest mb-1">رحلتك</p>
          <h2 style={{color:"#fff"}} className="text-xl font-bold">كيف تعمل المنصة؟</h2>
        </div>
        {[
          { n:"01", title:"اختر مسارك", desc:"ابدأ من AI Foundations أو اختر المسار الذي يناسب مستواك" },
          { n:"02", title:"تعلّم من المصادر", desc:"كل مرحلة تحتوي على فيديو من أفضل المصادر العالمية" },
          { n:"03", title:"اختبر فهمك", desc:"أسئلة متعددة بعد كل مرحلة للتأكد من استيعابك" },
          { n:"04", title:"انتقل للمرحلة التالية", desc:"تتبع تقدمك وافتح المراحل واحدة تلو الأخرى" },
        ].map((step) => (
          <div key={step.n} style={{border:"1px solid #161616", borderRadius:"16px"}} className="p-4 flex items-start gap-4">
            <p style={{color:"#C9A84C22", fontWeight:800, fontSize:"32px", lineHeight:"1"}}>{step.n}</p>
            <div>
              <p style={{color:"#fff"}} className="font-semibold text-sm">{step.title}</p>
              <p style={{color:"#444"}} className="text-xs mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section style={{borderTop:"1px solid #141414"}} className="px-5 py-16 text-center space-y-5">
        <div style={{background:"#C9A84C", borderRadius:"8px", display:"inline-flex", padding:"10px"}} className="mb-2">
          <Brain size={24} color="#000" strokeWidth={2} />
        </div>
        <h2 style={{color:"#fff"}} className="text-2xl font-bold">جاهز تبدأ رحلتك؟</h2>
        <p style={{color:"#444"}} className="text-sm">انضم الآن وابدأ مسارك التعليمي مجاناً</p>
        <Link href="/sign-up" style={{background:"#C9A84C", color:"#000", borderRadius:"100px", display:"inline-flex"}}
          className="px-10 py-3.5 font-bold text-sm items-center gap-2 hover:opacity-90 transition-opacity">
          ابدأ الآن <ArrowLeft size={14} />
        </Link>
      </section>

      <footer style={{borderTop:"1px solid #0e0e0e"}} className="px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{background:"#C9A84C", borderRadius:"6px"}} className="w-5 h-5 flex items-center justify-center">
            <Brain size={11} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{color:"#2a2a2a"}} className="text-xs font-bold">جلسة</span>
        </div>
        <span style={{color:"#2a2a2a"}} className="text-xs">© {new Date().getFullYear()} — جميع الحقوق محفوظة</span>
      </footer>
    </main>
  );
}
