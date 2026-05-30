"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { useState } from "react";

const tracks = [
  { id:"ai",          title:"الذكاء الاصطناعي",          sub:"AI Foundations"     },
  { id:"automation",  title:"الأتمتة بالذكاء الاصطناعي", sub:"AI Automation"      },
  { id:"vibe",        title:"Vibe Coding",               sub:"من الفكرة للتطبيق" },
  { id:"engineering", title:"Vibe Engineering",          sub:"المستوى المتقدم"   },
];

const ADMIN_ID = "admin";

function TracksPage({ userId }: { userId: string }) {
  const allStages   = useQuery(api.stages.getAllStages);
  const allProgress = useQuery(api.progress.getUserProgress, { userId });

  const getTrackStats = (trackId: string) => {
    const trackStages = allStages?.filter(s => s.track === trackId) || [];
    const total = trackStages.length;
    if (!total) return { total: 0, percent: 0 };
    const completedIds = new Set(allProgress?.filter(p => p.completed).map(p => p.stageId) || []);
    const done = trackStages.filter(s => completedIds.has(s._id)).length;
    return { total, percent: Math.round((done / total) * 100) };
  };

  const trackIcons: Record<string, React.JSX.Element> = {
    ai:          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V12h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1v1a3 3 0 0 1-6 0v-1H7a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2V9.5C7.8 8.8 7 7.5 7 6a4 4 0 0 1 4-4h1z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/></svg>,
    automation:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    vibe:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    engineering: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
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
                  {trackIcons[track.id]}
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
  const stageMap = Object.fromEntries((allStages || []).map(s => [s._id, { title: s.title, track: s.track }]));
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
                  className="text-xs px-2 py-1 rounded-lg">{trackNames[stage.track]}</span>
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
              <p style={{color:"#333"}} className="text-xs">{new Date(c.createdAt).toLocaleDateString("ar")}</p>
            </div>
            <p style={{color:"#666", lineHeight:"1.8"}} className="text-sm">{c.content}</p>
          </div>
        );
      })}
    </div>
  );
}

