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
  const progress = useQuery(api.progress.getAllUsersProgress);
  if (!progress) return <div className="flex justify-center pt-20"><Loader size={20} color="#C9A84C" className="animate-spin" /></div>;
  const trackColors: Record<string, string> = {
    ai: "#60a5fa", automation: "#a78bfa", vibe: "#34d399", engineering: "#f97316"
  };
  return (
    <div className="px-4 pt-6 space-y-3 pb-6">
      <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl px-4 py-3 flex justify-between">
        <p style={{color:"#444"}} className="text-xs">إجمالي الإنجازات</p>
        <p style={{color:"#C9A84C"}} className="text-xs font-bold">{progress.length}</p>
      </div>
      {progress.length === 0 && (
        <div style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-6 text-center">
          <p style={{color:"#333"}} className="text-sm">لا يوجد تقدم بعد</p>
        </div>
      )}
      {progress.map((p) => (
        <div key={p._id} style={{background:"#111", border:"1px solid #1e1e1e"}} className="rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {p.userImage
                ? <img src={p.userImage} className="w-7 h-7 rounded-full object-cover" alt="" />
                : <div style={{background:"#141414", border:"1px solid #1e1e1e"}}
                    className="w-7 h-7 rounded-full flex items-center justify-center">
                    <span style={{color:"#C9A84C"}} className="text-xs font-bold">{p.userName?.[0]}</span>
                  </div>
              }
              <p className="text-sm text-gray-300 font-medium">{p.userName}</p>
            </div>
            <div className="flex items-center gap-2">
              {p.score !== undefined && (
                <span style={{background:"#0d1a0d", color:"#4ade80", border:"1px solid #1a3a1a"}}
                  className="text-xs px-2 py-0.5 rounded-full">{p.score}%</span>
              )}
              <span style={{color: trackColors[p.stageTrack] || "#555", border:"1px solid #1e1e1e"}}
                className="text-xs px-2 py-0.5 rounded-full">{p.stageTrack}</span>
            </div>
          </div>
          <p style={{color:"#666"}} className="text-xs truncate">📚 {p.stageTitle}</p>
          {p.completedAt && (
            <p style={{color:"#333"}} className="text-xs">{new Date(p.completedAt).toLocaleDateString("ar")}</p>
          )}
        </div>
      ))}
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
  const [page, setPage] = useState<"add"|"stages"|"users"|"comments"|"progress"|"settings">("add");
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { id:"add",      Icon: Plus,          label:"إضافة"      },
    { id:"stages",   Icon: ClipboardList, label:"المراحل"    },
    { id:"users",    Icon: Users,         label:"المستخدمون" },
    { id:"comments", Icon: MessageSquare, label:"التعليقات"  },
    { id:"progress", Icon: BarChart2,     label:"التقدم"     },
    { id:"settings", Icon: Settings,      label:"إعدادات"    },
  ];

  return (
    <div style={{background:"#080808", minHeight:"100vh"}} dir="rtl" className="pb-24">
      <header style={{background:"#080808", borderBottom:"1px solid #141414"}}
        className="px-6 py-4 sticky top-0 z-10 flex items-center gap-2">
        <div style={{background:"#C9A84C", borderRadius:"6px"}} className="w-6 h-6 flex items-center justify-center">
          <Brain size={13} color="#000" strokeWidth={2.5} />
        </div>
        <h1 style={{color:"#C9A84C"}} className="text-lg font-bold tracking-wide flex-1">لوحة التحكم</h1>
      </header>
      <div className="overflow-y-auto">
        {page === "add"      && <AddStagePage />}
        {page === "stages"   && <StagesPage />}
        {page === "users"    && <UsersPage />}
        {page === "comments" && <CommentsPage adminId={user?.id ?? ""} />}
        {page === "progress" && <ProgressPage />}
        {page === "settings" && <AdminSettings user={user} signOut={signOut} />}
      </div>
      <nav style={{background:"#0a0a0a", borderTop:"1px solid #141414"}}
        className="fixed bottom-0 left-0 right-0 flex justify-around py-2 z-10">
        {navItems.map(({ id, Icon, label }) => (
          <button key={id} onClick={() => setPage(id as any)}
            className="flex flex-col items-center gap-0.5 transition-all"
            style={{color: page === id ? "#C9A84C" : "#333"}}>
            <Icon size={18} strokeWidth={page === id ? 2 : 1.5} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
