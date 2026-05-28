"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ADMIN_EMAIL = "almjtbymhmdalmkhtar@gmail.com";

const adhkar = [
  { text: "أستغفر الله العظيم وأتوب إليه", benefit: "من لازم الاستغفار جعل الله له من كل هم فرجاً ومن كل ضيق مخرجاً" },
  { text: "سبحان الله وبحمده سبحان الله العظيم", benefit: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن" },
  { text: "لا إله إلا الله وحده لا شريك له", benefit: "أفضل ما قاله النبيون — تمحو السيئات وترفع الدرجات" },
  { text: "اللهم صل وسلم على نبينا محمد", benefit: "من صلى عليّ واحدة صلى الله عليه عشراً" },
];

export default function RedirectPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const createOrGetUser = useMutation(api.users.createOrGetUser);
  const [dhikr] = useState(() => adhkar[Math.floor(Math.random() * adhkar.length)]);
  const done = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || done.current) return;
    done.current = true;
    const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
    const save = async () => {
      await createOrGetUser({
        clerkId: user.id,
        name: user.fullName || "مجهول",
        email: email || "",
        image: user.imageUrl,
      });
      if (email === ADMIN_EMAIL) router.replace("/admin");
      else router.replace("/dashboard");
    };
    save();
  }, [user, isLoaded]);

  return (
    <div style={{background:"#080808", minHeight:"100vh", fontFamily:"'IBM Plex Sans Arabic', sans-serif"}}
      className="flex flex-col items-center justify-center px-8 text-center gap-8" dir="rtl">

      <div style={{width:48, height:48, border:"2px solid #C9A84C22", borderTopColor:"#C9A84C", borderRadius:"50%"}}
        className="animate-spin" />

      <div className="space-y-4 max-w-xs">
        <p style={{color:"#C9A84C", fontSize:"22px", fontWeight:600, lineHeight:"1.6"}}>
          {dhikr.text}
        </p>
        <div style={{width:40, height:1, background:"#C9A84C44", margin:"0 auto"}} />
        <p style={{color:"#444", fontSize:"13px", lineHeight:"1.9"}}>
          {dhikr.benefit}
        </p>
      </div>

      <p style={{color:"#222", fontSize:"11px"}}>جارٍ تحضير منصتك...</p>
    </div>
  );
}
