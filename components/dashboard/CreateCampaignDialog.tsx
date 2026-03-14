"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  ChevronDown,
  ImagePlus,
  Megaphone,
  DollarSign,
  Calendar,
  FileText,
  Globe,
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

interface CreateCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "All"];
const CATEGORIES = [
  "Food & Beverage",
  "Gaming",
  "Technology",
  "Beauty",
  "Education",
  "Fashion",
  "Travel",
  "Entertainment",
  "Finance",
  "Health",
];

type Step = "info" | "target" | "budget";

export default function CreateCampaignDialog({
  open,
  onClose,
  onSuccess,
}: CreateCampaignDialogProps) {
  const [step, setStep] = useState<Step>("info");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    platform: "TikTok",
    cpm: "",
    budget: "",
    start_date: "",
    end_date: "",
    brief_url: "",
    hashtags: "",
    min_followers: "",
    min_avg_views: "",
  });

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    setError(null);
    setSaving(true);
    try {
      await api({
        url: "/v1/campaign",
        method: "POST",

        body: {
          name: form.name,
          description: form.description,
          category: form.category,
          platform: form.platform,
          cpm: Number(form.cpm),
          budget: Number(form.budget),
          start_date: form.start_date,
          end_date: form.end_date,
          brief_url: form.brief_url,
          hashtags: form.hashtags
            .split(",")
            .map((h) => h.trim())
            .filter(Boolean),
          requirements: {
            min_followers: Number(form.min_followers) || 0,
            min_avg_views: Number(form.min_avg_views) || 0,
          },
        },
      });
      onSuccess?.();
      handleClose();
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสร้างแคมเปญ");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setStep("info");
    setError(null);
    setForm({
      name: "",
      description: "",
      category: "",
      platform: "TikTok",
      cpm: "",
      budget: "",
      start_date: "",
      end_date: "",
      brief_url: "",
      hashtags: "",
      min_followers: "",
      min_avg_views: "",
    });
    onClose();
  };

  const STEPS: { id: Step; label: string }[] = [
    { id: "info", label: "ข้อมูลแคมเปญ" },
    { id: "target", label: "กลุ่มเป้าหมาย" },
    { id: "budget", label: "งบประมาณ" },
  ];

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-xl bg-[#0f1420] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Header */}
              <div
                className="h-1"
                style={{
                  background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                }}
              />
              <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Megaphone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">
                      สร้างแคมเปญใหม่
                    </h2>
                    <p className="text-slate-500 text-xs">
                      {STEPS[stepIndex].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Step pills */}
              <div className="px-6 pt-4 flex gap-2">
                {STEPS.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      i <= stepIndex ? "bg-purple-500" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {/* ──── Step: info ──── */}
                {step === "info" && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Field
                      label="ชื่อแคมเปญ"
                      icon={<Megaphone className="w-4 h-4" />}
                    >
                      <Input
                        required
                        value={form.name}
                        onChange={set("name")}
                        placeholder="เช่น ชาไทยพรีเมียม สูตรใหม่"
                        className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] placeholder:text-slate-600"
                      />
                    </Field>
                    <Field
                      label="รายละเอียด"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder="อธิบาย brief ให้ Clipper เข้าใจว่าต้องทำอะไร..."
                        rows={3}
                        className="w-full bg-[#1a2235] border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 placeholder:text-slate-600 resize-none transition-colors"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="หมวดหมู่">
                        <Select
                          value={form.category}
                          onValueChange={(v) =>
                            setForm({ ...form, category: v })
                          }
                        >
                          <SelectTrigger className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl">
                            <SelectValue placeholder="เลือกหมวด" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a2235] border-white/10">
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="แพลตฟอร์ม">
                        <Select
                          value={form.platform}
                          onValueChange={(v) =>
                            setForm({ ...form, platform: v })
                          }
                        >
                          <SelectTrigger className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a2235] border-white/10">
                            {PLATFORMS.map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                    <Field
                      label="Brief URL (ถ้ามี)"
                      icon={<Globe className="w-4 h-4" />}
                    >
                      <Input
                        value={form.brief_url}
                        onChange={set("brief_url")}
                        placeholder="https://docs.google.com/..."
                        className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] placeholder:text-slate-600"
                      />
                    </Field>
                    <Field label="Hashtag (คั่นด้วยจุลภาค)">
                      <Input
                        value={form.hashtags}
                        onChange={set("hashtags")}
                        placeholder="#windflu, #ชาไทย, #review"
                        className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] placeholder:text-slate-600"
                      />
                    </Field>
                  </motion.div>
                )}

                {/* ──── Step: target ──── */}
                {step === "target" && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-400 text-sm">
                      กำหนดคุณสมบัติขั้นต่ำของ Clipper ที่รับงานได้
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="ผู้ติดตามอย่างน้อย">
                        <div className="relative">
                          <Input
                            type="number"
                            value={form.min_followers}
                            onChange={set("min_followers")}
                            placeholder="1000"
                            className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] pr-12 placeholder:text-slate-600"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                            คน
                          </span>
                        </div>
                      </Field>
                      <Field label="ยอดวิวเฉลี่ยอย่างน้อย">
                        <div className="relative">
                          <Input
                            type="number"
                            value={form.min_avg_views}
                            onChange={set("min_avg_views")}
                            placeholder="500"
                            className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] pr-14 placeholder:text-slate-600"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                            วิว
                          </span>
                        </div>
                      </Field>
                    </div>
                    <Field
                      label="วันเริ่มแคมเปญ"
                      icon={<Calendar className="w-4 h-4" />}
                    >
                      <Input
                        type="date"
                        value={form.start_date}
                        onChange={set("start_date")}
                        className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235]"
                      />
                    </Field>
                    <Field
                      label="วันสิ้นสุดแคมเปญ"
                      icon={<Calendar className="w-4 h-4" />}
                    >
                      <Input
                        type="date"
                        value={form.end_date}
                        onChange={set("end_date")}
                        className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235]"
                      />
                    </Field>
                  </motion.div>
                )}

                {/* ──── Step: budget ──── */}
                {step === "budget" && (
                  <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <Field
                      label="CPM (บาท / 1,000 วิว)"
                      icon={<DollarSign className="w-4 h-4" />}
                    >
                      <div className="relative">
                        <Input
                          type="number"
                          value={form.cpm}
                          onChange={set("cpm")}
                          placeholder="50"
                          className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] pl-8 placeholder:text-slate-600"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          ฿
                        </span>
                      </div>
                    </Field>
                    <Field
                      label="งบประมาณรวม (บาท)"
                      icon={<DollarSign className="w-4 h-4" />}
                    >
                      <div className="relative">
                        <Input
                          type="number"
                          value={form.budget}
                          onChange={set("budget")}
                          placeholder="100000"
                          className="bg-[#1a2235] border-white/10 text-white h-11 rounded-xl focus:bg-[#1a2235] pl-8 placeholder:text-slate-600"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                          ฿
                        </span>
                      </div>
                    </Field>

                    {/* Budget summary card */}
                    {form.cpm && form.budget && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-2">
                        <p className="text-purple-300 text-xs font-semibold uppercase tracking-widest">
                          สรุปงบประมาณ
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">CPM</span>
                          <span className="text-white font-bold">
                            ฿{Number(form.cpm).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">งบรวม</span>
                          <span className="text-white font-bold">
                            ฿{Number(form.budget).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-purple-500/20 pt-2 mt-2">
                          <span className="text-slate-400">คาดได้วิวรวม</span>
                          <span className="text-cyan-400 font-bold">
                            {Math.floor(
                              (Number(form.budget) / Number(form.cpm)) * 1000,
                            ).toLocaleString()}{" "}
                            วิว
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3 border-t border-white/10 pt-4">
                {stepIndex > 0 && (
                  <button
                    onClick={() => setStep(STEPS[stepIndex - 1].id)}
                    className="flex-1 h-11 rounded-xl border border-white/10 text-slate-400 hover:border-white/20 hover:text-white font-semibold text-sm transition-all"
                  >
                    ย้อนกลับ
                  </button>
                )}
                {stepIndex < STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep(STEPS[stepIndex + 1].id)}
                    disabled={step === "info" && !form.name}
                    className="flex-2 h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                    }}
                  >
                    ถัดไป <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={saving || !form.name || !form.budget}
                    className="flex-2 h-11 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                    style={{
                      background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                    }}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "🚀 เผยแพร่แคมเปญ"
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
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
