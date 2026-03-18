"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Film,
  Send,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import { th } from "date-fns/locale";
import api from "@/app/utils/api";
import Cookies from "js-cookie";
import { AUTH_KEYS } from "@/constants/auth";

/* ── Mock Data ────────────────────────── */

const initialMockDrafts = [
  {
    id: "draft_1",
    campaign_id: "cam_1",
    campaign_title: "แคมเปญสกินแคร์เกาหลี",
    status: "pending_review",
    platform: "tiktok",
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    note: "เน้นความใสของผิวครับ",
  },
  {
    id: "draft_2",
    campaign_id: "cam_2",
    campaign_title: "รีวิวมือถือรุ่นใหม่ล่าสุด",
    status: "returned",
    platform: "youtube",
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    return_reason: "ไฟล์วิดีโอเสียงแตก รบกวนตรวจสอบอีกครั้ง",
    note: "รีวิวฟีเจอร์กล้องชัดๆ",
  },
];

/* ── Components ────────────────────────── */

const TIMELINE_STEPS = [
  { key: "uploaded", label: "อัปโหลดแล้ว" },
  { key: "pending_review", label: "รอรีวิว" },
  { key: "reviewed", label: "ผลรีวิว" },
  { key: "posted", label: "Submit ลิงก์" },
];

