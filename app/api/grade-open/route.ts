import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, modelAnswer, userAnswer } = await req.json();

  const prompt = `أنت مصحح اختبار. أجب بـ JSON فقط بدون أي نص آخر أو backticks.
السؤال: "${question}"
الإجابة النموذجية: "${modelAnswer}"
إجابة الطالب: "${userAnswer}"
هل الإجابة صحيحة أو قريبة من المعنى الصحيح؟
{"correct": true/false, "feedback": "تعليق قصير بالعربية"}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ correct: false, feedback: "تعذر التقييم" }, { status: 500 });
  }
}
