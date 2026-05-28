"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle, Lock, Bot, Zap, Code2, Rocket, MessageSquare } from "lucide-react";
import { useState } from "react";

const trackInfo: Record<string, { title: string; Icon: any; sub: string }> = {
  ai:          { title: "الذكاء الاصطناعي", Icon: Bot,    sub: "AI Foundations" },
  automation:  { title: "الأتمتة",          Icon: Zap,    sub: "AI Automation" },
  vibe:        { title: "Vibe Coding",      Icon: Code2,  sub: "من الفكرة للتطبيق" },
  engineering: { title: "Vibe Engineering", Icon: Rocket, sub: "المستوى المتقدم" },
};

function ExperiencesTab({ track }: { track: string }) {
  const allStages  = useQuery(api.stages.getStagesByTrack, { track: track as any });
  const allComments = useQuery(api.comments.getAllComments);

  const stageMap = Object.fromEntries(
    (allStages || []).map(s => [s._id, s.title])
  );
  const trackStageIds = new Set((allStages || []).map(s => s._id));
  const filtered = (allComments || []).filter(c => trackStageIds.has(c.stageId));

  return (
    <div className="px-4 pt-4 space-y-3">
      {!filtered.length && (
        <div className="text-center text-gray-600 py-20">لا توجد تجارب في هذا المسار بعد</div>
      )}
      {filtered.map((c) => (
        <div key={c._id} style={{background:"#111", border:"1px solid #222"}} className="rounded-2xl p-4 space-y-2">
          <div style={{background:"#0e0e0e", border:"1px solid #1a1500"}}
            className="rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
            <span style={{color:"#C9A84C"}} className="text-xs font-medium">
              {stageMap[c.stageId] || ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {c.userImage
              ? <img src={c.userImage} className="w-7 h-7 rounded-full object-cover" alt="" />
              : <div style={{background:"#1a1500"}} className="w-7 h-7 rounded-full flex items-center justify-center">
                  <span style={{color:"#C9A84C"}} className="text-xs font-bold">{c.userName?.[0]}</span>
                </div>
            }
            <p className="text-xs font-semibold text-gray-300">{c.userName}</p>
            <p className="text-xs text-gray-600 mr-auto">
              {new Date(c.createdAt).toLocaleDateString("ar")}
            </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">{c.content}</p>
        </div>
      ))}
    </div>
  );
}

export default function TrackPage() {
  const { user } = useUser();
  const params = useParams();
  const track = params.track as "ai"|"automation"|"vibe"|"engineering";
  const [tab, setTab] = useState<"stages"|"experiences">("stages");

  const stages   = useQuery(api.stages.getStagesByTrack, { track });
  const progress = useQuery(api.progress.getUserProgress, { userId: user?.id || "" });

  const isCompleted = (stageId: string) =>
    progress?.some((p) => p.stageId === stageId && p.completed);

  const isLocked = (stage: any, index: number) => {
    if (stage.adminLocked) return true;
    if (track === "engineering" && stage.adminLocked !== false) return true;
    if (index === 0) return false;
    const prevStage = stages?.[index - 1];
    if (!prevStage) return true;
    return !isCompleted(prevStage._id);
  };

  const info = trackInfo[track] || { title: "", Icon: Bot, sub: "" };
  const completedCount = stages?.filter(s => isCompleted(s._id)).length || 0;
  const total = stages?.length || 0;

  return (
    <div style={{background:"#0a0a0a", minHeight:"100vh"}} dir="rtl" className="pb-10">
      <header style={{background:"#0a0a0a", borderBottom:"1px solid #1a1a1a"}}
        className="px-6 py-4 sticky top-0 z-10 flex items-center gap-3">
        <Link href="/dashboard" style={{color:"#C9A84C"}}>
          <ArrowRight size={18} />
        </Link>
        <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          <info.Icon size={15} color="#C9A84C" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-white font-bold text-sm">{info.title}</h1>
          <p style={{color:"#C9A84C"}} className="text-xs">{info.sub}</p>
        </div>
        <span style={{color:"#333"}} className="text-xs">{completedCount}/{total}</span>
      </header>

      {total > 0 && (
        <div className="px-4 pt-4">
          <div style={{background:"#1a1a1a"}} className="w-full h-1 rounded-full overflow-hidden">
            <div style={{width:`${Math.round((completedCount/total)*100)}%`, background:"#C9A84C"}}
              className="h-full rounded-full transition-all" />
          </div>
        </div>
      )}

      <div className="px-4 pt-4 flex gap-2">
        <button onClick={() => setTab("stages")}
          style={tab === "stages"
            ? {background:"#C9A84C", color:"#000"}
            : {border:"1px solid #222", color:"#555"}}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all">
          المراحل
        </button>
        <button onClick={() => setTab("experiences")}
          style={tab === "experiences"
            ? {background:"#C9A84C", color:"#000"}
            : {border:"1px solid #222", color:"#555"}}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1">
          <MessageSquare size={13} />
          تجارب
        </button>
      </div>

      {tab === "experiences" && <ExperiencesTab track={track} />}

      {tab === "stages" && (
        <div className="px-4 pt-4 space-y-3">
          {stages?.length === 0 && (
            <div className="text-center text-gray-600 py-20">لا توجد مراحل بعد</div>
          )}
          {stages?.map((stage, index) => {
            const completed = isCompleted(stage._id);
            const locked = isLocked(stage, index);
            return (
              <div key={stage._id}>
                {stage.phase && (index === 0 || stages[index-1]?.phase !== stage.phase) && (
                  <div className="flex items-center gap-3 my-4">
                    <div style={{background:"#1a1a1a"}} className="flex-1 h-px" />
                    <span style={{color:"#C9A84C", border:"1px solid #2a2500", background:"#0e0e00"}}
                      className="text-xs px-3 py-1 rounded-full">{stage.phase}</span>
                    <div style={{background:"#1a1a1a"}} className="flex-1 h-px" />
                  </div>
                )}
                <Link href={locked ? "#" : `/tracks/${track}/${stage._id}`}>
                  <div style={{
                    background: completed ? "#0d1a0d" : "#111",
                    border: completed ? "1px solid #1a3a1a" : locked ? "1px solid #1a1a1a" : "1px solid #222",
                    opacity: locked ? 0.5 : 1,
                  }} className="rounded-2xl p-5 transition-all">
                    <div className="flex items-center gap-3">
                      <div style={{
                        background: completed ? "#1a3a1a" : locked ? "#1a1a1a" : "#141414",
                        border: completed ? "1px solid #2a5a2a" : "1px solid #1e1e1e",
                      }} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                        {completed
                          ? <CheckCircle size={16} color="#4ade80" />
                          : locked
                          ? <Lock size={14} color="#444" />
                          : <span style={{color:"#C9A84C"}} className="text-sm font-bold">{index + 1}</span>
                        }
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${locked ? "text-gray-600" : "text-white"}`}>
                          {stage.title}
                        </p>
                        <p style={{color:"#333"}} className="text-xs mt-0.5 line-clamp-1">{stage.description}</p>
                      </div>
                      {completed && <CheckCircle size={14} color="#4ade80" />}
                      {!locked && !completed && <ArrowRight size={14} color="#555" />}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