function DraftTimeline({ draft }: { draft: any }) {
  const isReturned = draft.status === "returned";
  const isApproved = draft.status === "approved" || draft.status === "active";
  const isPending = draft.status === "pending_review";

  const hasSubmission = false;
  const activeStep = hasSubmission
    ? 3
    : isApproved || isReturned
      ? 2
      : isPending
        ? 1
        : 0;

  return (
    <div className="flex items-center gap-1 mt-4">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i < activeStep;
        const isCurrent = i === activeStep;
        const isReturnedStep = i === 2 && isReturned;
        const isLockedSubmit = i === 3 && !isApproved;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all shadow-sm"
                style={
                  isReturnedStep
                    ? {
                        background: "#ffe4f0",
                        borderColor: "#c2185b",
                        color: "#c2185b",
                      }
                    : isDone || isCurrent
                      ? {
                          background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
                          borderColor: "transparent",
                          color: "#fff",
                        }
                      : {
                          background: "#fafafa",
                          borderColor: "#ede8f5",
                          color: "#c4b8e0",
                        }
                }
              >
                {isReturnedStep ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : isDone || isCurrent ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className="text-xs mt-1.5 whitespace-nowrap font-bold tracking-tight"
                style={{
                  color: isReturnedStep
                    ? "#c2185b"
                    : isDone || isCurrent
                      ? "#8B5CF6"
                      : "#c4b8e0",
                }}
              >
                {isLockedSubmit ? "ล็อก" : step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className="flex-1 h-1 mb-5 rounded-full"
                style={{
                  background:
                    i < activeStep
                      ? "linear-gradient(135deg,#8B5CF6,#22D3EE)"
                      : "#e2e8f0",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function SubmitDraftPage() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [form, setForm] = useState({ campaign_id: "", platform: "", note: "" });
  const [resubmitDraft, setResubmitDraft] = useState<any>(null);

  // Fetch real campaigns
  const { data: campaignsData } = useQuery({
    queryKey: ["campaigns"],
    queryFn: () => api({ url: "/v1/campaigns" }),
  });
  const campaigns = campaignsData?.items || campaignsData?.campaigns || [];

  // Fetch real submissions (Mock for now as there's no clear endpoint in swagger)
  const { data: myDraftsData } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      return { items: initialMockDrafts };
    },
  });
  const myDrafts = myDraftsData?.items || [];

  // Initialize form if URL has campaign_id
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const campaign_id = params.get("id") || "";
      if (campaign_id) {
        setForm((prev) => ({ ...prev, campaign_id }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      toast.error("ยังไม่ได้เลือกไฟล์เลย ลองเลือกอีกทีนะ");
      return;
    }

    const creatorId = Cookies.get("user_id");
    if (!creatorId) {
      toast.error("ไม่พบข้อมูลผู้ใช้งาน กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    setUploading(true);

    try {
      const submissionRes = await api({
        url: `/v1/campaigns/${form.campaign_id}/submissions`,
        method: "POST",
        body: {
          creator_id: creatorId,
          video_title: form.campaign_id,
          description: form.note,
        },
      });

      const submissionId = submissionRes.id || submissionRes.submission_id;
      if (!submissionId) throw new Error("Failed to create submission record");

      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("platform", form.platform);
      formData.append("posted_at", format(new Date(), "yyyy-MM-dd"));

      const token = Cookies.get(AUTH_KEYS.ACCESS_TOKEN);
      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/submissions/${submissionId}/video`,
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.message || "Video upload failed");
      }

      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      setForm({ campaign_id: "", platform: "", note: "" });
      setVideoFile(null);
      setResubmitDraft(null);

      toast.success("ส่ง Draft ให้แบรนด์แล้ว รอดูนะ", {
        description: "แบรนด์จะตรวจสอบผลงานของคุณและแจ้งกลับผ่านระบบ",
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("เกิดข้อผิดพลาดในการส่งงาน ลองใหม่อีกครั้งนะ", {
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = (draft: any) => {
    setResubmitDraft(draft);
    setForm({
      campaign_id: draft.campaign_id,
      platform: draft.platform,
      note: "",
    });
    setVideoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
          ส่งผลงาน (Draft)
        </h1>
        <p className="text-slate-500 text-lg">
          ส่ง Draft ให้แบรนด์ดูก่อน แล้วค่อยโพสต์จริงนะ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[32px] p-8 sticky top-10 overflow-hidden transition-all duration-500 shadow-sm"
          >
            <div
              className="absolute inset-x-0 top-0 h-1.5"
              style={{ background: "linear-gradient(90deg,#9333ea,#3b82f6)" }}
            />

            {resubmitDraft && (
              <div
                className="mb-6 p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
                style={{ background: "#fdf2f8", borderColor: "#fbcfe8" }}
              >
                <RefreshCw
                  className="w-5 h-5 shrink-0 mt-0.5"
                  style={{ color: "#be185d" }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-black"
                    style={{ color: "#be185d" }}
                  >
                    กำลังส่งงานใหม่ (Resubmit)
                  </p>
                  <p className="text-xs text-[#6b5f8a] font-bold mt-0.5">
                    สำหรับแคมเปญ: {resubmitDraft.campaign_title}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResubmitDraft(null);
                    setForm({ campaign_id: "", platform: "", note: "" });
                    setVideoFile(null);
                  }}
                  className="text-[#94a3b8] hover:text-[#475569] transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}

            <h2 className="text-slate-900 text-2xl font-black mb-2 flex items-center gap-3">
              <Upload className="w-7 h-7 text-[#8B5CF6]" />
              {resubmitDraft ? "แก้งานและส่งใหม่" : "อัปโหลด Draft"}
            </h2>
            <p className="text-sm text-slate-500 font-medium mb-8">
              เลือกไฟล์วิดีโอที่คุณตัดต่อเสร็จแล้ว
              แบรนด์จะตรวจสอบความถูกต้องก่อน
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  แคมเปญที่คุณรับงาน
                </Label>
                <Select
                  required
                  value={form.campaign_id}
                  onValueChange={(v) => setForm({ ...form, campaign_id: v })}
                  disabled={!!resubmitDraft}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl font-bold focus:ring-2 focus:ring-brand-purple/10 transition-all">
                    <SelectValue placeholder="เลือกแคมเปญ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 shadow-xl bg-white">
                    {campaigns.map((c: any) => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className="font-bold py-3 focus:bg-[#f0e8ff]"
                      >
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Platform ที่จะโพสต์
                </Label>
                <Select
                  required
                  value={form.platform}
                  onValueChange={(v) => setForm({ ...form, platform: v })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl font-bold focus:ring-2 focus:ring-brand-purple/10 transition-all">
                    <SelectValue placeholder="เลือก Platform" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200 shadow-xl bg-white">
                    <SelectItem value="tiktok" className="font-bold py-3">
                      TikTok
                    </SelectItem>
                    <SelectItem value="instagram" className="font-bold py-3">
                      Instagram Reels
                    </SelectItem>
                    <SelectItem value="youtube" className="font-bold py-3">
                      YouTube Shorts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  อัปโหลดวิดีโอ
                </Label>
                <label className="block cursor-pointer group">
                  <div
                    className={`border-2 border-dashed rounded-[24px] p-10 text-center transition-all duration-300 ${
                      videoFile
                        ? "border-brand-purple bg-brand-purple/5"
                        : "border-slate-200 bg-slate-50 group-hover:border-brand-purple/40 group-hover:bg-brand-purple/5"
                    }`}
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4">
                          <Film className="w-8 h-8 text-[#8B5CF6]" />
                        </div>
                        <p className="text-base font-black truncate max-w-full text-slate-900">
                          {videoFile.name}
                        </p>
                        <p className="text-xs font-bold text-[#6b5f8a] mt-1 uppercase">
                          {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                        <span className="text-xs mt-4 text-[#8B5CF6] font-bold underline">
                          คลิกเพื่อเปลี่ยนไฟล์
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-7 h-7 text-[#c4b8e0]" />
                        </div>
                        <p className="text-base font-black text-[#1a1230]">
                          ลากและวาง หรือคลิกเพื่ออัปโหลด
                        </p>
                        <p className="text-xs font-bold text-[#c4b8e0] mt-2 uppercase tracking-widest">
                          MP4, MOV สูงสุด 500MB
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/mov,video/quicktime"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  หมายเหตุถึงแบรนด์ (ไม่บังคับ)
                </Label>
                <Textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 min-h-[120px] rounded-2xl font-bold p-4 focus:ring-2 focus:ring-brand-purple/10 transition-all resize-none placeholder:text-slate-300"
                  placeholder="เช่น ต้องการให้แบรนด์ตรวจสอบส่วนไหนเป็นพิเศษ..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  uploading || !form.campaign_id || !form.platform || !videoFile
                }
                className="w-full h-16 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-[#8B5CF6]/20 bg-[#8B5CF6] hover:bg-[#7c3aed] active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    กำลังอัปโหลดงานของคุณ...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {resubmitDraft ? "ส่งงานใหม่เลย" : "ส่ง Draft เลย"}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Drafts List */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-slate-900 text-3xl font-black">
              งานที่คุณส่งไปแล้ว
            </h2>
            <div className="bg-brand-purple/10 px-4 py-2 rounded-xl text-brand-purple font-black text-sm">
              {myDrafts.length} รายการ
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {myDrafts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="empty-state"
                  className="text-center py-32 bg-white border border-[#ede8f5] rounded-[32px] shadow-sm"
                >
                  <div className="w-20 h-20 bg-[#f8f9fe] rounded-[24px] flex items-center justify-center mx-auto mb-6">
                    <Film className="w-10 h-10 text-[#c4b8e0]" />
                  </div>
                  <h3 className="text-slate-900 text-xl font-black mb-2">
                    ยังไม่มี Draft เลย
                  </h3>
                  <p className="text-slate-500 font-medium">
                    เริ่มตัดคลิปและส่งงานแรกของคุณเพื่อสร้างรายได้กัน!
                  </p>
                </motion.div>
              ) : (
                myDrafts.map((draft: any) => (
                  <motion.div
                    key={draft.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border rounded-[32px] p-8 hover:shadow-xl transition-all relative overflow-hidden group"
                    style={{
                      borderColor:
                        draft.status === "returned"
                          ? "#fbcfe8"
                          : draft.status === "approved" ||
                              draft.status === "active"
                            ? "#bbf7d0"
                            : "#e2e8f0",
                    }}
                  >
                    {/* Status accent top bar */}
                    <div
                      className="absolute inset-x-0 top-0 h-1.5"
                      style={{
                        background:
                          draft.status === "returned"
                            ? "linear-gradient(90deg,#be185d,#ec4899)"
                            : draft.status === "approved" ||
                                draft.status === "active"
                              ? "linear-gradient(90deg,#15803d,#22c55e)"
                              : "linear-gradient(90deg,#9333ea,#3b82f6)",
                      }}
                    />

                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span
                            className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm"
                            style={
                              draft.status === "pending_review"
                                ? { background: "#fffbeb", color: "#b45309" }
                                : draft.status === "approved" ||
                                    draft.status === "active"
                                  ? { background: "#f0fdf4", color: "#15803d" }
                                  : { background: "#fff1f2", color: "#be185d" }
                            }
                          >
                            {draft.status === "pending_review"
                              ? "รอแบรนด์ตรวจ"
                              : draft.status === "approved" ||
                                  draft.status === "active"
                                ? "ผ่านแล้ว!"
                                : "ต้องการแก้ไข"}
                          </span>
                          <span className="text-xs font-black px-4 py-1.5 rounded-full bg-[#f8f9fe] text-[#7c3aed] uppercase tracking-widest border border-[#ede8f5]">
                            {draft.platform}
                          </span>
                        </div>

                        <h3 className="text-slate-900 text-2xl font-black mb-2 group-hover:text-brand-purple transition-colors">
                          {draft.campaign_title || draft.campaign_id}
                        </h3>

                        <div className="flex items-center gap-4 text-xs font-bold text-[#94a3b8] mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {draft.submitted_at
                              ? formatDistanceToNow(
                                  new Date(draft.submitted_at),
                                  {
                                    addSuffix: true,
                                    locale: th,
                                  },
                                )
                              : "ไม่ระบุเวลา"}
                          </span>
                        </div>

                        {draft.note && (
                          <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                            <p className="text-sm font-bold text-slate-500">
                              <span className="text-brand-purple">
                                บันทึกของคุณ:
                              </span>{" "}
                              {draft.note}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 self-end md:self-start">
                        {(draft.status === "approved" ||
                          draft.status === "active") && (
                          <button
                            onClick={() =>
                              toast.info("กำลังพาไปหน้าส่งลิงก์...", {
                                description:
                                  "ฟีเจอร์นี้จะเปิดให้ใช้งานเร็วๆ นี้",
                              })
                            }
                            className="bg-black text-white px-6 h-12 rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95"
                          >
                            <Send className="w-4 h-4" /> ส่งลิงก์โพสต์จริง
                          </button>
                        )}
                        {draft.status === "returned" && (
                          <button
                            onClick={() => handleResubmit(draft)}
                            className="white-button bg-white border-2 border-[#fbcfe8] text-[#be185d] px-6 h-12 rounded-2xl font-black text-sm hover:bg-[#fff1f2] transition-all flex items-center gap-2 active:scale-95"
                          >
                            <RefreshCw className="w-4 h-4" /> แก้และส่งใหม่
                          </button>
                        )}
                        {draft.status === "pending_review" && (
                          <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-xs font-black border border-slate-200 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" /> รอแบรนด์ตรวจสอบ
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#ede8f5]/50">
                      <DraftTimeline draft={draft} />
                    </div>

                    {/* Return reason UI */}
                    {draft.status === "returned" && draft.return_reason && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 p-5 rounded-3xl border-2 flex items-start gap-4 transition-all"
                        style={{
                          background: "#fff1f2",
                          borderColor: "#fbcfe8",
                        }}
                      >
                        <div className="p-2 rounded-xl bg-white shadow-sm">
                          <AlertCircle
                            className="w-5 h-5"
                            style={{ color: "#be185d" }}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-[#be185d] mb-1">
                            ข้อมูลจากแบรนด์:
                          </p>
                          <p className="text-sm font-bold text-[#6b5f8a] leading-relaxed">
                            {draft.return_reason}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Status locked helper */}
                    {draft.status !== "approved" &&
                      draft.status !== "active" && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#c4b8e0] bg-[#f8f9fe] py-2 px-4 rounded-xl w-fit border border-[#ede8f5]/50">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>
                            {draft.status === "pending_review"
                              ? "คุณยังโพสต์ไม่ได้ ต้องรอแบรนด์ตรวจให้ผ่านก่อนนะ"
                              : "รบกวนแก้ไขตามคำแนะนำ และส่งกลับมาให้ตรวจอีกครั้งครับ"}
                          </span>
                        </div>
                      )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
