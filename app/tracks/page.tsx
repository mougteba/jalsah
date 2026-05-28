"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

const tracks = [
  {
    id: "ai",
    title: "الذكاء الاصطناعي",
    subtitle: "AI",
    description: "افهم كيف يعمل الذكاء الاصطناعي وكيف تستخدمه عملياً",
    icon: "🤖",
    stages: 6,
  },
  {
    id: "automation",
    title: "الأتمتة بالذكاء الاصطناعي",
    subtitle: "AI Automation",
    description: "تعلم كيف تؤتمت مهامك باستخدام أدوات AI الحديثة",
    icon: "⚡",
    stages: 6,
  },
  {
    id: "vibe",
    title: "Vibe Coding → Engineering",
    subtitle: "Vibe Coding & Engineering",
    description: "ابنِ مشاريع حقيقية بالذكاء الاصطناعي من الصفر للنشر",
    icon: "🚀",
    stages: 6,
  },
];

export default function TracksPage() {
  const { user } = useUser();
  const progress = useQuery(api.progress.getUserProgress, { userId: user?.id || "" });

  const getTrackProgress = (trackId: string) => {
    if (!progress) return 0;
    return progress.filter((p) => p.completed).length;
  };

  return (
    <div style={{background:"#0a0a0a", minHeight:"100vh"}} dir="rtl" className="pb-10">
      <header style={{background:"#0a0a0a", borderBottom:"1px solid #1a1a1a"}} className="px-6 py-4 sticky top-0 z-10">
        <h1 style={{color:"#C9A84C"}} className="text-xl font-bold text-center tracking-wide">جلسة</h1>
      </header>

      <div className="px-4 pt-8 space-y-3">
        <h2 className="text-2xl font-bold text-white mb-1">المسارات</h2>
        <p className="text-gray-500 text-sm mb-6">اختر مسارك وابدأ رحلة التعلم</p>

        {tracks.map((track) => {
          const done = getTrackProgress(track.id);
          const percent = Math.round((done / track.stages) * 100);

          return (
            <Link key={track.id} href={`/tracks/${track.id}`}>
              <div style={{background:"#111", border:"1px solid #222"}}
                className="rounded-2xl p-5 space-y-4 hover:border-yellow-700 transition-colors mb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{track.icon}</span>
                    <div>
                      <p className="font-bold text-white">{track.title}</p>
                      <p style={{color:"#C9A84C"}} className="text-xs">{track.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-gray-600 text-xs">{track.stages} مراحل</span>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed">{track.description}</p>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">التقدم</span>
                    <span style={{color:"#C9A84C"}}>{percent}%</span>
                  </div>
                  <div style={{background:"#1a1a1a"}} className="w-full h-1.5 rounded-full overflow-hidden">
                    <div style={{width:`${percent}%`, background:"#C9A84C"}} className="h-full rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
