"use client";

import { useState } from "react";
import {
  Loader2,
  Lock,
  Mail,
  BarChart3,
  Target,
  Zap,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import api from "@/app/utils/api";
import { useAuthStore } from "@/lib/store/auth-store";

const STATS = [
  { icon: BarChart3, label: "แคมเปญที่ดำเนินอยู่", value: "180+" },
  { icon: Target, label: "Clipper ที่พร้อมรับงาน", value: "2,400+" },
  { icon: Zap, label: "Avg. ROI ของแบรนด์", value: "3.8×" },
];

export default function BrandLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api({
        url: "/v1/auth/brands/login",
        method: "POST",
        body: { email, password },
      });

      const cookieRes = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!cookieRes.ok) {
        const errBody = await cookieRes.json().catch(() => ({}));
        throw new Error(errBody.error || "ไม่สามารถบันทึก session ได้");
      }

      // Update global store
      useAuthStore.getState().setAuth({
        id: data.user_id || data.id,
        email: email,
        role: (data.role || "brand") as any,
      });

      window.location.href = "/brand/create-campaign";
    } catch (err: any) {
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: amber/gold corporate ── */}
      <div
        className="hidden lg:flex w-5/12 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,#1a1200 0%,#7c4a00 50%,#d97706 100%)",
        }}
      >
        {/* Decorative grids */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#fbbf24,transparent)" }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <Building2 className="w-8 h-8 text-amber-400" />
            <span className="text-2xl font-bold text-white">
              Windflu <span className="text-amber-400 font-black">Brands</span>
            </span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4 leading-snug">
            เพิ่ม ROI ด้วย
            <br />
            <span className="text-amber-400">Clipper Marketing</span>
          </h1>
          <p className="text-white/70 text-lg max-w-sm">
            จัดการแคมเปญ วัด performance จ่ายตรงตามยอดวิว — ไม่มีงบเสียเปล่า
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 space-y-5">
          {STATS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-white font-bold text-base">{value}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-[#0d0f14] flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold text-white">
              Windflu <span className="text-amber-400 font-black">Brands</span>
            </span>
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold">
              Brand Portal
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            เข้าสู่ระบบ Brand
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            ยังไม่มีบัญชีแบรนด์?{" "}
            <Link
              href="/brand/register"
              className="text-amber-400 font-bold hover:underline"
            >
              สมัครฟรี
            </Link>
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมลบริษัท"
                className="bg-[#161b28] border-[#1e293b] text-white h-14 rounded-xl pl-11 placeholder:text-slate-600 focus:bg-[#161b28] focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่าน"
                className="bg-[#161b28] border-[#1e293b] text-white h-14 rounded-xl pl-11 placeholder:text-slate-600 focus:bg-[#161b28] focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2 text-black"
              style={{ background: "linear-gradient(135deg,#f59e0b,#fbbf24)" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">หรือ</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link
            href="/login"
            className="block text-center text-slate-500 text-sm hover:text-slate-300 transition-colors"
          >
            เข้าสู่ระบบในฐานะ Clipper →
          </Link>

          <p className="text-center text-xs text-slate-700 mt-8">
            © 2025 Windflu. สงวนสิทธิ์ทุกประการ
          </p>
        </motion.div>
      </div>
    </div>
  );
}
