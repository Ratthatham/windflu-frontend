"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Shield,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import api from "@/app/utils/api";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api({
        url: "/v1/auth/admin/register",
        method: "POST",
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
        },
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสร้างบัญชี");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#070a10]">
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex w-5/12 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg,#0a0a0f 0%,#1a0a0a 50%,#7f1d1d 100%)",
        }}
      >
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

        <Link href="/" className="flex items-center gap-2 mb-16 relative z-10">
          <Shield className="w-8 h-8 text-red-400" />
          <span className="text-2xl font-bold text-white">
            Windflu <span className="text-red-400 font-black">Admin</span>
          </span>
        </Link>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-black text-white mb-4 leading-snug">
            สร้างบัญชี
            <br />
            <span className="text-red-400">ผู้ดูแลระบบ</span>
          </h1>
          <p className="text-white/60 text-base mb-10">
            เพียงกรอกข้อมูลพื้นฐาน แล้วคุณจะมีสิทธิ์เข้าถึงแดชบอร์ดผู้ดูแลได้ทันที
          </p>

          <div className="space-y-4">
            {[
              { icon: User, text: "ตั้งชื่อผู้ใช้สำหรับระบบ" },
              { icon: Mail, text: "ใช้อีเมลองค์กรสำหรับสมัคร" },
              { icon: Shield, text: "รหัสผ่านต้องปลอดภัยอย่างน้อย 8 ตัว" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/60 text-sm">
                <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-red-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative z-10">
          Windflu Admin — สำหรับผู้ดูแลระบบเท่านั้น
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-[#0d0f14] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Shield className="w-6 h-6 text-red-400" />
            <span className="text-xl font-bold text-white">
              Windflu <span className="text-red-400 font-black">Admin</span>
            </span>
          </Link>

          {/* Success screen */}
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">สร้างบัญชีสำเร็จ!</h2>
              <p className="text-slate-400 mb-8">บัญชี Admin ถูกสร้างแล้ว เข้าสู่ระบบได้เลย</p>
              <Link href="/admin/login">
                <button
                  className="h-14 px-8 rounded-2xl text-base font-semibold text-white flex items-center gap-2 mx-auto"
                  style={{ background: "linear-gradient(135deg,#7f1d1d,#ef4444)" }}
                >
                  <Shield className="w-4 h-4" /> เข้าสู่ระบบ Admin
                </button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-400 text-xs font-semibold">Admin Console</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">สร้างบัญชี Admin</h2>
              <p className="text-slate-400 text-sm mb-8">
                มีบัญชีแล้ว?{" "}
                <Link href="/admin/login" className="text-red-400 font-bold hover:underline">
                  เข้าสู่ระบบ
                </Link>
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <User className="w-3.5 h-3.5" /> ชื่อผู้ใช้
                  </label>
                  <Input
                    required
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Admin Name"
                    className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-red-500 placeholder:text-slate-600 caret-white"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
                    <Mail className="w-3.5 h-3.5" /> อีเมล
                  </label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={set("email")}
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
                      required
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      minLength={8}
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-red-500 placeholder:text-slate-600 pr-12 caret-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60 mt-2 text-white"
                  style={{ background: "linear-gradient(135deg,#7f1d1d,#ef4444)" }}
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      สร้างบัญชี Admin
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
