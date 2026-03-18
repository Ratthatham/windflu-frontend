"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ChevronDown,
  Megaphone,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Plus,
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
import { cn } from "@/lib/utils";
import Editor from "@/components/common/editor";
import { INDUSTRIES } from "@/constants/industries";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "All"];

type Step = "info" | "target" | "budget";
const STEPS: { id: Step; label: string; desc: string }[] = [
  { id: "info", label: "ข้อมูลแคมเปญ", desc: "ชื่อ, รายละเอียด, รูปภาพ" },
  {
    id: "target",
    label: "กลุ่มเป้าหมาย",
    desc: "เงื่อนไข Clipper และระยะเวลา",
  },
  { id: "budget", label: "งบประมาณ", desc: "CPM และงบรวมของแคมเปญ" },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    platform: "TikTok",
    price_per_1000_views: "",
    budget: "",
    target_views: "",
    start_date: "",
    end_date: "",
    requirements: "", // comma-separated → string[]
    images: [] as string[],
  });

  const set =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    const formData = new FormData();
    const selectedFiles = Array.from(files);

    for (const file of selectedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`ไฟล์ที่แนบไม่ใช่รูปภาพที่รองรับ (รับเฉพาะ JPEG, PNG, WEBP)`);
        setUploading(false);
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`ไฟล์ "${file.name}" มีขนาดใหญ่เกินไป (สูงสุด 5MB)`);
        setUploading(false);
        return;
      }
      formData.append("images", file);
    }

    try {
      const res = await api({
        url: "/v1/campaigns/images",
        method: "POST",
        body: formData,
      });

      if (res && Array.isArray(res.urls)) {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, ...res.urls],
        }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await api({
        url: "/v1/campaigns",
        method: "POST",
        body: {
          title: form.title,
          description: form.description,
          category: form.category,
          platform: form.platform,
          price_per_1000_views: Number(form.price_per_1000_views),
          budget: Number(form.budget),
          target_views: Number(form.target_views) || 0,
          start_date: form.start_date,
          end_date: form.end_date,
          images: form.images,
          requirements: form.requirements
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        },
      });

      const campaignId = res.campaign_id;
      const budgetAmount = Number(form.budget);

      if (budgetAmount < 50000) {
        // Instant redirect to dedicated payment page
        router.push(`/brand/payment/${campaignId}`);
        return;
      }

      // If budget >= 50,000, show the contact back screen
      setDone(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการสร้างแคมเปญ");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    const isLargeBudget = Number(form.budget) >= 50000;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4",
              isLargeBudget ? "bg-blue-50" : "bg-green-50",
            )}
          >
            {isLargeBudget ? (
              <Megaphone className="w-12 h-12 text-blue-500" />
            ) : (
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {isLargeBudget ? "ได้รับข้อมูลแคมเปญแล้ว!" : "สร้างแคมเปญสำเร็จ!"}
          </h2>
          <p className="text-slate-500 font-bold mb-8 max-w-sm mx-auto">
            {isLargeBudget ? (
              "Windflu จะติดต่อกลับในอีกสักครู่ เพื่อดำเนินการในขั้นตอนถัดไป"
            ) : (
              <>
                แคมเปญ "{form.title}" ถูกสร้างแล้ว
                <br />
                กรุณาชำระเงินเพื่อให้ระบบเริ่มดำเนินการ
              </>
            )}
          </p>
          <button
            onClick={() => router.push("/brand/dashboard")}
            className="px-10 h-14 rounded-2xl bg-slate-900 text-white font-black text-base shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:bg-slate-800"
          >
            กลับไปยังหน้าหลัก
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-4">
      {/* Stepper */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => i < stepIndex && setStep(s.id)}
            className="flex-1 text-left"
          >
            <div
              className={`h-1 mx-1 rounded-full mb-2 transition-all ${i <= stepIndex ? "bg-brand-purple" : "bg-slate-200"}`}
            />
            <p
              className={`text-xs font-bold transition-colors px-1 ${i === stepIndex ? "text-slate-900" : i < stepIndex ? "text-brand-purple" : "text-slate-400"}`}
            >
              {i + 1}. {s.label}
            </p>
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl text-xs font-bold flex items-center gap-2">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Card wrapper */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 space-y-6">
          {/* ──── Step: info ──── */}
          {step === "info" && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Field
                label="ชื่อแคมเปญ"
                icon={<Megaphone className="w-4 h-4" />}
              >
                <Input
                  required
                  value={form.title}
                  onChange={set("title")}
                  placeholder="เช่น ชาไทยพรีเมียม สูตรใหม่"
                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white placeholder:text-slate-400 font-bold"
                />
              </Field>

              <Field label="รายละเอียด" icon={<FileText className="w-4 h-4" />}>
                <Editor
                  content={form.description}
                  onChange={(v) => setForm({ ...form, description: v })}
                />
              </Field>

              <Field
                label="รูปภาพแคมเปญ"
                icon={<ImageIcon className="w-4 h-4" />}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {form.images.map((url) => (
                      <motion.div
                        key={url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group"
                      >
                        <img
                          src={url}
                          alt="Campaign"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage(url)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {form.images.length < 4 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                      ) : (
                        <>
                          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            เพิ่มรูป
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="หมวดหมู่">
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl font-bold">
                      <SelectValue placeholder="เลือกหมวด" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {INDUSTRIES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="font-bold text-slate-600 focus:bg-slate-50"
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="แพลตฟอร์ม">
                  <Select
                    value={form.platform}
                    onValueChange={(v) => setForm({ ...form, platform: v })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {PLATFORMS.map((p) => (
                        <SelectItem
                          key={p}
                          value={p}
                          className="font-bold text-slate-600 focus:bg-slate-50"
                        >
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="เงื่อนไข Clipper (คั่นด้วยจุลภาค)">
                <Input
                  value={form.requirements}
                  onChange={set("requirements")}
                  placeholder="เช่น ต้องมีผู้ติดตาม 1000+, ต้องลง TikTok"
                  className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white placeholder:text-slate-400 font-bold"
                />
              </Field>
            </motion.div>
          )}

          {/* ──── Step: target ──── */}
          {step === "target" && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <p className="text-slate-400 text-sm font-bold mb-2">
                กำหนดช่วงเวลาของแคมเปญ
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="วันเริ่มแคมเปญ"
                  icon={<Calendar className="w-4 h-4" />}
                >
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={set("start_date")}
                    className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white font-bold"
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
                    className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white font-bold"
                  />
                </Field>
              </div>
            </motion.div>
          )}

          {/* ──── Step: budget ──── */}
          {step === "budget" && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="ค่าจ้างต่อ 1,000 วิว"
                  icon={<DollarSign className="w-4 h-4" />}
                >
                  <div className="relative">
                    <Input
                      type="number"
                      value={form.price_per_1000_views}
                      onChange={set("price_per_1000_views")}
                      placeholder="50"
                      className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white pl-10 placeholder:text-slate-400 font-bold"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">
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
                      className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white pl-10 placeholder:text-slate-400 font-bold"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                      ฿
                    </span>
                  </div>
                </Field>
              </div>

              <Field
                label="เป้าหมายยอดวิว"
                icon={<DollarSign className="w-4 h-4" />}
              >
                <div className="relative">
                  <Input
                    type="number"
                    value={form.target_views}
                    onChange={set("target_views")}
                    placeholder="1000000"
                    className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl focus:bg-white pr-14 placeholder:text-slate-400 font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-widest leading-none mt-0.5">
                    วิว
                  </span>
                </div>
              </Field>

              {form.price_per_1000_views && form.budget && (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
                    สรุปแคมเปญ
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-400">
                        Price / 1K Views
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ฿{Number(form.price_per_1000_views).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-400">
                        งบรวมได้รับ
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ฿{Number(form.budget).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-900/10 gap-1">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                      คาดการณ์ยอดวิวทั้งหมด
                    </span>
                    <span className="text-3xl font-black text-brand-cyan">
                      ~
                      {Math.floor(
                        (Number(form.budget) /
                          Number(form.price_per_1000_views)) *
                          1000,
                      ).toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
                      Views
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer nav */}
        <div className="px-8 pb-8 flex gap-4">
          {stepIndex > 0 && (
            <button
              onClick={() => setStep(STEPS[stepIndex - 1].id)}
              className="flex-1 h-14 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95"
            >
              ย้อนกลับ
            </button>
          )}
          {stepIndex < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(STEPS[stepIndex + 1].id)}
              disabled={step === "info" && (!form.title || uploading)}
              className="flex-2 h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-slate-900/10 active:scale-95"
            >
              ถัดไป <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving || !form.title || !form.budget}
              className="flex-2 h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg shadow-slate-900/10 active:scale-95"
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
    </div>
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
      <label className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
        {icon && <span className="text-slate-500">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}
