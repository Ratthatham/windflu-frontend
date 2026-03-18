"use client";

import React, { useState } from "react";
import {
  Wind,
  CheckCircle2,
  User,
  Link2,
  Rocket,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import api from "@/app/utils/api";
import Link from "next/link";
import { Label } from "@/components/ui/Label";
import { RegisterForm, registerSchema } from "@/type/auth";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const STEPS = [
  { icon: User, label: "บัญชี", desc: "ข้อมูลเข้าสู่ระบบ" },
  { icon: Link2, label: "Social", desc: "ช่องทางของคุณ" },
  { icon: User, label: "ส่วนตัว", desc: "ข้อมูลติดต่อ" },
];

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      display_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      accept_terms: false,
      phone: "",
      payment_method: "promptpay",
      payment_account: "",
      tiktok_username: "",
      instagram_username: "",
      youtube_channel: "",
      primary_platform: "tiktok",
      followers_count: 0,
      avg_views: 0,
      content_category: [],
      country: "Thailand",
    },
  });

  const handleNextStep0 = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger([
      "email",
      "password",
      "confirmPassword",
      "accept_terms",
    ]);
    if (isValid) {
      setError(null);
      setCurrentStep(1);
    }
  };

  const handleSocial = async () => {
    const isValid = await trigger([
      "tiktok_username",
      "instagram_username",
      "youtube_channel",
    ]);
    if (isValid) {
      setError(null);
      setCurrentStep(2);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setError(null);
    setSaving(true);
    try {
      await api({
        url: "/v1/auth/creators/register",
        method: "POST",
        body: {
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          display_name: data.display_name || data.email.split("@")[0],
          phone: data.phone,
          accept_terms: true,
          tiktok_username: data.tiktok_username,
          instagram_username: data.instagram_username,
          youtube_channel: data.youtube_channel,
          primary_platform: data.primary_platform,
          followers_count: data.followers_count,
          avg_views: data.avg_views,
          content_category: data.content_category,
          country: data.country,
        },
      });
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden p-4 bg-[#000000]">
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] mx-auto p-8 sm:p-10 rounded-[32px] bg-[#1d1d1f]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
      >
        {/* Header & Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 rounded-[20px] bg-linear-to-tr from-purple-600 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 mx-auto"
            >
              <Wind className="w-8 h-8 text-white" />
            </motion.div>
          </Link>
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
            สมัครสมาชิก
          </h1>
          <p className="text-sm text-[#86868b]">
            เริ่มหาเงินจากการตัดคลิปได้เลยกับ Windflow
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
          >
            <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200 leading-relaxed">{error}</p>
          </motion.div>
        )}

        {/* Step indicators */}
        {currentStep < 3 && (
          <div className="flex justify-between items-center mb-8 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -z-10 -translate-y-1/2" />
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2  px-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    idx < currentStep
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : idx === currentStep
                        ? "bg-white text-black"
                        : "bg-[#2c2c2e] text-[#86868b]"
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase font-semibold tracking-wider ${
                    idx <= currentStep ? "text-white/80" : "text-[#86868b]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* ─── Step 0: Account info ─── */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleNextStep0} className="space-y-4">
                  <div className="space-y-1.5">
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="อีเมล"
                      className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
                      className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      {...register("confirmPassword")}
                      type="password"
                      placeholder="ยืนยันรหัสผ่าน"
                      className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                    />
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pt-2">
                    <div className="flex items-start gap-3 px-1">
                      <div className="relative flex items-start mt-0.5">
                        <input
                          type="checkbox"
                          id="terms"
                          {...register("accept_terms")}
                          className="w-4 h-4 rounded appearance-none border border-[#86868b]/50 checked:bg-purple-500 checked:border-purple-500 transition-colors cursor-pointer"
                        />
                        <CheckCircle2 className="w-4 h-4 text-white absolute top-0 left-0 pointer-events-none opacity-0 data-[state=checked]:opacity-100" />
                      </div>
                      <label
                        htmlFor="terms"
                        className="text-xs text-[#86868b] leading-relaxed cursor-pointer"
                      >
                        ฉันยอมรับ{" "}
                        <a
                          href="#"
                          className="text-white hover:text-purple-400 transition-colors"
                        >
                          เงื่อนไขการใช้งาน
                        </a>{" "}
                        และ{" "}
                        <a
                          href="#"
                          className="text-white hover:text-purple-400 transition-colors"
                        >
                          นโยบายความเป็นส่วนตัว
                        </a>
                      </label>
                    </div>
                    {errors.accept_terms && (
                      <p className="text-xs text-red-400 font-medium pl-8">
                        {errors.accept_terms.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full h-14 mt-6 rounded-full bg-white hover:bg-gray-100 text-black font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    ถัดไป <ArrowRight className="w-4 h-4 opacity-70" />
                  </button>
                </form>

                <div className="mt-8 text-center text-[13px] text-[#86868b]">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href="/login"
                    className="text-white hover:text-purple-400 transition-colors font-medium border-b border-white hover:border-purple-400 pb-px"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ─── Step 1: Social handles ─── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label className="text-sm text-[#86868b] mb-1.5 block pl-1">
                    แพลตฟอร์มหลัก
                  </Label>
                  <Controller
                    name="primary_platform"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 focus:bg-[#323234]/80 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2c2c2e] border-white/10 text-white rounded-2xl">
                          <SelectItem
                            value="tiktok"
                            className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer"
                          >
                            TikTok
                          </SelectItem>
                          <SelectItem
                            value="instagram"
                            className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer"
                          >
                            Instagram
                          </SelectItem>
                          <SelectItem
                            value="youtube"
                            className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer"
                          >
                            YouTube
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Input
                    placeholder="TikTok Username (@username)"
                    {...register("tiktok_username")}
                    className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  />
                  {errors.tiktok_username && (
                    <p className="text-xs text-red-400 font-medium pl-2">
                      {errors.tiktok_username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Input
                    placeholder="Instagram Username (@username)"
                    {...register("instagram_username")}
                    className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <Input
                    placeholder="YouTube (ลิงก์ช่องหรือชื่อช่อง)"
                    {...register("youtube_channel")}
                    className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    onClick={() => setCurrentStep(0)}
                    type="button"
                    className="flex-1 h-14 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 text-white font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ChevronLeft className="w-4 h-4 opacity-70" /> ย้อนกลับ
                  </button>
                  <button
                    onClick={handleSocial}
                    type="button"
                    className="flex-1 h-14 rounded-full bg-white hover:bg-gray-100 text-black font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    ถัดไป <ArrowRight className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Step 2: Personal info ─── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="ชื่อจริง"
                        {...register("first_name")}
                        className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                      />
                      {errors.first_name && (
                        <p className="text-xs text-red-400 font-medium pl-2">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Input
                        placeholder="นามสกุล"
                        {...register("last_name")}
                        className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                      />
                      {errors.last_name && (
                        <p className="text-xs text-red-400 font-medium pl-2">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      placeholder="ชื่อที่ใช้แสดง (Display Name)"
                      {...register("display_name")}
                      className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                    />
                    {errors.display_name && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.display_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Input
                      type="tel"
                      placeholder="เบอร์โทรศัพท์"
                      {...register("phone")}
                      className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 placeholder:text-[#86868b] focus:bg-[#323234]/80 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-[#2c2c2e]/50 border-transparent text-white h-14 rounded-2xl pl-4 focus:bg-[#323234]/80 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium">
                            <SelectValue placeholder="ประเทศ" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2c2c2e] border-white/10 text-white rounded-2xl">
                            <SelectItem
                              value="Thailand"
                              className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer"
                            >
                              Thailand
                            </SelectItem>
                            <SelectItem
                              value="Other"
                              className="focus:bg-white/10 focus:text-white rounded-xl cursor-pointer"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.country && (
                      <p className="text-xs text-red-400 font-medium pl-2">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-14 rounded-full bg-white/10 hover:bg-white/15 border border-white/5 text-white font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <ChevronLeft className="w-4 h-4 opacity-70" /> ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-2 w-full h-14 rounded-full bg-white hover:bg-gray-100 text-black font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                      ) : (
                        <>
                          ลงทะเบียน{" "}
                          <ArrowRight className="w-4 h-4 opacity-70" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ─── Step 3: Success ─── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-linear-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-semibold text-white tracking-tight mb-2">
                  สมัครเรียบร้อยแล้ว!
                </h2>
                <p className="text-[15px] text-[#86868b] mb-10 leading-relaxed max-w-[280px] mx-auto">
                  ยินดีต้อนรับเข้าสู่ Windflow เตรียมตัวรับงานแรกของคุณได้เลย
                </p>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="w-full h-14 rounded-full bg-white hover:bg-gray-100 text-black font-medium text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  ไปยัง Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