function MessagesPage({ userId, userName, userImage }: { userId: string; userName: string; userImage?: string }) {
  const conversation = useQuery(api.messages.getConversation, { userId, otherUserId: ADMIN_ID });
  const sendMessage = useMutation(api.messages.sendMessage);
  const markAsRead = useMutation(api.messages.markAsRead);
  const [text, setText] = useState("");

  useState(() => {
    if (userId) markAsRead({ userId, fromId: ADMIN_ID });
  });

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ fromId: userId, toId: ADMIN_ID, fromName: userName, fromImage: userImage, content: text });
    setText("");
  };

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">الرسائل</h2>
        <p style={{color:"#444"}} className="text-sm mt-1">محادثتك مع الإدارة</p>
      </div>

      <div style={{background:"#111", border:"1px solid #1e1e1e", minHeight:"300px"}}
        className="rounded-2xl p-4 space-y-3 flex flex-col">
        {!conversation?.length && (
          <div className="flex-1 flex items-center justify-center">
            <p style={{color:"#333"}} className="text-sm">لا توجد رسائل بعد — ابدأ المحادثة</p>
          </div>
        )}
        {conversation?.map((msg) => {
          const isMe = msg.fromId === userId;
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-start" : "justify-end"}`}>
              <div style={{
                background: isMe ? "#1a1500" : "#141414",
                border: isMe ? "1px solid #3a3000" : "1px solid #1e1e1e",
                maxWidth: "80%",
              }} className="rounded-2xl px-4 py-2.5 space-y-1">
                <p className="text-sm text-gray-200">{msg.content}</p>
                <p style={{color:"#444"}} className="text-xs">{new Date(msg.createdAt).toLocaleTimeString("ar")}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-4 space-y-3">
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك..."
          style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none min-h-16 resize-none placeholder-gray-700" />
        <button onClick={handleSend} disabled={!text.trim()}
          style={{background: text.trim() ? "#C9A84C" : "#1a1a1a", color: text.trim() ? "#000" : "#444"}}
          className="w-full py-2.5 rounded-xl text-sm font-semibold">
          إرسال
        </button>
      </div>
    </div>
  );
}

function SettingsPage({ user, signOut }: { user: any; signOut: any }) {
  const [name, setName] = useState(user?.fullName || "");
  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    const parts = name.trim().split(" ");
    await user?.update({ firstName: parts[0], lastName: parts.slice(1).join(" ") });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div className="px-4 pt-6 space-y-4 pb-4">
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5">
        <div className="flex items-center gap-4">
          {user?.imageUrl
            ? <img src={user.imageUrl} className="w-14 h-14 rounded-full object-cover" style={{border:"2px solid #C9A84C"}} alt="" />
            : <div style={{background:"#141414", border:"2px solid #C9A84C"}}
                className="w-14 h-14 rounded-full flex items-center justify-center">
                <span style={{color:"#C9A84C"}} className="text-xl font-bold">{user?.fullName?.[0]}</span>
              </div>
          }
          <div>
            <p className="font-bold text-white">{user?.fullName}</p>
            <p style={{color:"#444"}} className="text-xs mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
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
        className="w-full py-3 rounded-xl text-sm bg-transparent">تسجيل الخروج</button>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [page, setPage] = useState<"tracks"|"experiences"|"settings">("tracks");
  const [showMessages, setShowMessages] = useState(false);
  const unreadCount = useQuery(api.messages.getUnreadCount, { userId: user?.id || "" });

  const navItems = [
    { id:"tracks",      label:"المسارات",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    { id:"experiences", label:"التجارب",
      icon: (active: boolean) => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
  ];

  return (
    <main style={{background:"#080808", minHeight:"100vh"}} dir="rtl" className="pb-20">
      <header style={{background:"#080808", borderBottom:"1px solid #141414"}}
        className="px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div style={{background:"#C9A84C", borderRadius:"6px"}} className="w-6 h-6 flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.87A2.5 2.5 0 0 1 9.5 2"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.87A2.5 2.5 0 0 0 14.5 2"/></svg>
          </div>
          <h1 style={{color:"#C9A84C"}} className="text-lg font-bold tracking-wide">جلسة</h1>
        </div>

        <button onClick={() => setShowMessages(true)} className="relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke={showMessages ? "#C9A84C" : "#444"} strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {unreadCount && unreadCount > 0 ? (
            <span style={{background:"#ef4444", color:"#fff", fontSize:"9px", minWidth:"16px", height:"16px"}}
              className="absolute -top-1 -left-1 rounded-full flex items-center justify-center px-1 font-bold">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </header>

      {page === "tracks"      && <TracksPage userId={user?.id || ""} />}
      {page === "experiences" && <ExperiencesPage />}
      
      {page === "settings"    && <SettingsPage user={user} signOut={signOut} />}

      {showMessages && (
        <div style={{background:"#080808", position:"fixed", inset:0, zIndex:50}} dir="rtl">
          <div style={{background:"#080808", borderBottom:"1px solid #141414"}} className="px-6 py-4 flex items-center gap-3">
            <button onClick={() => setShowMessages(false)} style={{color:"#C9A84C"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </button>
            <p style={{color:"#C9A84C"}} className="font-bold">الرسائل</p>
          </div>
          <MessagesPage userId={user?.id || ""} userName={user?.fullName || "مجهول"} userImage={user?.imageUrl} />
        </div>
      )}
      <nav style={{background:"#0a0a0a", borderTop:"1px solid #141414"}}
        className="fixed bottom-0 left-0 right-0 flex justify-around py-2 z-10">
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setPage(id as any)}
            className="flex flex-col items-center gap-0.5 transition-all"
            style={{color: page === id ? "#C9A84C" : "#333"}}>
            {icon(page === id)}
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}
