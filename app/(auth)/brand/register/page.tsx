"use client";

import { useState } from "react";
import {
  Loader2,
  Building2,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Globe,
  Phone,
  User,
  Mail,
  Lock,
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

import Link from "next/link";
import api from "@/app/utils/api";

import { INDUSTRIES } from "@/constants/industries";

const COMPANY_SIZES = [
  "1–10 คน",
  "11–50 คน",
  "51–200 คน",
  "201–500 คน",
  "500+ คน",
];

const STEPS = [
  { label: "ข้อมูลบัญชี", desc: "อีเมล รหัสผ่าน ชื่อผู้ติดต่อ" },
  { label: "ข้อมูลแบรนด์", desc: "ชื่อบริษัท อุตสาหกรรม เว็บไซต์" },
];

export default function BrandRegisterPage() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    contact_name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
    industry: "",
    company_size: "",
    website: "",
    description: "",
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api({
        url: "/v1/auth/brands/register",
        method: "POST",
        body: {
          email: form.email,
          password: form.password,
          contact_name: form.contact_name,
          phone: form.phone,
          company_name: form.company_name,
          industry: form.industry,
          company_size: form.company_size,
          website: form.website,
          description: form.description,
          accept_terms: true,
        },
      });
      setDone(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex w-5/12 p-12 flex-col justify-between relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg,#1a1200 0%,#7c4a00 50%,#d97706 100%)",
        }}
      >
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
            สร้างแคมเปญ
            <br />
            <span className="text-amber-400">จ่ายตามยอดวิวจริง</span>
          </h1>
          <p className="text-white/70 text-lg max-w-sm">
            ไม่มีค่าดำเนินการแฝง จ่ายเฉพาะผลลัพธ์จริงๆ จาก Clipper ที่คุณเลือก
          </p>
        </div>

        {/* Step progress indicator */}
        <div className="relative z-10 space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 transition-all ${i <= step ? "opacity-100" : "opacity-30"}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  i < step
                    ? "bg-amber-400 border-amber-400 text-black"
                    : i === step
                      ? "bg-amber-400/20 border-amber-400/40 text-amber-400"
                      : "bg-white/5 border-white/10 text-white/30"
                }`}
              >
                {i < step ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{i + 1}</span>
                )}
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {s.label}
                </div>
                <div className="text-white/50 text-xs">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 bg-[#0d0f14] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold text-white">
              Windflu <span className="text-amber-400 font-black">Brands</span>
            </span>
          </Link>

          {/* Success screen */}
          {done ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                สมัครสำเร็จแล้ว!
              </h2>
              <p className="text-slate-400 mb-8">
                ยินดีต้อนรับสู่ Windflu Brands — สร้างแคมเปญแรกของคุณได้เลย
              </p>
              <Link href="/brand/login">
                <button
                  className="h-14 px-8 rounded-2xl text-base font-semibold text-black flex items-center gap-2 mx-auto"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                  }}
                >
                  เข้าสู่ระบบ <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Step pills (mobile) */}
              <div className="flex gap-2 mb-6 lg:hidden">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all ${i <= step ? "bg-amber-400" : "bg-white/10"}`}
                  />
                ))}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 mb-6">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">
                  Brand Portal · ขั้นตอน {step + 1}/{STEPS.length}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                {STEPS[step].label}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                {step === 0 ? (
                  <>
                    มีบัญชีแล้ว?{" "}
                    <Link
                      href="/brand/login"
                      className="text-amber-400 font-bold hover:underline"
                    >
                      เข้าสู่ระบบ
                    </Link>
                  </>
                ) : (
                  "ข้อมูลบริษัทของคุณ"
                )}
              </p>

              {error && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* ── Step 0: Account ── */}
              {step === 0 && (
                <motion.form
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(1);
                  }}
                  className="space-y-4"
                >
                  <BrandField
                    label="ชื่อผู้ติดต่อหลัก"
                    icon={<User className="w-4 h-4" />}
                  >
                    <Input
                      required
                      value={form.contact_name}
                      onChange={set("contact_name")}
                      placeholder="ชื่อ-นามสกุล"
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <BrandField
                    label="อีเมลบริษัท"
                    icon={<Mail className="w-4 h-4" />}
                  >
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="hello@company.com"
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <BrandField
                    label="รหัสผ่าน"
                    icon={<Lock className="w-4 h-4" />}
                  >
                    <Input
                      required
                      type="password"
                      value={form.password}
                      onChange={set("password")}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <BrandField
                    label="เบอร์โทรศัพท์"
                    icon={<Phone className="w-4 h-4" />}
                  >
                    <Input
                      required
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="08X-XXX-XXXX"
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <button
                    type="submit"
                    className="w-full h-14 rounded-2xl font-semibold text-black flex items-center justify-center gap-2 mt-2"
                    style={{
                      background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                    }}
                  >
                    ถัดไป <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.form>
              )}

              {/* ── Step 1: Brand Info ── */}
              {step === 1 && (
                <motion.form
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <BrandField
                    label="ชื่อบริษัท / แบรนด์"
                    icon={<Building2 className="w-4 h-4" />}
                  >
                    <Input
                      required
                      value={form.company_name}
                      onChange={set("company_name")}
                      placeholder="เช่น Thai Tea Co."
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <div className="grid grid-cols-2 gap-3">
                    <BrandField label="อุตสาหกรรม">
                      <Select
                        value={form.industry}
                        onValueChange={(v) => setForm({ ...form, industry: v })}
                      >
                        <SelectTrigger className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:border-amber-500">
                          <SelectValue placeholder="เลือก" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a2036] border-[#1e293b]">
                          {INDUSTRIES.map((i) => (
                            <SelectItem key={i} value={i}>
                              {i}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </BrandField>
                    <BrandField label="ขนาดองค์กร">
                      <Select
                        value={form.company_size}
                        onValueChange={(v) =>
                          setForm({ ...form, company_size: v })
                        }
                      >
                        <SelectTrigger className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:border-amber-500">
                          <SelectValue placeholder="เลือก" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a2036] border-[#1e293b]">
                          {COMPANY_SIZES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </BrandField>
                  </div>
                  <BrandField
                    label="เว็บไซต์ (ถ้ามี)"
                    icon={<Globe className="w-4 h-4" />}
                  >
                    <Input
                      value={form.website}
                      onChange={set("website")}
                      placeholder="https://www.company.com"
                      className="bg-[#161b28] border-[#1e293b] text-white h-12 rounded-xl focus:bg-[#161b28] focus:border-amber-500 placeholder:text-slate-600"
                    />
                  </BrandField>
                  <BrandField
                    label="แนะนำแบรนด์สั้นๆ"
                    icon={<Briefcase className="w-4 h-4" />}
                  >
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="บอกให้ Clipper รู้จักแบรนด์ของคุณ..."
                      rows={3}
                      className="w-full bg-[#161b28] border border-[#1e293b] text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 placeholder:text-slate-600 resize-none transition-colors"
                    />
                  </BrandField>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex-1 h-14 rounded-2xl border border-[#1e293b] text-slate-400 hover:border-amber-500/50 font-semibold text-sm transition-all"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !form.company_name}
                      className="flex-2 h-14 rounded-2xl font-semibold text-sm text-black flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                      }}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <>
                          สมัครสมาชิก <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BrandField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
