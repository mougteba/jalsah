"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export default function StagePage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const track = params.track as string;
  const stageId = params.stageId as Id<"stages">;

  const stages = useQuery(api.stages.getStagesByTrack, { track: track as any });
  const stage = stages?.find((s) => s._id === stageId);
  const progress = useQuery(api.progress.getUserProgress, { userId: user?.id || "" });
  const comments = useQuery(api.comments.getComments, { stageId });
  const completeStage = useMutation(api.progress.completeStage);
  const addComment = useMutation(api.comments.addComment);
  const deleteComment = useMutation(api.comments.deleteComment);
  const isAdmin = user?.emailAddresses[0]?.emailAddress === "almjtbymhmdalmkhtar@gmail.com";

  const [tab, setTab] = useState<"content" | "quiz" | "comments">("content");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [openResults, setOpenResults] = useState<Record<number, { correct: boolean; feedback: string }>>({});
  const [comment, setComment] = useState("");

  const isCompleted = progress?.some((p) => p.stageId === stageId && p.completed);

  const handleSubmit = async () => {
    if (!stage) return;
    setSubmitting(true);
    let correct = 0;
    const newOpenResults: Record<number, { correct: boolean; feedback: string }> = {};

    for (let i = 0; i < stage.questions.length; i++) {
      const q = stage.questions[i];
      if (q.type === "open") {
        try {
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 200,
              messages: [{
                role: "user",
                content: `أنت مصحح اختبار. السؤال: "${q.text}". الإجابة النموذجية: "${q.answer}". إجابة الطالب: "${answers[i] || ""}". هل الإجابة صحيحة أو قريبة من الصحيحة؟ أجب بـ JSON فقط: {"correct": true/false, "feedback": "تعليق قصير"}`
              }]
            })
          });
          const data = await res.json();
          const text = data.content?.[0]?.text || '{"correct":false,"feedback":"تعذر التقييم"}';
          const clean = text.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          newOpenResults[i] = parsed;
          if (parsed.correct) correct++;
        } catch {
          newOpenResults[i] = { correct: false, feedback: "تعذر التقييم" };
        }
      } else {
        if (answers[i] === q.answer) correct++;
      }
    }

    const sc = Math.round((correct / stage.questions.length) * 100);
    setOpenResults(newOpenResults);
    setScore(sc);
    setSubmitted(true);
    setSubmitting(false);
    if (sc >= 60) {
      await completeStage({ userId: user?.id || "", stageId, score: sc });
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addComment({
      stageId,
      userId: user?.id || "",
      userName: user?.fullName || "مجهول",
      userImage: user?.imageUrl,
      content: comment,
    });
    setComment("");
  };

  if (!stage) return (
    <div style={{background:"#0a0a0a", minHeight:"100vh"}} className="flex items-center justify-center">
      <p className="text-gray-600">جارٍ التحميل...</p>
    </div>
  );

  const steps = stage.steps && stage.steps.length > 0
    ? stage.steps
    : stage.externalUrl
      ? [{ title: "ابدأ التعلم", url: stage.externalUrl }]
      : [];

  return (
    <div style={{background:"#0a0a0a", minHeight:"100vh"}} dir="rtl" className="pb-10">
      <header style={{background:"#0a0a0a", borderBottom:"1px solid #1a1a1a"}} className="px-6 py-4 sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => router.back()} style={{color:"#C9A84C"}} className="text-sm">← رجوع</button>
        <h1 className="text-white font-bold text-sm flex-1 line-clamp-1">{stage.title}</h1>
        {isCompleted && <span className="text-xs text-green-500">✓ مكتمل</span>}
      </header>

      <div className="flex gap-0 px-4 pt-4">
        {["content","quiz","comments"].map((t) => (
          <button key={t} onClick={() => setTab(t as any)}
            style={{
              borderBottom: tab === t ? "2px solid #C9A84C" : "2px solid transparent",
              color: tab === t ? "#C9A84C" : "#555",
            }}
            className="flex-1 py-2 text-xs font-medium transition-all">
            {t === "content" ? "المحتوى" : t === "quiz" ? "اختبار الفهم" : "النقاش"}
          </button>
        ))}
      </div>

      <div className="px-4 pt-4">
        {tab === "content" && (
          <div className="space-y-4">
            <div style={{background:"#111", border:"1px solid #222"}} className="rounded-2xl p-5 space-y-3">
              <p style={{color:"#C9A84C"}} className="text-xs font-semibold uppercase tracking-wider">الوصف</p>
              <p className="text-gray-300 text-sm leading-relaxed">{stage.description}</p>
            </div>
            <div className="space-y-3">
              <p style={{color:"#C9A84C"}} className="text-xs font-semibold px-1">
                {steps.length > 1 ? `الخطوات (${steps.length})` : "المحتوى"}
              </p>
              {steps.map((step, i) => (
                <a key={i} href={step.url} target="_blank" rel="noopener noreferrer"
                  style={{background:"#111", border:"1px solid #222"}}
                  className="flex items-center gap-4 w-full p-4 rounded-2xl transition-all hover:border-yellow-800">
                  <div style={{background:"#1a1500", border:"1px solid #3a3000", color:"#C9A84C", minWidth:32, height:32}}
                    className="rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-white text-sm font-medium">{step.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{step.url}</p>
                  </div>
                  <span style={{color:"#C9A84C"}} className="text-lg shrink-0">←</span>
                </a>
              ))}
            </div>
            <button onClick={() => setTab("quiz")}
              style={{border:"1px solid #3a3000", color:"#C9A84C"}}
              className="w-full py-3 rounded-2xl text-sm">
              انتقل للاختبار ←
            </button>
          </div>
        )}

        {tab === "quiz" && (
          <div className="space-y-4">
            {isCompleted && (
              <div style={{background:"#0d1a0d", border:"1px solid #1a3a1a"}} className="rounded-xl p-4 text-center">
                <p className="text-green-400 font-bold">✓ أكملت هذه المرحلة</p>
                <p className="text-gray-500 text-xs mt-1">يمكنك الانتقال للمرحلة التالية</p>
              </div>
            )}

            {!submitted ? (
              <>
                {stage.questions.map((q, i) => (
                  <div key={i} style={{background:"#111", border:"1px solid #222"}} className="rounded-2xl p-4 space-y-3">
                    <p className="text-white text-sm font-medium">{i + 1}. {q.text}</p>

                    {q.type === "open" ? (
                      <textarea
                        value={answers[i] || ""}
                        onChange={(e) => setAnswers({...answers, [i]: e.target.value})}
                        placeholder="اكتب إجابتك هنا..."
                        style={{background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#f5f5f5"}}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none min-h-20 resize-none placeholder-gray-600" />
                    ) : q.type === "truefalse" ? (
                      <div className="flex gap-2">
                        {["صح", "خطأ"].map((opt) => (
                          <button key={opt} onClick={() => setAnswers({...answers, [i]: opt})}
                            style={{
                              background: answers[i] === opt ? "#C9A84C" : "#1a1a1a",
                              color: answers[i] === opt ? "#000" : "#888",
                              border: "1px solid #2a2a2a",
                            }}
                            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {q.options?.map((opt) => (
                          <button key={opt} onClick={() => setAnswers({...answers, [i]: opt})}
                            style={{
                              background: answers[i] === opt ? "#1a1500" : "#1a1a1a",
                              color: answers[i] === opt ? "#C9A84C" : "#888",
                              border: answers[i] === opt ? "1px solid #C9A84C" : "1px solid #2a2a2a",
                            }}
                            className="w-full py-2.5 px-4 rounded-xl text-sm text-right transition-all">
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button onClick={handleSubmit}
                  disabled={Object.keys(answers).length < stage.questions.length || submitting}
                  style={{
                    background: Object.keys(answers).length < stage.questions.length || submitting ? "#1a1a1a" : "#C9A84C",
                    color: Object.keys(answers).length < stage.questions.length || submitting ? "#444" : "#000",
                  }}
                  className="w-full py-4 rounded-2xl font-bold text-sm transition-all">
                  {submitting ? "جاري التصحيح..." : "تحقق من إجاباتي"}
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div style={{
                  background: score >= 60 ? "#0d1a0d" : "#1a0d0d",
                  border: score >= 60 ? "1px solid #1a3a1a" : "1px solid #3a1a1a",
                }} className="rounded-2xl p-6 text-center space-y-2">
                  <p className="text-4xl font-bold" style={{color: score >= 60 ? "#4ade80" : "#ef4444"}}>
                    {score}%
                  </p>
                  <p className="text-sm" style={{color: score >= 60 ? "#4ade80" : "#ef4444"}}>
                    {score >= 60 ? "أحسنت! انتقلت للمرحلة التالية ✓" : "لم تصل للحد الأدنى (60%). حاول مجدداً"}
                  </p>
                </div>

                {stage.questions.map((q, i) => (
                  <div key={i} style={{background:"#111", border:"1px solid #222"}} className="rounded-xl p-4 space-y-2">
                    <p className="text-white text-sm">{i + 1}. {q.text}</p>
                    {q.type === "open" ? (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400">إجابتك: <span className="text-gray-200">{answers[i] || "—"}</span></p>
                        {openResults[i] && (
                          <div style={{
                            background: openResults[i].correct ? "#0d1a0d" : "#1a0d0d",
                            border: openResults[i].correct ? "1px solid #1a3a1a" : "1px solid #3a1a1a",
                          }} className="rounded-lg px-3 py-2">
                            <p className="text-xs" style={{color: openResults[i].correct ? "#4ade80" : "#ef4444"}}>
                              {openResults[i].correct ? "✓ صحيح" : "✗ غير صحيح"} — {openResults[i].feedback}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">الإجابة النموذجية: <span style={{color:"#C9A84C"}}>{q.answer}</span></p>
                      </div>
                    ) : (
                      <div className="flex gap-2 text-xs">
                        <span className="text-gray-500">إجابتك:</span>
                        <span style={{color: answers[i] === q.answer ? "#4ade80" : "#ef4444"}}>
                          {answers[i] || "—"} {answers[i] === q.answer ? "✓" : "✗"}
                        </span>
                        {answers[i] !== q.answer && (
                          <span className="text-gray-500 mr-2">الصحيحة: <span style={{color:"#C9A84C"}}>{q.answer}</span></span>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {score < 60 && (
                  <button onClick={() => { setSubmitted(false); setAnswers({}); setOpenResults({}); }}
                    style={{border:"1px solid #3a3000", color:"#C9A84C"}}
                    className="w-full py-3 rounded-2xl text-sm">
                    أعد المحاولة
                  </button>
                )}
                {score >= 60 && (
                  <button onClick={() => router.push(`/tracks/${track}`)}
                    style={{background:"#C9A84C", color:"#000"}}
                    className="w-full py-4 rounded-2xl font-bold text-sm">
                    المرحلة التالية ←
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "comments" && (
          <div className="space-y-4">
            <div style={{background:"#111", border:"1px solid #222"}} className="rounded-2xl p-4 space-y-3">
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="شارك رأيك أو سؤالك عن هذه المرحلة..."
                style={{background:"#1a1a1a", border:"1px solid #2a2a2a", color:"#f5f5f5"}}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none min-h-20 resize-none placeholder-gray-600" />
              <button onClick={handleComment}
                style={{background:"#C9A84C", color:"#000"}}
                className="w-full py-2.5 rounded-xl text-sm font-semibold">
                إرسال
              </button>
            </div>

            {comments?.length === 0 && (
              <p className="text-center text-gray-600 text-sm py-8">لا توجد تعليقات بعد — كن الأول!</p>
            )}

            {comments?.map((c) => (
              <div key={c._id} style={{background:"#111", border:"1px solid #1a1a1a"}} className="rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {c.userImage && <img src={c.userImage} className="w-7 h-7 rounded-full object-cover" alt="" />}
                  <p style={{color:"#C9A84C"}} className="text-xs font-medium">{c.userName}</p>
                  <p className="text-xs text-gray-600 mr-auto">{new Date(c.createdAt).toLocaleDateString("ar")}</p>
                  {(c.userId === user?.id || isAdmin) && (
                    <button
                      onClick={() => deleteComment({ commentId: c._id, userId: user?.id || "", isAdmin: isAdmin })}
                      style={{color:"#ef4444", border:"1px solid #2a1a1a"}}
                      className="text-xs px-2 py-0.5 rounded-lg">
                      حذف
                    </button>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
