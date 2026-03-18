"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Mail,
  LayoutDashboard,
  Users,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import api from "@/app/utils/api";

const STATS = [
  { icon: LayoutDashboard, label: "แคมเปญทั้งหมด", value: "180+" },
  { icon: Users, label: "ผู้ใช้งาน", value: "2,400+" },
  { icon: Activity, label: "ความพร้อมระบบ", value: "99.9%" },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api({
        url: "/v1/auth/admin/login",
        method: "POST",
        body: { email, password },
      });

      const cookieRes = await fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          role: data.role,
          user_id: data.user_id,
        }),
      });

      if (!cookieRes.ok) throw new Error("Failed to store session");

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#070a10]">
      {/* ── Left panel: deep slate/red admin ── */}
      <div
        className="hidden lg:flex w-5/12 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,#0a0a0f 0%,#1a0a0a 50%,#7f1d1d 100%)",
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#ef4444,transparent)" }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-16 relative z-10">
          <Shield className="w-8 h-8 text-red-400" />
          <span className="text-2xl font-bold text-white">
            Windflu <span className="text-red-400 font-black">Admin</span>
          </span>
        </Link>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-black text-white mb-4 leading-snug">
            ระบบจัดการ
            <br />
            <span className="text-red-400">Windflu</span>
          </h1>
          <p className="text-white/60 text-base mb-12">
            เข้าถึงแดชบอร์ดผู้ดูแลระบบเพื่อตรวจสอบและบริหารแคมเปญ, แบรนด์ และ
            Clipper
          </p>

          {/* Stats */}
          <div className="space-y-4">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-none">
                    {value}
                  </div>
                  <div className="text-white/50 text-xs mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-white/20 text-xs relative z-10">
          Windflu Admin Console — สำหรับผู้ดูแลระบบเท่านั้น
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 bg-[#0d0f14] flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Shield className="w-6 h-6 text-red-400" />
            <span className="text-xl font-bold text-white">
              Windflu <span className="text-red-400 font-black">Admin</span>
            </span>
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400 text-xs font-semibold">
              Admin Console
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            เข้าสู่ระบบ Admin
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            สำหรับผู้ดูแลระบบ Windflu เท่านั้น
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                <Mail className="w-3.5 h-3.5" /> อีเมล
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@windflu.com"
                className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-red-500 placeholder:text-slate-600 caret-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5" /> รหัสผ่าน
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-red-500 placeholder:text-slate-600 pr-12 caret-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2 text-white"
              style={{ background: "linear-gradient(135deg,#7f1d1d,#ef4444)" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  เข้าสู่ระบบ Admin
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-600 text-xs">หรือ</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-2 text-center">
            <Link
              href="/admin/register"
              className="block text-slate-500 text-sm hover:text-red-400 transition-colors"
            >
              สร้างบัญชี Admin ใหม่ →
            </Link>
            <Link
              href="/login"
              className="block text-slate-600 text-xs hover:text-slate-400 transition-colors"
            >
              เข้าสู่ระบบในฐานะ Clipper
            </Link>
            <Link
              href="/brand/login"
              className="block text-slate-600 text-xs hover:text-slate-400 transition-colors"
            >
              เข้าสู่ระบบในฐานะ Brand
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
