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
} from "lucide-react";
import { motion } from "framer-motion";
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

const STEPS = [
  { icon: User, label: "สมัครสมาชิก", desc: "บัญชีผู้ใช้" },
  { icon: Link2, label: "เชื่อม Social", desc: "ช่องทางของคุณ" },
  { icon: User, label: "ข้อมูลส่วนตัว", desc: "ข้อมูลติดต่อ" },
  { icon: Rocket, label: "เริ่มรับงาน", desc: "พร้อมหาเงินเลย" },
];

const CATEGORIES = [
  "Lifestyle",
  "Gaming",
  "Entertainment",
  "Education",
  "Technology",
  "Beauty",
  "Food",
  "Travel",
  "Finance",
];

interface Form {
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accept_terms?: boolean;
  phone: string;
  payment_method: string;
  payment_account: string;
  tiktok_username: string;
  instagram_username: string;
  youtube_channel: string;
  primary_platform: string;
  followers_count: number;
  avg_views: number;
  content_category: string[];
  country: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Form>({
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
  });

  const handleNextStep0 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (form.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }
    if (!form.accept_terms) {
      setError("กรุณายอมรับเงื่อนไขการใช้งาน");
      return;
    }
    setError(null);
    setCurrentStep(1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.first_name ||
      !form.last_name ||
      !form.display_name ||
      !form.phone ||
      !form.country
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await api({
        url: "/v1/auth/creators/register",
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
          first_name: form.first_name,
          last_name: form.last_name,
          display_name: form.display_name || form.email.split("@")[0],
          phone: form.phone,
          accept_terms: true,
          tiktok_username: form.tiktok_username,
          instagram_username: form.instagram_username,
          youtube_channel: form.youtube_channel,
          primary_platform: form.primary_platform,
          followers_count: form.followers_count,
          avg_views: form.avg_views,
          content_category: form.content_category,
          country: form.country,
        },
      });
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setSaving(false);
    }
  };

  const handleSocial = () => {
    if (
      !form.tiktok_username &&
      !form.instagram_username &&
      !form.youtube_channel
    )
      return;
    setCurrentStep(2);
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      content_category: prev.content_category.includes(cat)
        ? prev.content_category.filter((c) => c !== cat)
        : [...prev.content_category, cat],
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* ——— Left panel ——— */}
      <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-40 right-20 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <Wind className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold text-white">Windflu</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4 leading-snug">
            เริ่มหารายได้จาก
            <br />
            การตัดคลิปวันนี้
          </h1>
          <p className="text-white/70 text-lg max-w-sm">
            สมัครฟรี ไม่ต้องมีฟอลโลว์เยอะ แค่มีฝีมือตัดคลิป ก็มีรายได้ได้เลย
          </p>
        </div>

        {/* Step progress */}
        <div className="relative z-10 space-y-6">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 transition-all duration-300 ${
                i <= currentStep ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  i < currentStep
                    ? "bg-white text-blue-600"
                    : i === currentStep
                      ? "bg-white/20 text-white border border-white/40"
                      : "bg-white/10 text-white/50"
                }`}
              >
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {step.label}
                </div>
                <div className="text-white/60 text-xs">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ——— Right panel ——— */}
      <div className="flex-1 bg-[#0a0e1a] flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md flex-1 flex flex-col ">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Wind className="w-6 h-6" style={{ color: "#8B5CF6" }} />
            <span className="text-xl font-bold text-white">Windflu</span>
          </Link>

          {/* Mobile step indicator */}
          {currentStep < 3 && (
            <div className="lg:hidden flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-medium text-slate-400">
                ขั้นตอนที่ {currentStep + 1} จาก 3
              </span>
              <div className="flex gap-2">
                <div
                  className={`h-1.5 w-6 rounded-full ${
                    currentStep === 0 ? "bg-purple-500" : "bg-purple-500/30"
                  }`}
                />
                <div
                  className={`h-1.5 w-6 rounded-full ${
                    currentStep === 1 ? "bg-purple-500" : "bg-purple-500/30"
                  }`}
                />
                <div
                  className={`h-1.5 w-6 rounded-full ${
                    currentStep === 2 ? "bg-purple-500" : "bg-purple-500/30"
                  }`}
                />
              </div>
            </div>
          )}

          {/* ─── Step 0: Account info ─── */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#ede8f5] rounded-2xl p-4 w-full relative overflow-hidden m-auto"
              style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.1)" }}
            >
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                style={{
                  background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                }}
              />

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <Wind className="w-6 h-6" style={{ color: "#8B5CF6" }} />
                  <span
                    className="font-black text-lg"
                    style={{
                      background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Windflow
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-[#1a1230] mb-1">
                  สมัครเป็น Clipper
                </h1>
                <p className="text-sm text-[#6b5f8a]">
                  เริ่มหาเงินจากการตัดคลิปได้เลย
                </p>
              </div>

              <form onSubmit={handleNextStep0} className="space-y-4">
                <div>
                  <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                    อีเมล
                  </Label>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                    รหัสผ่าน
                  </Label>
                  <Input
                    required
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    placeholder="อย่างน้อย 6 ตัว"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                    ยืนยันรหัสผ่าน
                  </Label>
                  <Input
                    required
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                    className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    placeholder="ใส่รหัสผ่านอีกครั้ง"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.accept_terms}
                    onChange={(e) =>
                      setForm({ ...form, accept_terms: e.target.checked })
                    }
                    className="mt-1 w-4 h-4 rounded border-[#ede8f5] accent-[#8B5CF6]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-[#6b5f8a] leading-relaxed"
                  >
                    ยอมรับ{" "}
                    <a href="#" className="text-[#8B5CF6] hover:underline">
                      เงื่อนไขการใช้งาน
                    </a>{" "}
                    และ{" "}
                    <a href="#" className="text-[#8B5CF6] hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 mt-2 text-white"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                >
                  ถัดไป <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#ede8f5] text-center">
                <p className="text-sm text-[#6b5f8a]">
                  มีบัญชีอยู่แล้ว?{" "}
                  <button className="text-[#8B5CF6] font-semibold hover:underline">
                    เข้าสู่ระบบ
                  </button>
                </p>
                <p className="text-xs text-[#c4b8e0] mt-3">
                  สมัครเป็นแบรนด์?{" "}
                  <Link
                    href={"RegisterBrand"}
                    className="text-[#8B5CF6] font-semibold hover:underline"
                  >
                    คลิกที่นี่
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ─── Step 1: Social handles ─── */}
          {currentStep === 1 && (
            <div className="w-full flex-1 flex flex-col items-center justify-center ">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-[#ede8f5] rounded-2xl p-4 w-full relative overflow-hidden m-auto"
                style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.1)" }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                />

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1a1230] mb-1">
                    เชื่อมบัญชี Social Media
                  </h2>
                  <p className="text-sm text-[#6b5f8a]">
                    เชื่อมอย่างน้อย 1 บัญชี เพื่อเริ่มรับงาน
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      แพลตฟอร์มหลัก
                    </label>
                    <Select
                      value={form.primary_platform}
                      onValueChange={(v) =>
                        setForm({ ...form, primary_platform: v })
                      }
                    >
                      <SelectTrigger className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#ede8f5]">
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      TikTok
                    </label>
                    <Input
                      placeholder="@username"
                      value={form.tiktok_username}
                      onChange={(e) =>
                        setForm({ ...form, tiktok_username: e.target.value })
                      }
                      className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      Instagram
                    </label>
                    <Input
                      placeholder="@username"
                      value={form.instagram_username}
                      onChange={(e) =>
                        setForm({ ...form, instagram_username: e.target.value })
                      }
                      className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      YouTube
                    </label>
                    <Input
                      placeholder="ลิงก์ช่องหรือชื่อช่อง"
                      value={form.youtube_channel}
                      onChange={(e) =>
                        setForm({ ...form, youtube_channel: e.target.value })
                      }
                      className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="flex-1 h-12 rounded-xl text-base font-semibold border border-[#ede8f5] text-[#6b5f8a] hover:bg-[#fafafa] transition-all"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      onClick={handleSocial}
                      disabled={
                        !form.tiktok_username &&
                        !form.instagram_username &&
                        !form.youtube_channel
                      }
                      className="flex-2 h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                      }}
                    >
                      ถัดไป <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full flex-1 flex flex-col items-center justify-center ">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-[#ede8f5] rounded-2xl p-4 w-full relative overflow-hidden m-auto"
                style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.1)" }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                />

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#1a1230] mb-1">
                    ข้อมูลส่วนตัว
                  </h2>
                  <p className="text-sm text-[#6b5f8a]">
                    กรอกข้อมูลเพื่อให้ระบบสมบูรณ์
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                        ชื่อจริง
                      </Label>
                      <Input
                        required
                        value={form.first_name}
                        onChange={(e) =>
                          setForm({ ...form, first_name: e.target.value })
                        }
                        className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                        นามสกุล
                      </Label>
                      <Input
                        required
                        value={form.last_name}
                        onChange={(e) =>
                          setForm({ ...form, last_name: e.target.value })
                        }
                        className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      ชื่อที่ใช้แสดง (Display Name)
                    </Label>
                    <Input
                      required
                      value={form.display_name}
                      onChange={(e) =>
                        setForm({ ...form, display_name: e.target.value })
                      }
                      className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      เบอร์โทรศัพท์
                    </Label>
                    <Input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl"
                    />
                  </div>

                  <div>
                    <Label className="text-sm text-[#6b5f8a] mb-1.5 block">
                      ประเทศ
                    </Label>
                    <Select
                      value={form.country}
                      onValueChange={(v) => setForm({ ...form, country: v })}
                    >
                      <SelectTrigger className="bg-[#fafafa] border-[#ede8f5] text-[#1a1230] h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#ede8f5]">
                        <SelectItem value="Thailand">Thailand</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 h-12 rounded-xl text-base font-semibold border border-[#ede8f5] text-[#6b5f8a] hover:bg-[#fafafa] transition-all"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-2 h-12 rounded-xl text-base font-semibold flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                      }}
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          ลงทะเบียนเลย <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* ─── Step 2: Success ─── */}
          {currentStep === 3 && (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#ede8f5] rounded-2xl p-4 w-full text-center relative overflow-hidden m-auto"
                style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.1)" }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                />
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 mt-2"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1230] mb-2">
                  สมัครเรียบร้อยแล้ว!
                </h2>
                <p className="text-[#6b5f8a] mb-8">
                  ยินดีต้อนรับเข้าสู่ Windflow —
                  พร้อมเริ่มหารายได้จากคลิปสั้นแล้ว
                </p>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="h-12 w-full px-8 rounded-xl text-base font-semibold text-white flex justify-center items-center gap-2 mx-auto"
                  style={{
                    background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                  }}
                >
                  ไปหน้า Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
