"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wind,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";

import Link from "next/link";
import api from "@/app/utils/api";
import { useAuthStore } from "@/lib/store/auth-store";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  role: string;
  user_id: string;
}

const STATS = [
  { icon: Users, label: "Clipper ที่ใช้งาน", value: "2,400+" },
  { icon: TrendingUp, label: "แคมเปญที่ผ่านมา", value: "180+" },
  { icon: Sparkles, label: "รายจ่ายสะสม", value: "฿4.2M+" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data: LoginResponse = await api({
        url: "/v1/auth/creators/login",
        method: "POST",
        body: { email, password },
      });

      // Store tokens in httpOnly cookies via server-side route
      const cookieRes = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // forward the entire response so the route can pick any field name
      });

      if (!cookieRes.ok) {
        const errBody = await cookieRes.json().catch(() => ({}));
        throw new Error(errBody.error || "ไม่สามารถบันทึก session ได้");
      }

      // Update global store
      useAuthStore.getState().setAuth({
        id: data.user_id,
        email: email,
        role: data.role as any,
      });

      // Hard redirect so middleware reads the freshly-set cookie
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ——— Left panel (hidden on mobile) ——— */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-5%] left-[-10%] w-72 h-72 border border-white rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white rounded-full" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-20">
            <Wind className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Windflu</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4 leading-snug">
            ยินดีต้อนรับ
            <br />
            กลับมา
          </h1>
          <p className="text-white/70 text-lg max-w-sm">
            เข้าสู่ระบบเพื่อเช็คแคมเปญ ติดตามรายได้ และเริ่มทำคลิปได้เลย
          </p>
        </div>

        {/* Bottom: Stats */}
        <div className="relative z-10 space-y-5">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-base">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— Right panel ——— */}
      <div className="flex-1 bg-[#0a0e1a] flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Wind className="w-6 h-6" style={{ color: "#8B5CF6" }} />
            <span className="text-xl font-bold text-white">Windflu</span>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            เข้าสู่ระบบ
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/onboarding"
              className="text-purple-400 font-bold hover:underline"
            >
              สมัครเป็น Clipper ฟรี
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล"
                className="bg-[#111827] border-[#1e293b] text-white h-14 rounded-xl pl-11 placeholder:text-slate-600 focus:bg-[#111827] focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="bg-[#111827] border-[#1e293b] text-white h-14 rounded-xl pl-11 placeholder:text-slate-600 focus:bg-[#111827] focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#22D3EE)" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-8">
            © 2025 Windflu. สงวนสิทธิ์ทุกประการ
          </p>
        </motion.div>
      </div>
    </div>
  );
}
