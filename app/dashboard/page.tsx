"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";
import { Brain, Zap, Code2, Cpu, Home, MessageSquare, Settings } from "lucide-react";

const tracks = [
  { id:"ai",          title:"الذكاء الاصطناعي",          sub:"AI Foundations",     Icon: Brain },
  { id:"automation",  title:"الأتمتة بالذكاء الاصطناعي", sub:"AI Automation",      Icon: Zap   },
  { id:"vibe",        title:"Vibe Coding",               sub:"من الفكرة للتطبيق", Icon: Code2 },
  { id:"engineering", title:"Vibe Engineering",          sub:"المستوى المتقدم",   Icon: Cpu   },
];

function TracksPage({ userId }: { userId: string }) {
  const allStages    = useQuery(api.stages.getAllStages);
  const allProgress  = useQuery(api.progress.getUserProgress, { userId });

  const getTrackStats = (trackId: string) => {
    const trackStages = allStages?.filter(s => s.track === trackId) || [];
    const total = trackStages.length;
    if (!total) return { total: 0, percent: 0 };
    const completedIds = new Set(
      allProgress?.filter(p => p.completed).map(p => p.stageId) || []
    );
    const done = trackStages.filter(s => completedIds.has(s._id)).length;
    return { total, percent: Math.round((done / total) * 100) };
  };

  return (
    <div className="px-4 pt-6 space-y-3 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">مساراتك</h2>
        <p style={{color:"#444"}} className="text-sm mt-1">تابع تقدمك في كل مسار</p>
      </div>
      {tracks.map((track) => {
        const { total, percent } = getTrackStats(track.id);
        return (
          <Link key={track.id} href={`/tracks/${track.id}`}>
            <div style={{background:"#111", border:"1px solid #1e1e1e"}}
              className="rounded-2xl p-5 space-y-3 mb-3 hover:border-yellow-900 transition-colors">
              <div className="flex items-center gap-3">
                <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                  <track.Icon size={18} color="#C9A84C" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{track.title}</p>
                  <p style={{color:"#C9A84C"}} className="text-xs">{track.sub}</p>
                </div>
                <span style={{color:"#333"}} className="text-xs mr-auto">{total} مراحل</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{color:"#333"}}>التقدم</span>
                  <span style={{color:"#C9A84C"}}>{percent}%</span>
                </div>
                <div style={{background:"#1a1a1a"}} className="w-full h-1.5 rounded-full overflow-hidden">
                  <div style={{width:`${percent}%`, background:"#C9A84C"}}
                    className="h-full rounded-full transition-all" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ExperiencesPage() {
  const comments = useQuery(api.comments.getAllComments);
  const allStages = useQuery(api.stages.getAllStages);

  const stageMap = Object.fromEntries(
    (allStages || []).map(s => [s._id, { title: s.title, track: s.track }])
  );

  const trackNames: Record<string, string> = {
    ai: "الذكاء الاصطناعي", automation: "الأتمتة",
    vibe: "Vibe Coding", engineering: "Vibe Engineering",
  };

  return (
    <div className="px-4 pt-6 space-y-3 pb-4">
      <div>
        <h2 className="text-xl font-bold text-white">تجارب المتعلمين</h2>
        <p style={{color:"#444"}} className="text-sm mt-1">ما يقوله أعضاء المجتمع</p>
      </div>
      {!comments?.length && (
        <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-10 text-center">
          <p style={{color:"#333"}} className="text-sm">لا توجد تجارب بعد</p>
        </div>
      )}
      {comments?.map((c) => {
        const stage = stageMap[c.stageId];
        return (
          <div key={c._id} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-4 space-y-3">
            {stage && (
              <Link href={`/tracks/${stage.track}/${c.stageId}`} className="flex items-center gap-2 flex-wrap">
                <span style={{background:"#0e0e0e", border:"1px solid #1a1500", color:"#C9A84C"}}
                  className="text-xs px-2 py-1 rounded-lg">
                  {trackNames[stage.track]}
                </span>
                <span style={{color:"#444"}} className="text-xs">←</span>
                <span style={{color:"#666"}} className="text-xs">{stage.title}</span>
              </Link>
            )}
            <div className="flex items-center gap-2">
              {c.userImage
                ? <img src={c.userImage} className="w-8 h-8 rounded-full object-cover" alt="" />
                : <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
                    className="w-8 h-8 rounded-full flex items-center justify-center">
                    <span style={{color:"#C9A84C"}} className="text-xs font-bold">{c.userName?.[0]}</span>
                  </div>
              }
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">{c.userName}</p>
              </div>
              <p style={{color:"#333"}} className="text-xs">
                {new Date(c.createdAt).toLocaleDateString("ar")}
              </p>
            </div>
            <p style={{color:"#666", lineHeight:"1.8"}} className="text-sm">{c.content}</p>
          </div>
        );
      })}
    </div>
  );
}

function SettingsPage({ user, signOut }: { user: any; signOut: any }) {
  const [name, setName] = useState(user?.fullName || "");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    const parts = name.trim().split(" ");
    await user?.update({ firstName: parts[0], lastName: parts.slice(1).join(" ") });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 pt-6 space-y-4 pb-4">
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5">
        <div className="flex items-center gap-4">
          {user?.imageUrl
            ? <img src={user.imageUrl} className="w-14 h-14 rounded-full object-cover"
                style={{border:"2px solid #C9A84C"}} alt="" />
            : <div style={{background:"#141414", border:"2px solid #C9A84C"}}
                className="w-14 h-14 rounded-full flex items-center justify-center">
                <span style={{color:"#C9A84C"}} className="text-xl font-bold">{user?.fullName?.[0]}</span>
              </div>
          }
          <div>
            <p className="font-bold text-white">{user?.fullName}</p>
            <p style={{color:"#444"}} className="text-xs mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
            <p style={{color:"#333"}} className="text-xs mt-0.5">
              انضم {new Date(user?.createdAt).toLocaleDateString("ar")}
            </p>
          </div>
        </div>
      </div>
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5 space-y-3">
        <p style={{color:"#C9A84C"}} className="text-xs font-semibold uppercase tracking-wider">تعديل الاسم</p>
        <input value={name} onChange={(e) => setName(e.target.value)}
          style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none" />
        <button onClick={handleSave}
          style={{background: saved ? "#0d1a0d" : "#C9A84C", color: saved ? "#4ade80" : "#000"}}
          className="w-full py-3 rounded-xl text-sm font-semibold">
          {saved ? "✓ تم الحفظ" : "حفظ"}
        </button>
      </div>
      <button onClick={() => signOut({ redirectUrl: "/" })}
        style={{border:"1px solid #2a1a1a", color:"#ef4444"}}
        className="w-full py-3 rounded-xl text-sm bg-transparent">
        تسجيل الخروج
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [page, setPage] = useState<"tracks"|"experiences"|"settings">("tracks");

  const navItems = [
    { id:"tracks",      Icon: Home,          label:"المسارات"  },
    { id:"experiences", Icon: MessageSquare, label:"التجارب"   },
    { id:"settings",    Icon: Settings,      label:"إعدادات"   },
  ];

  return (
    <main style={{background:"#080808", minHeight:"100vh"}} dir="rtl" className="pb-20">
      <header style={{background:"#080808", borderBottom:"1px solid #141414"}}
        className="px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{background:"#C9A84C", borderRadius:"6px"}}
            className="w-6 h-6 flex items-center justify-center">
            <Brain size={13} color="#000" strokeWidth={2.5} />
          </div>
          <h1 style={{color:"#C9A84C"}} className="text-lg font-bold tracking-wide">جلسة</h1>
        </div>
        {user?.imageUrl
          ? <img src={user.imageUrl} className="w-8 h-8 rounded-full object-cover"
              style={{border:"1px solid #C9A84C44"}} alt="" />
          : <div style={{background:"#141414", border:"1px solid #C9A84C44"}}
              className="w-8 h-8 rounded-full flex items-center justify-center">
              <span style={{color:"#C9A84C"}} className="text-xs font-bold">{user?.fullName?.[0]}</span>
            </div>
        }
      </header>

      {page === "tracks"      && <TracksPage userId={user?.id || ""} />}
      {page === "experiences" && <ExperiencesPage />}
      {page === "settings"    && <SettingsPage user={user} signOut={signOut} />}

      <nav style={{background:"#0a0a0a", borderTop:"1px solid #141414"}}
        className="fixed bottom-0 left-0 right-0 flex justify-around py-3 z-10">
        {navItems.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setPage(id as any)}
            className="flex flex-col items-center gap-1 text-xs transition-all"
            style={{color: page === id ? "#C9A84C" : "#333"}}>
            <Icon size={20} strokeWidth={page === id ? 2 : 1.5} />
            {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
