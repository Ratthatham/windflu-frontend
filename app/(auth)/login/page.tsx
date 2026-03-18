"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wind,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const data = await api({
        url: "/v1/auth/google/url",
        method: "GET",
      });
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("ไม่พบ URL สำหรับเข้าสู่ระบบ");
      }
    } catch (err: any) {
      setError("ไม่สามารถเชื่อมต่อกับ Google ได้ กรุณาลองอีกครั้ง");
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    try {
      const data: LoginResponse = await api({
        url: "/v1/auth/creators/login",
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

      useAuthStore.getState().setAuth({
        id: data.user_id,
        email: email,
        role: data.role as any,
      } as any);

      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000]">
      {/* Background Ambience (Apple macOS style abstract blur) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-screen opacity-20 filter blur-[100px]"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            rotate: [0, -15, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-20 filter blur-[100px]"
          style={{
            background: "radial-gradient(circle, #22D3EE 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-auto p-8 sm:p-10 rounded-[32px] bg-[#1d1d1f]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 rounded-[20px] bg-linear-to-tr from-purple-600 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20"
          >
            <Wind className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
            เข้าสู่ระบบบัญชีของคุณ
          </h1>
          <p className="text-sm text-[#86868b]">
            จัดการแคมเปญและติดตามรายได้บน Windflu
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200 leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Primary CTA: Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full h-14 rounded-full bg-white hover:bg-gray-100 text-black font-medium text-[15px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {googleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.56V20.32H19.29C21.37 18.4 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.29 20.32L15.72 17.56C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.8 14.07H2.12V16.92C3.93 20.53 7.68 23 12 23Z" fill="#34A853"/>
                <path d="M5.8 14.07C5.57 13.38 5.44 12.65 5.44 11.9C5.44 11.15 5.57 10.42 5.8 9.73V6.88H2.12C1.37 8.36 0.95 10.08 0.95 11.9C0.95 13.72 1.37 15.44 2.12 16.92L5.8 14.07Z" fill="#FBBC05"/>
                <path d="M12 5.17C13.62 5.17 15.06 5.73 16.2 6.82L19.36 3.66C17.46 1.89 14.97 0.8 12 0.8C7.68 0.8 3.93 3.27 2.12 6.88L5.8 9.73C6.7 7.11 9.13 5.17 12 5.17Z" fill="#EA4335"/>
              </svg>
              ดำเนินการต่อด้วย Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-[#86868b] uppercase tracking-wider font-medium">
            หรือ
          </span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Toggle Email Login */}
        {!showEmailLogin ? (
          <button
            onClick={() => setShowEmailLogin(true)}
            className="w-full flex items-center justify-center gap-2 text-[15px] font-medium text-white/70 hover:text-white transition-colors py-2"
          >
            <Mail className="w-4 h-4" />
            ดำเนินการต่อด้วยอีเมล
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleEmailLogin}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="อีเมล"
                  className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-14 mt-6 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/5 text-white font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Footer Links */}
        <div className="mt-10 text-center text-[13px] text-[#86868b]">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link
            href="/register"
            className="text-white hover:text-purple-400 transition-colors font-medium border-b border-white hover:border-purple-400 pb-px"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
