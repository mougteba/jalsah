import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  const videoId = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  if (!videoId) {
    return NextResponse.json({ error: "رابط غير صحيح" }, { status: 400 });
  }

  let transcript = "";
  let transcriptFound = false;

  try {
    const scriptPath = path.join(process.cwd(), "scripts", "get_transcript.py");
    const { stdout } = await execFileAsync("python3", [scriptPath, videoId], { timeout: 25000 });
    transcript = stdout.trim().slice(0, 4000);
    transcriptFound = true;
  } catch (e) {
    console.error("Transcript error:", e);
  }

  const prompt = transcript
    ? `أنت مساعد لإنشاء مراحل تعليمية لمنصة تعلم الذكاء الاصطناعي للشباب الموريتاني.

النص الكامل المستخرج من الفيديو:
"""
${transcript}
"""

بناءً على هذا المحتوى الحقيقي فقط، أنشئ JSON فقط بدون أي نص آخر أو backticks:
{"title":"عنوان يعكس المحتوى الحقيقي","description":"وصف جملتان يلخص ما في الفيديو فعلاً","questions":[{"text":"سؤال من الفيديو","type":"mcq","options":["خيار1","خيار2","خيار3","خيار4"],"answer":"الصحيح"},{"text":"سؤال صح خطأ","type":"truefalse","options":[],"answer":"صح"},{"text":"سؤال ثالث","type":"mcq","options":["خيار1","خيار2","خيار3","خيار4"],"answer":"الصحيح"}]}`
    : `أنشئ محتوى تعليمي عن الذكاء الاصطناعي. JSON فقط بدون نص آخر:
{"title":"عنوان المرحلة","description":"وصف جملتان","questions":[{"text":"سؤال 1","type":"mcq","options":["خيار1","خيار2","خيار3","خيار4"],"answer":"الصحيح"},{"text":"سؤال 2","type":"truefalse","options":[],"answer":"صح"},{"text":"سؤال 3","type":"mcq","options":["خيار1","خيار2","خيار3","خيار4"],"answer":"الصحيح"}]}`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json({ ...parsed, transcriptFound });
  } catch (e) {
    console.error("Gemini error:", e);
    return NextResponse.json({ error: "فشل التحليل" }, { status: 500 });
  }
}
