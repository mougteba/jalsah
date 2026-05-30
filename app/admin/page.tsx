"use client";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus, ClipboardList, Users, Settings, Brain, Sparkles, Loader, MessageSquare, BarChart2, Trash2 } from "lucide-react";

const tracks = [
  { label: "AI Foundations",   value: "ai" },
  { label: "AI Automation",    value: "automation" },
  { label: "Vibe Coding",      value: "vibe" },
  { label: "Vibe Engineering", value: "engineering" },
];

const QUESTION_TYPES = [
  { value: "mcq",       label: "اختيار متعدد" },
  { value: "truefalse", label: "صح/خطأ" },
  { value: "open",      label: "مفتوح" },
] as const;

function AddStagePage() {
  const [track, setTrack] = useState<"ai"|"automation"|"vibe"|"engineering">("ai");
  const [order, setOrder] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState("");
  const [steps, setSteps] = useState([{ title: "", url: "" }]);
  const [questions, setQuestions] = useState([
    { text: "", type: "mcq" as "mcq"|"truefalse"|"open", options: ["","","",""], answer: "" }
  ]);
  const [saved, setSaved] = useState(false);
  const [aiUrl, setAiUrl] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const createStage = useMutation(api.stages.createStage);

  const handleAiFill = async () => {
    if (!aiUrl) return;
    setAiLoading(true); setAiError("");
    try {
      const res = await fetch("/api/ai-fill", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: aiUrl }),
      });
      const parsed = await res.json();
      if (parsed.error) throw new Error(parsed.error);
      setTitle(parsed.title || "");
      setDescription(parsed.description || "");
      setSteps([{ title: "ابدأ التعلم", url: aiUrl }]);
      setQuestions(parsed.questions || questions);
    } catch { setAiError("تعذّر استخراج المحتوى، تحقق من الرابط وحاول مجدداً"); }
    setAiLoading(false);
  };

  const addQuestion = () => setQuestions([...questions, { text: "", type: "mcq", options: ["","","",""], answer: "" }]);
  const removeQuestion = (i: number) => setQuestions(questions.filter((_, idx) => idx !== i));
  const updateQuestion = (i: number, field: string, value: any) => {
    const updated = [...questions]; (updated[i] as any)[field] = value; setQuestions(updated);
  };
  const updateOption = (qi: number, oi: number, value: string) => {
    const updated = [...questions]; updated[qi].options[oi] = value; setQuestions(updated);
  };
  const addStep = () => setSteps([...steps, { title: "", url: "" }]);
  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: "title"|"url", value: string) => {
    const updated = [...steps]; updated[i][field] = value; setSteps(updated);
  };

  const handleSave = async () => {
    if (!title || !description || steps.length === 0) return;
    await createStage({
      track, order, title, description,
      steps: steps.filter(s => s.url),
      phase: phase || undefined,
      questions: questions.map(q => ({
        text: q.text, type: q.type,
        options: q.type === "mcq" ? q.options.filter(o => o) : undefined,
        answer: q.answer,
      })),
    });
    setTitle(""); setDescription(""); setPhase(""); setAiUrl("");
    setSteps([{ title: "", url: "" }]);
    setQuestions([{ text: "", type: "mcq", options: ["","","",""], answer: "" }]);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 pt-6 space-y-4 pb-6">
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} color="#C9A84C" />
          <p style={{color:"#C9A84C"}} className="text-sm font-semibold">ملء تلقائي بالذكاء الاصطناعي</p>
        </div>
        <input value={aiUrl} onChange={(e) => setAiUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none placeholder-gray-700" />
        <button onClick={handleAiFill} disabled={aiLoading || !aiUrl}
          style={{background: aiUrl ? "#C9A84C" : "#1a1a1a", color: aiUrl ? "#000" : "#333"}}
          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
          {aiLoading ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {aiLoading ? "جاري الاستخراج..." : "استخراج وملء تلقائي"}
        </button>
        {aiError && <p className="text-xs text-red-500">{aiError}</p>}
      </div>
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5 space-y-4">
        <p style={{color:"#C9A84C"}} className="text-sm font-semibold uppercase tracking-wider">بيانات المرحلة</p>
        <div className="flex gap-2 flex-wrap">
          {tracks.map((t) => (
            <button key={t.value} onClick={() => setTrack(t.value as any)}
              style={track === t.value ? {background:"#C9A84C", color:"#000"} : {border:"1px solid #222", color:"#555"}}
              className="px-3 py-1.5 rounded-full text-xs font-medium">{t.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p style={{color:"#444"}} className="text-xs">الترتيب</p>
            <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
              style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none" />
          </div>
          <div className="space-y-1">
            <p style={{color:"#444"}} className="text-xs">المرحلة (اختياري)</p>
            <input value={phase} onChange={(e) => setPhase(e.target.value)} placeholder="مثال: الأساسيات"
              style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-700" />
          </div>
        </div>
        <div className="space-y-1">
          <p style={{color:"#444"}} className="text-xs">العنوان</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان المرحلة"
            style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-700" />
        </div>
        <div className="space-y-1">
          <p style={{color:"#444"}} className="text-xs">الوصف</p>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف المرحلة"
            style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none min-h-20 resize-none placeholder-gray-700" />
        </div>
      </div>
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p style={{color:"#C9A84C"}} className="text-sm font-semibold">الخطوات</p>
          <span style={{color:"#444"}} className="text-xs">{steps.length} خطوة</span>
        </div>
        {steps.map((step, i) => (
          <div key={i} style={{background:"#0e0e0e", border:"1px solid #1a1a1a"}} className="rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div style={{background:"#1a1500", border:"1px solid #3a3000", color:"#C9A84C", width:24, height:24}}
                className="rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
              {steps.length > 1 && <button onClick={() => removeStep(i)} className="text-xs text-red-500">حذف</button>}
            </div>
            <input value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)}
              placeholder="عنوان الخطوة" style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
              className="w-full rounded-lg px-3 py-2 text-xs outline-none placeholder-gray-700" />
            <input value={step.url} onChange={(e) => updateStep(i, "url", e.target.value)}
              placeholder="https://youtube.com/..." style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
              className="w-full rounded-lg px-3 py-2 text-xs outline-none placeholder-gray-700" />
          </div>
        ))}
        <button onClick={addStep} style={{border:"1px solid #2a2500", color:"#C9A84C"}}
          className="w-full py-2.5 rounded-xl text-sm">+ إضافة خطوة</button>
      </div>
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-2xl p-5 space-y-4">
        <p style={{color:"#C9A84C"}} className="text-sm font-semibold uppercase tracking-wider">أسئلة الفهم</p>
        {questions.map((q, i) => (
          <div key={i} style={{background:"#0e0e0e", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p style={{color:"#444"}} className="text-xs">السؤال {i + 1}</p>
              {questions.length > 1 && <button onClick={() => removeQuestion(i)} className="text-xs text-red-500">حذف</button>}
            </div>
            <input value={q.text} onChange={(e) => updateQuestion(i, "text", e.target.value)}
              placeholder="نص السؤال" style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-700" />
            <div className="flex gap-2 flex-wrap">
              {QUESTION_TYPES.map(({ value, label }) => (
                <button key={value} onClick={() => updateQuestion(i, "type", value)}
                  style={q.type === value ? {background:"#C9A84C", color:"#000"} : {border:"1px solid #222", color:"#555"}}
                  className="px-3 py-1 rounded-full text-xs transition-all">{label}</button>
              ))}
            </div>
            {q.type === "mcq" && (
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <input key={oi} value={opt} onChange={(e) => updateOption(i, oi, e.target.value)}
                    placeholder={`الخيار ${oi + 1}`} style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
                    className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-700" />
                ))}
              </div>
            )}
            {q.type === "open" && (
              <p style={{color:"#555"}} className="text-xs">المستخدم سيكتب إجابته ويقارنها الذكاء الاصطناعي بالإجابة النموذجية</p>
            )}
            <div className="space-y-1">
              <p style={{color:"#444"}} className="text-xs">
                {q.type === "open" ? "الإجابة النموذجية" : q.type === "truefalse" ? "صح أو خطأ" : "الإجابة الصحيحة"}
              </p>
              <input value={q.answer} onChange={(e) => updateQuestion(i, "answer", e.target.value)}
                placeholder={q.type === "truefalse" ? "صح أو خطأ" : "الإجابة الصحيحة"}
                style={{background:"#111", border:"1px solid #C9A84C33", color:"#C9A84C"}}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none placeholder-gray-600" />
            </div>
          </div>
        ))}
        <button onClick={addQuestion} style={{border:"1px solid #2a2500", color:"#C9A84C"}}
          className="w-full py-2.5 rounded-xl text-sm">+ إضافة سؤال</button>
      </div>
      <button onClick={handleSave}
        style={{background: saved ? "#0d1a0d" : "#C9A84C", color: saved ? "#4ade80" : "#000",
          border: saved ? "1px solid #1a3a1a" : "none"}}
        className="w-full py-4 rounded-2xl font-bold text-sm">
        {saved ? "✓ تم الحفظ" : "حفظ المرحلة"}
      </button>
    </div>
  );
}

function StagesPage() {
  const stages = useQuery(api.stages.getAllStages);
  const deleteStage = useMutation(api.stages.deleteStage);
  const toggleLock = useMutation(api.stages.toggleAdminLock);
  const updateStage = useMutation(api.stages.updateStage);
  const resetProgress = useMutation(api.progress.resetStageProgress);

  const [openTrack, setOpenTrack] = useState<string|null>("ai");
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editData, setEditData] = useState<any>(null);

  const trackList = [
    { id:"ai", label:"AI Foundations" },
    { id:"automation", label:"AI Automation" },
    { id:"vibe", label:"Vibe Coding" },
    { id:"engineering", label:"Vibe Engineering" },
  ];

  const startEdit = (stage: any) => {
    setEditingId(stage._id);
    setEditData({
      title: stage.title, description: stage.description,
      phase: stage.phase || "", order: stage.order,
      steps: stage.steps?.length > 0 ? stage.steps
        : stage.externalUrl ? [{ title: "ابدأ التعلم", url: stage.externalUrl }]
        : [{ title: "", url: "" }],
      questions: stage.questions.map((q: any) => ({ ...q, options: q.options || ["","","",""] })),
    });
  };

  const saveEdit = async (stageId: string) => {
    await updateStage({
      stageId: stageId as any,
      title: editData.title, description: editData.description,
      steps: editData.steps.filter((s: any) => s.url),
      phase: editData.phase || undefined, order: editData.order,
      questions: editData.questions.map((q: any) => ({
        text: q.text, type: q.type,
        options: q.type === "mcq" ? q.options.filter((o: string) => o) : undefined,
        answer: q.answer,
      })),
    });
    await resetProgress({ stageId: stageId as any });
    setEditingId(null); setEditData(null);
  };

  const updateQ = (i: number, field: string, value: any) => {
    const qs = [...editData.questions]; qs[i] = { ...qs[i], [field]: value };
    setEditData({ ...editData, questions: qs });
  };
  const updateOpt = (qi: number, oi: number, value: string) => {
    const qs = [...editData.questions]; const opts = [...qs[qi].options];
    opts[oi] = value; qs[qi] = { ...qs[qi], options: opts };
    setEditData({ ...editData, questions: qs });
  };
  const addEditStep = () => setEditData({ ...editData, steps: [...editData.steps, { title: "", url: "" }] });
  const removeEditStep = (i: number) => setEditData({ ...editData, steps: editData.steps.filter((_: any, idx: number) => idx !== i) });
  const updateEditStep = (i: number, field: "title"|"url", value: string) => {
    const steps = [...editData.steps]; steps[i] = { ...steps[i], [field]: value };
    setEditData({ ...editData, steps });
  };

  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      {trackList.map((track) => {
        const trackStages = stages?.filter(s => s.track === track.id).sort((a,b) => a.order - b.order) || [];
        const isOpen = openTrack === track.id;
        return (
          <div key={track.id} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl overflow-hidden">
            <button onClick={() => setOpenTrack(isOpen ? null : track.id)}
              className="w-full px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{color:"#C9A84C"}} className="text-sm font-semibold">{track.label}</span>
                <span style={{background:"#1a1500", color:"#C9A84C", border:"1px solid #2a2500"}}
                  className="text-xs px-2 py-0.5 rounded-full">{trackStages.length} مراحل</span>
              </div>
              <span style={{color:"#444"}} className="text-xs">{isOpen ? "▲" : "▼"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-gray-900 space-y-2 p-3">
                {trackStages.length === 0 && (
                  <p style={{color:"#333"}} className="text-xs text-center py-4">لا توجد مراحل</p>
                )}
                {trackStages.map((stage) => (
                  <div key={stage._id} style={{background:"#0e0e0e", border:"1px solid #1a1a1a"}} className="rounded-xl p-3">
                    {editingId === stage._id ? (
                      <div className="space-y-3">
                        <div style={{background:"#1a1a00", border:"1px solid #3a3000"}} className="rounded-lg px-3 py-2">
                          <p style={{color:"#C9A84C"}} className="text-xs">⚠️ حفظ التعديل سيعيد تعيين تقدم جميع المستخدمين في هذه المرحلة</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <p style={{color:"#444"}} className="text-xs">الترتيب</p>
                            <input type="number" value={editData.order}
                              onChange={e => setEditData({...editData, order: Number(e.target.value)})}
                              style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
                              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none" />
                          </div>
                          <div className="space-y-1">
                            <p style={{color:"#444"}} className="text-xs">المرحلة</p>
                            <input value={editData.phase} onChange={e => setEditData({...editData, phase: e.target.value})}
                              style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
                              className="w-full rounded-lg px-2 py-1.5 text-xs outline-none" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p style={{color:"#444"}} className="text-xs">العنوان</p>
                          <input value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})}
                            style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
                            className="w-full rounded-lg px-2 py-1.5 text-xs outline-none" />
                        </div>
                        <div className="space-y-1">
                          <p style={{color:"#444"}} className="text-xs">الوصف</p>
                          <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})}
                            style={{background:"#111", border:"1px solid #222", color:"#f5f5f5"}}
                            className="w-full rounded-lg px-2 py-1.5 text-xs outline-none resize-none min-h-16" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p style={{color:"#C9A84C"}} className="text-xs font-semibold">الخطوات</p>
                            <button onClick={addEditStep} style={{color:"#C9A84C"}} className="text-xs">+ إضافة</button>
                          </div>
                          {editData.steps.map((step: any, i: number) => (
                            <div key={i} style={{background:"#111", border:"1px solid #222"}} className="rounded-lg p-2 space-y-2">
                              <div className="flex items-center justify-between">
                                <span style={{color:"#C9A84C"}} className="text-xs font-bold">{i + 1}</span>
                                {editData.steps.length > 1 && (
                                  <button onClick={() => removeEditStep(i)} className="text-xs text-red-500">حذف</button>
                                )}
                              </div>
                              <input value={step.title} onChange={e => updateEditStep(i, "title", e.target.value)}
                                placeholder="عنوان الخطوة" style={{background:"#0e0e0e", border:"1px solid #1a1a1a", color:"#f5f5f5"}}
                                className="w-full rounded-lg px-2 py-1.5 text-xs outline-none placeholder-gray-700" />
                              <input value={step.url} onChange={e => updateEditStep(i, "url", e.target.value)}
                                placeholder="https://..." style={{background:"#0e0e0e", border:"1px solid #1a1a1a", color:"#f5f5f5"}}
                                className="w-full rounded-lg px-2 py-1.5 text-xs outline-none placeholder-gray-700" />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <p style={{color:"#C9A84C"}} className="text-xs font-semibold">الأسئلة</p>
                          {editData.questions.map((q: any, i: number) => (
                            <div key={i} style={{background:"#111", border:"1px solid #222"}} className="rounded-lg p-3 space-y-2">
                              <p style={{color:"#444"}} className="text-xs">السؤال {i+1}</p>
                              <input value={q.text} onChange={e => updateQ(i, "text", e.target.value)}
                                style={{background:"#0e0e0e", border:"1px solid #1a1a1a", color:"#f5f5f5"}}
                                className="w-full rounded-lg px-2 py-1.5 text-xs outline-none" />
                              <div className="flex gap-2 flex-wrap">
                                {QUESTION_TYPES.map(({ value, label }) => (
                                  <button key={value} onClick={() => updateQ(i, "type", value)}
                                    style={q.type === value ? {background:"#C9A84C", color:"#000"} : {border:"1px solid #222", color:"#555"}}
                                    className="px-2 py-1 rounded-full text-xs">{label}</button>
                                ))}
                              </div>
                              {q.type === "mcq" && q.options.map((opt: string, oi: number) => (
                                <input key={oi} value={opt} onChange={e => updateOpt(i, oi, e.target.value)}
                                  placeholder={`خيار ${oi+1}`} style={{background:"#0e0e0e", border:"1px solid #1a1a1a", color:"#f5f5f5"}}
                                  className="w-full rounded-lg px-2 py-1.5 text-xs outline-none placeholder-gray-700" />
                              ))}
                              {q.type === "open" && (
                                <p style={{color:"#555"}} className="text-xs">سؤال مفتوح — الإجابة ستُقيَّم بالذكاء الاصطناعي</p>
                              )}
                              <input value={q.answer} onChange={e => updateQ(i, "answer", e.target.value)}
                                placeholder="الإجابة الصحيحة / النموذجية"
                                style={{background:"#0e0e0e", border:"1px solid #C9A84C33", color:"#C9A84C"}}
                                className="w-full rounded-lg px-2 py-1.5 text-xs outline-none placeholder-gray-600" />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(stage._id)}
                            style={{background:"#C9A84C", color:"#000"}}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold">حفظ</button>
                          <button onClick={() => setEditingId(null)}
                            style={{border:"1px solid #222", color:"#666"}}
                            className="flex-1 py-2 rounded-lg text-xs">إلغاء</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 font-medium truncate">{stage.title}</p>
                          <div className="flex gap-2 mt-1 items-center flex-wrap">
                            <span style={{color:"#333"}} className="text-xs">ترتيب {stage.order}</span>
                            <span style={{color:"#333"}} className="text-xs">• {stage.questions.length} أسئلة</span>
                            <span style={{color:"#333"}} className="text-xs">• {stage.steps?.length || 1} خطوات</span>
                            {stage.adminLocked && (
                              <span style={{color:"#ef4444", border:"1px solid #2a1a1a"}}
                                className="text-xs px-2 py-0.5 rounded-full">مقفول</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0 mr-2">
                          <button onClick={() => startEdit(stage)} style={{border:"1px solid #1a2a3a", color:"#60a5fa"}}
                            className="text-xs px-2 py-1 rounded-lg">تعديل</button>
                          <button onClick={() => toggleLock({ stageId: stage._id, locked: !stage.adminLocked })}
                            style={stage.adminLocked ? {border:"1px solid #1a3a1a", color:"#4ade80"} : {border:"1px solid #2a2500", color:"#C9A84C"}}
                            className="text-xs px-2 py-1 rounded-lg">{stage.adminLocked ? "فتح" : "قفل"}</button>
                          <button onClick={() => deleteStage({ stageId: stage._id })}
                            style={{border:"1px solid #2a1a1a", color:"#ef4444"}}
                            className="text-xs px-2 py-1 rounded-lg">حذف</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function UsersPage() {
  const users = useQuery(api.users.getAllUsers);
  const banUser = useMutation(api.users.banUser);
  const deleteUser = useMutation(api.users.deleteUser);
  const setAdmin = useMutation(api.users.setAdminRole);
  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      {!users?.length && (
        <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-6 text-center">
          <p style={{color:"#333"}} className="text-sm">لا يوجد مستخدمون بعد</p>
        </div>
      )}
      {users?.map((u) => (
        <div key={u._id} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            {u.image ? <img src={u.image} className="w-9 h-9 rounded-full object-cover" alt="" />
              : <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
                  className="w-9 h-9 rounded-full flex items-center justify-center">
                  <span style={{color:"#C9A84C"}} className="text-xs font-bold">{u.name?.[0]}</span>
                </div>
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">{u.name}</p>
              <p style={{color:"#444"}} className="text-xs truncate">{u.email}</p>
              {u.banned && <span className="text-xs text-red-500">محظور</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setAdmin({ userId: u._id, role: u.role === "admin" ? "user" : "admin" })}
              style={{border:"1px solid #2a2500", color:"#C9A84C"}} className="text-xs px-3 py-1.5 rounded-lg flex-1">
              {u.role === "admin" ? "إلغاء الأدمن" : "تعيين أدمن"}
            </button>
            <button onClick={() => banUser({ userId: u._id, banned: !u.banned })}
              style={{border:"1px solid #2a1500", color:"#f97316"}} className="text-xs px-3 py-1.5 rounded-lg flex-1">
              {u.banned ? "رفع الحظر" : "حظر"}
            </button>
            <button onClick={() => { if (window.confirm("⚠️ تحذير: هذا الإجراء خطير!\nسيتم حذف المستخدم نهائياً ولا يمكن التراجع عنه.\nهل أنت متأكد؟")) deleteUser({ userId: u._id }); }}
              style={{border:"1px solid #2a1a1a", color:"#ef4444"}} className="text-xs px-3 py-1.5 rounded-lg flex-1">حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CommentsPage({ adminId }: { adminId: string }) {
  const comments = useQuery(api.comments.getAllComments);
  const deleteComment = useMutation(api.comments.deleteComment);
  if (!comments) return <div className="flex justify-center pt-20"><Loader size={20} color="#C9A84C" className="animate-spin" /></div>;
  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      {comments.length === 0 && (
        <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-6 text-center">
          <p style={{color:"#333"}} className="text-sm">لا توجد تعليقات بعد</p>
        </div>
      )}
      {comments.map((c) => (
        <div key={c._id} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {c.userImage
                ? <img src={c.userImage} className="w-7 h-7 rounded-full object-cover" alt="" />
                : <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
                    className="w-7 h-7 rounded-full flex items-center justify-center">
                    <span style={{color:"#C9A84C"}} className="text-xs font-bold">{c.userName?.[0]}</span>
                  </div>
              }
              <div>
                <p className="text-xs text-gray-300 font-medium">{c.userName}</p>
                <p style={{color:"#444"}} className="text-xs">{c.stageTitle}</p>
              </div>
            </div>
            <button onClick={() => deleteComment({ commentId: c._id, userId: adminId, isAdmin: true })}
              style={{border:"1px solid #2a1a1a", color:"#ef4444"}} className="p-1.5 rounded-lg">
              <Trash2 size={13} />
            </button>
          </div>
          <p className="text-sm text-gray-400">{c.content}</p>
          <p style={{color:"#333"}} className="text-xs">{new Date(c.createdAt).toLocaleDateString("ar")}</p>
        </div>
      ))}
    </div>
  );
}

function ProgressPage() {
  const users = useQuery(api.users.getAllUsers);
  const stages = useQuery(api.stages.getAllStages);
  const unlockStage = useMutation(api.progress.unlockStageForUser);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const userProgress = useQuery(
    api.progress.getUserProgressDetailed,
    selectedUser ? { userId: selectedUser.clerkId } : "skip"
  );

  const trackColors: Record<string, string> = {
    ai: "#60a5fa", automation: "#a78bfa", vibe: "#34d399", engineering: "#f97316"
  };
  const trackLabels: Record<string, string> = {
    ai: "AI Foundations", automation: "AI Automation", vibe: "Vibe Coding", engineering: "Vibe Engineering"
  };

  if (!users || !stages) return (
    <div className="flex justify-center pt-20">
      <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  );

  const completedIds = new Set(userProgress?.filter(p => p.completed).map(p => p.stageId) || []);
  const trackList = ["ai","automation","vibe","engineering"];

  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      {!selectedUser ? (
        <>
          <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl px-4 py-3 flex justify-between">
            <p style={{color:"#444"}} className="text-xs">المستخدمون</p>
            <p style={{color:"#C9A84C"}} className="text-xs font-bold">{users.length}</p>
          </div>
          {users.length === 0 && (
            <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-6 text-center">
              <p style={{color:"#333"}} className="text-sm">لا يوجد مستخدمون بعد</p>
            </div>
          )}
          {users.map((u) => (
            <button key={u._id} onClick={() => setSelectedUser(u)} className="w-full text-right"
              style={{background:"#111", border:"1px solid #1e1e1e"}} >
              <div className="rounded-xl p-4 flex items-center gap-3">
                {u.image
                  ? <img src={u.image} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                  : <div style={{background:"#141414", border:"1px solid #2a2500"}} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                      <span style={{color:"#C9A84C"}} className="text-sm font-bold">{u.name?.[0]}</span>
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium truncate">{u.name}</p>
                  <p style={{color:"#444"}} className="text-xs truncate">{u.email}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </div>
            </button>
          ))}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 mb-2"
            style={{color:"#C9A84C"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span className="text-sm">رجوع</span>
          </button>
          <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 flex items-center gap-3">
            {selectedUser.image
              ? <img src={selectedUser.image} className="w-12 h-12 rounded-full object-cover" alt="" />
              : <div style={{background:"#141414", border:"2px solid #C9A84C"}} className="w-12 h-12 rounded-full flex items-center justify-center">
                  <span style={{color:"#C9A84C"}} className="text-sm font-bold">{selectedUser.name?.[0]}</span>
                </div>
            }
            <div>
              <p className="text-white font-semibold text-sm">{selectedUser.name}</p>
              <p style={{color:"#444"}} className="text-xs">{completedIds.size} مرحلة مكتملة</p>
            </div>
          </div>
          {trackList.map((track) => {
            const trackStages = stages.filter(s => s.track === track).sort((a,b) => a.order - b.order);
            return (
              <div key={track} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between" style={{borderBottom:"1px solid #1a1a1a"}}>
                  <p style={{color: trackColors[track]}} className="text-xs font-semibold">{trackLabels[track]}</p>
                  <p style={{color:"#444"}} className="text-xs">{trackStages.filter(s => completedIds.has(s._id)).length}/{trackStages.length}</p>
                </div>
                <div className="p-3 space-y-2">
                  {trackStages.map((stage) => {
                    const done = completedIds.has(stage._id);
                    const prog = userProgress?.find(p => p.stageId === stage._id);
                    return (
                      <div key={stage._id} style={{background:"#0e0e0e", border: done ? "1px solid #1a3a1a" : "1px solid #1a1a1a"}} className="rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 truncate">{stage.title}</p>
                          {done && prog?.score !== undefined && (
                            <p style={{color:"#4ade80"}} className="text-xs mt-0.5">✓ {prog.score}%</p>
                          )}
                        </div>
                        {!done && (
                          <button onClick={() => unlockStage({ userId: selectedUser.clerkId, stageId: stage._id })}
                            style={{border:"1px solid #2a2500", color:"#C9A84C"}}
                            className="text-xs px-2 py-1 rounded-lg shrink-0 mr-2">فتح</button>
                        )}
                        {done && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
function MessagesAdminPage({ adminId, adminName, adminImage }: { adminId: string; adminName: string; adminImage?: string }) {
  const conversations = useQuery(api.messages.getAllConversations);
  const users = useQuery(api.users.getAllUsers);
  const sendMessage = useMutation(api.messages.sendMessage);
  const broadcastMessage = useMutation(api.messages.broadcastMessage);
  const markAsRead = useMutation(api.messages.markAsRead);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [broadcastText, setBroadcastText] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);

  const conversation = useQuery(
    api.messages.getConversation,
    selectedUserId ? { userId: adminId, otherUserId: selectedUserId } : "skip"
  );

  const selectedUser = users?.find(u => u.clerkId === selectedUserId);

  const handleSend = async () => {
    if (!text.trim() || !selectedUserId) return;
    await sendMessage({ fromId: adminId, toId: selectedUserId, fromName: adminName, fromImage: adminImage, content: text });
    setText("");
  };

  const handleBroadcast = async () => {
    if (!broadcastText.trim()) return;
    await broadcastMessage({ fromId: adminId, fromName: adminName, fromImage: adminImage, content: broadcastText });
    setBroadcastText(""); setShowBroadcast(false);
  };

  if (!conversations || !users) return (
    <div className="flex justify-center pt-20">
      <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
    </div>
  );

  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      <button onClick={() => setShowBroadcast(!showBroadcast)}
        style={{background:"#1a1500", border:"1px solid #3a3000", color:"#C9A84C"}}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
        إرسال للجميع
      </button>

      {showBroadcast && (
        <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-3">
          <p style={{color:"#C9A84C"}} className="text-xs font-semibold">رسالة لجميع المستخدمين</p>
          <textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none min-h-16 resize-none placeholder-gray-700" />
          <button onClick={handleBroadcast} disabled={!broadcastText.trim()}
            style={{background: broadcastText.trim() ? "#C9A84C" : "#1a1a1a", color: broadcastText.trim() ? "#000" : "#444"}}
            className="w-full py-2.5 rounded-xl text-sm font-semibold">إرسال للجميع</button>
        </div>
      )}

      {!selectedUserId ? (
        <div className="space-y-2">
          <p style={{color:"#444"}} className="text-xs px-1">المحادثات</p>
          {conversations.length === 0 && (
            <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-6 text-center">
              <p style={{color:"#333"}} className="text-sm">لا توجد محادثات بعد</p>
            </div>
          )}
          {conversations.map((msg) => {
            const userId = msg.fromId === adminId ? msg.toId : msg.fromId;
            const u = users.find(u => u.clerkId === userId);
            return (
              <button key={msg._id} onClick={() => { setSelectedUserId(userId); markAsRead({ userId: adminId, fromId: userId }); }}
                className="w-full text-right" style={{background:"#111", border:"1px solid #1e1e1e"}}>
                <div className="rounded-xl p-4 flex items-center gap-3">
                  {u?.image
                    ? <img src={u.image} className="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
                    : <div style={{background:"#141414", border:"1px solid #2a2500"}} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                        <span style={{color:"#C9A84C"}} className="text-xs font-bold">{(u?.name || msg.fromName)?.[0]}</span>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium truncate">{u?.name || msg.fromName}</p>
                    <p style={{color:"#444"}} className="text-xs truncate">{msg.content}</p>
                  </div>
                  {!msg.read && msg.toId === adminId && (
                    <span style={{background:"#ef4444"}} className="w-2 h-2 rounded-full shrink-0"></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedUserId(null)} className="flex items-center gap-2"
            style={{color:"#C9A84C"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span className="text-sm">رجوع</span>
          </button>
          <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-3 flex items-center gap-3">
            {selectedUser?.image
              ? <img src={selectedUser.image} className="w-9 h-9 rounded-full object-cover" alt="" />
              : <div style={{background:"#141414", border:"1px solid #2a2500"}} className="w-9 h-9 rounded-full flex items-center justify-center">
                  <span style={{color:"#C9A84C"}} className="text-xs font-bold">{selectedUser?.name?.[0]}</span>
                </div>
            }
            <p className="text-sm text-white font-medium">{selectedUser?.name}</p>
          </div>
          <div style={{background:"#111", border:"1px solid #1e1e1e", minHeight:"250px"}} className="rounded-xl p-4 space-y-3">
            {!conversation?.length && (
              <p style={{color:"#333"}} className="text-sm text-center pt-8">لا توجد رسائل بعد</p>
            )}
            {conversation?.map((msg) => {
              const isAdmin = msg.fromId === adminId;
              return (
                <div key={msg._id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                  <div style={{
                    background: isAdmin ? "#1a1500" : "#141414",
                    border: isAdmin ? "1px solid #3a3000" : "1px solid #1e1e1e",
                    maxWidth: "80%",
                  }} className="rounded-2xl px-4 py-2.5 space-y-1">
                    <p className="text-sm text-gray-200">{msg.content}</p>
                    <p style={{color:"#444"}} className="text-xs">{new Date(msg.createdAt).toLocaleTimeString("ar")}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-3">
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="اكتب رسالتك..."
              style={{background:"#0e0e0e", border:"1px solid #1e1e1e", color:"#f5f5f5"}}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none min-h-16 resize-none placeholder-gray-700" />
            <button onClick={handleSend} disabled={!text.trim()}
              style={{background: text.trim() ? "#C9A84C" : "#1a1a1a", color: text.trim() ? "#000" : "#444"}}
              className="w-full py-2.5 rounded-xl text-sm font-semibold">إرسال</button>
          </div>
        </>
      )}
    </div>
  );
}
function AdminSettings({ user, signOut }: { user: any; signOut: any }) {
  return (
    <div className="px-4 pt-6 space-y-4 pb-6">
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
            <p className="font-semibold text-white">{user?.fullName}</p>
            <p style={{color:"#444"}} className="text-xs mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
            <span style={{background:"#141400", color:"#C9A84C", border:"1px solid #2a2500"}}
              className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block">أدمن</span>
          </div>
        </div>
      </div>
      <button onClick={() => signOut({ redirectUrl: "/" })}
        style={{border:"1px solid #2a1a1a", color:"#ef4444"}}
        className="w-full py-3 rounded-xl text-sm bg-transparent">تسجيل الخروج</button>
    </div>
  );
}


export default function AdminPage() {
  const [page, setPage] = useState<"add"|"stages"|"users"|"comments"|"messages"|"progress"|"settings">("add");
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { id:"add",      label:"إضافة",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
    { id:"stages",   label:"المراحل",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { id:"users",    label:"المستخدمون",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id:"comments", label:"التعليقات",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id:"messages", label:"الرسائل",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
    { id:"progress", label:"التقدم",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id:"settings", label:"إعدادات",
      icon: (a:boolean) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a?2:1.5}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <div style={{background:"#080808", minHeight:"100vh"}} dir="rtl" className="pb-24">
      <header style={{background:"#080808", borderBottom:"1px solid #141414"}}
        className="px-6 py-4 sticky top-0 z-10 flex items-center gap-2">
        <div style={{background:"#C9A84C", borderRadius:"6px"}} className="w-6 h-6 flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
            <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <h1 style={{color:"#C9A84C"}} className="text-lg font-bold tracking-wide flex-1">لوحة التحكم</h1>
      </header>

      <div className="overflow-y-auto">
        {page === "add"      && <AddStagePage />}
        {page === "stages"   && <StagesPage />}
        {page === "users"    && <UsersPage />}
        {page === "comments" && <CommentsPage adminId={user?.id ?? ""} />}
        {page === "messages" && <MessagesAdminPage adminId={user?.id ?? ""} adminName={user?.fullName ?? "الأدمن"} adminImage={user?.imageUrl} />}
        {page === "progress" && <ProgressPage />}
        {page === "settings" && <AdminSettings user={user} signOut={signOut} />}
      </div>

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
    </div>
  );
}
