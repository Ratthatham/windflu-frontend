"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
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
  AlertCircle,
  Loader2,
  Film,
  Send,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import api from "@/app/utils/api";
import Cookies from "js-cookie";
import { Submission } from "@/type/submission";
import { APICampaign, Campaign } from "@/type/campaigns";
import { useAuthStore } from "@/lib/store/auth-store";

const TIMELINE_STEPS = [
  { key: "uploaded", label: "อัปโหลดแล้ว" },
  { key: "pending_review", label: "รอรีวิว" },
  { key: "reviewed", label: "ผลรีวิว" },
  { key: "posted", label: "Submit ลิงก์" },
];

function DraftTimeline({ draft }: { draft: Submission }) {
  const isReturned = draft.status === "returned" || draft.status === "rejected";
  const isApproved = draft.status === "approved" || draft.status === "active";
  const isPending =
    draft.status === "pending_review" || draft.status === "pending";

  // active step index: 0=uploaded, 1=pending_review, 2=reviewed, 3=posted
  const activeStep = isApproved || isReturned ? 2 : isPending ? 1 : 0;

  return (
    <div className="flex items-center gap-1 mt-4">
      {TIMELINE_STEPS.map((step, i) => {
        const isDone = i < activeStep;
        const isCurrent = i === activeStep;
        const isReturnedStep = i === 2 && isReturned;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-[1.5px] transition-all shadow-sm"
                style={
                  isReturnedStep
                    ? {
                        background: "rgba(236, 72, 153, 0.1)",
                        borderColor: "#ec4899",
                        color: "#ec4899",
                      }
                    : isDone || isCurrent
                      ? {
                          background: "white",
                          borderColor: "transparent",
                          color: "#8B5CF6",
                        }
                      : {
                          background: "rgba(0,0,0,0.03)",
                          borderColor: "rgba(0,0,0,0.05)",
                          color: "rgba(0,0,0,0.3)",
                        }
                }
              >
                {isReturnedStep ? (
                  <XCircle className="w-3 h-3" />
                ) : isDone || isCurrent ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className="text-xs mt-1.5 whitespace-nowrap font-bold tracking-tight"
                style={{
                  color: isReturnedStep
                    ? "#ec4899"
                    : isDone || isCurrent
                      ? "#1a1230"
                      : "rgba(0,0,0,0.3)",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < TIMELINE_STEPS.length - 1 && (
              <div
                className="flex-1 h-[1.5px] mb-4 rounded-full mx-1"
                style={{
                  background: i < activeStep ? "#1a1230" : "rgba(0,0,0,0.05)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function SubmitCampaignPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;

  const [uploading, setUploading] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [form, setForm] = useState({ platform: "", note: "" });
  const [resubmitDraft, setResubmitDraft] = useState<Submission | null>(null);

  const { data: campaign, isLoading: isLoadingCampaign } = useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const res: APICampaign = await api({
        url: `/v1/campaigns/${campaignId}`,
      });
      return res;
    },
    enabled: !!campaignId,
  });

  const { data: mySubmissions, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const res: Submission[] = await api({
        url: "/v1/creators/me/submissions",
      });
      return res;
    },
  });

  const submissionsId = mySubmissions?.find(
    (submission) => submission.campaign_id === campaignId,
  )?.id;

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
      let submissionId = submissionsId;
      if (!submissionId) {
        const submissionRes: Submission = await api({
          url: `/v1/campaigns/${campaignId}/submissions`,
          method: "POST",
          body: {
            video_title: campaign?.title,
            description: form.note,
          },
        });
        submissionId = submissionRes.id;
      }

      if (!submissionId) throw new Error("Failed to create submission record");

      // 2. Upload Video
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("platform", form.platform);
      formData.append("posted_at", format(new Date(), "yyyy-MM-dd"));

      const uploadRes = await api({
        url: `/v1/submissions/${submissionId}/video`,
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Video upload failed");
      }

      toast.success("ส่ง Draft ให้แบรนด์แล้ว รอดูนะ", {
        description: "แบรนด์จะตรวจสอบผลงานของคุณและแจ้งกลับผ่านระบบ",
      });

      // Clear form
      setForm({ platform: "", note: "" });
      setVideoFile(null);
      setResubmitDraft(null);
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    } catch (error) {
      const err = error as Error;
      console.error("Submission error:", error);
      toast.error("เกิดข้อผิดพลาดในการส่งงาน ลองใหม่อีกครั้งนะ", {
        description: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleResubmit = (draft: Submission) => {
    setResubmitDraft(draft);
    setForm({ platform: draft.video?.platform || "", note: "" });
    setVideoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoadingCampaign) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl ">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900">
          ส่งผลงาน (Draft)
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-slate-500 text-base font-bold">แคมเปญ:</p>
          <span className="text-brand-purple font-black">
            {campaign?.title || "ไม่พบชื่อแคมเปญ"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}

        <div className="lg:col-span-1 sticky top-8 space-y-6">
          {/* Campaign Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[32px] p-4 shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                {campaign?.images?.[0] ? (
                  <img
                    src={campaign.images[0]}
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                  กำลังส่งงานสำหรับ
                </p>
                <h3 className="text-sm font-black text-slate-900 truncate leading-tight">
                  {campaign?.title || "กำลังโหลด..."}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden"
          >
            {resubmitDraft && (
              <div className="mb-6 p-4 rounded-2xl bg-pink-50 border border-pink-100 flex items-start gap-3">
                <RefreshCw className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-black text-pink-600 uppercase tracking-wider">
                    ส่งใหม่สำหรับ Draft ที่ถูกส่งคืน
                  </p>
                  <button
                    onClick={() => {
                      setResubmitDraft(null);
                      setForm({ platform: "", note: "" });
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 underline mt-1 transition-colors"
                  >
                    ยกเลิกการส่งใหม่
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                  Platform ที่จะโพสต์
                </Label>
                <Select
                  required
                  value={form.platform}
                  onValueChange={(v) => setForm({ ...form, platform: v })}
                >
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl font-bold focus:ring-2 focus:ring-slate-100 transition-all hover:bg-slate-100/50">
                    <SelectValue placeholder="เลือก Platform" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 bg-white text-slate-900 shadow-2xl p-2">
                    <SelectItem
                      value="tiktok"
                      className="font-bold py-3 rounded-lg cursor-pointer"
                    >
                      TikTok
                    </SelectItem>
                    <SelectItem
                      value="instagram"
                      className="font-bold py-3 rounded-lg cursor-pointer"
                    >
                      Instagram Reels
                    </SelectItem>
                    <SelectItem
                      value="youtube"
                      className="font-bold py-3 rounded-lg cursor-pointer"
                    >
                      YouTube Shorts
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                  อัปโหลดวิดีโอ
                </Label>
                <label className="block cursor-pointer group">
                  <div
                    className={`border-2 border-dashed rounded-[24px] p-8 text-center transition-all duration-300 ${
                      videoFile
                        ? "border-emerald-500/50 bg-emerald-50"
                        : "border-slate-200 bg-slate-50 group-hover:border-slate-400 group-hover:bg-slate-100/50"
                    }`}
                  >
                    {videoFile ? (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                          <Film className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm font-black truncate max-w-full text-slate-900 mb-0.5">
                          {videoFile.name}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 group-hover:bg-slate-50 transition-all duration-300">
                          <Upload className="w-6 h-6 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                        <p className="text-sm font-black text-slate-900 mb-0.5">
                          คลิกเพื่อเลือกไฟล์
                        </p>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
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
                <Label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-1">
                  หมายเหตุถึงแบรนด์
                </Label>
                <Textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-slate-900 min-h-[100px] rounded-2xl font-bold p-4 focus:ring-2 focus:ring-slate-100 transition-all resize-none shadow-inner text-sm placeholder:text-slate-300"
                  placeholder="บอกแบรนด์เพิ่มเติม..."
                />
              </div>

              <button
                type="submit"
                disabled={
                  uploading ||
                  !form.platform ||
                  !videoFile ||
                  campaign?.submitted
                }
                className="w-full h-14 rounded-2xl text-white font-black text-base flex items-center justify-center gap-3 transition-all duration-500 shadow-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-20 disabled:grayscale group"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังอัปโหลด...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    ส่ง Draft เลย
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-slate-900 text-xl font-black flex items-center gap-3">
            Draft ที่ส่งไปแล้ว
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              {mySubmissions?.length}
            </span>
          </h2>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {mySubmissions?.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white border border-slate-200 rounded-[32px] shadow-sm"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Film className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-slate-900 text-lg font-black mb-1">
                    ยังไม่มี Draft ในแคมเปญนี้
                  </h3>
                  <p className="text-slate-400 text-sm font-bold">
                    อัปโหลดผลงานแรกของคุณทางด้านซ้ายได้เลย
                  </p>
                </motion.div>
              ) : (
                mySubmissions?.map((draft) => (
                  <motion.div
                    key={draft.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-200 rounded-[30px] p-6 hover:border-slate-300 transition-all relative group shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider"
                            style={
                              draft.status === "video_submitted" ||
                              draft.status === "pending"
                                ? { background: "#fbbf24", color: "#1a1a1a" }
                                : draft.status === "approved" ||
                                    draft.status === "active"
                                  ? { background: "#22c55e", color: "white" }
                                  : { background: "#ec4899", color: "white" }
                            }
                          >
                            {draft.status === "video_submitted"
                              ? "รอการตรวจสอบ"
                              : draft.status === "approved" ||
                                  draft.status === "active"
                                ? "อนุมัติแล้ว"
                                : "ต้องการแก้ไข"}
                          </span>
                          {draft.video?.platform && (
                            <span className="text-xs font-black px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 uppercase tracking-wider border border-slate-200">
                              {draft.video.platform}
                            </span>
                          )}
                        </div>

                        <h3 className="text-slate-900 text-lg font-black mb-1.5 truncate">
                          {draft.video_title || "Untitled Submission"}
                        </h3>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            ส่งเมื่อ{" "}
                            {formatDistanceToNow(new Date(draft.created_at), {
                              addSuffix: true,
                              locale: th,
                            })}
                          </span>
                        </div>

                        <DraftTimeline draft={draft} />

                        {(draft.status === "returned" ||
                          draft.status === "rejected") &&
                          draft.reject_comment && (
                            <div className="mt-5 p-4 rounded-2xl border bg-pink-50 border-pink-100 flex items-start gap-3">
                              <AlertCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-black text-pink-500 mb-1 uppercase tracking-wider">
                                  ฟีดแบ็คจากแบรนด์:
                                </p>
                                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                                  {draft.reject_comment}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>

                      <div className="flex flex-col gap-2 md:w-32 shrink-0">
                        {(draft.status === "returned" ||
                          draft.status === "rejected") && (
                          <button
                            onClick={() => handleResubmit(draft)}
                            className="w-full bg-slate-900 text-white h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                          >
                            <RefreshCw className="w-3 h-3" />
                            แก้และส่งใหม่
                          </button>
                        )}
                        <button
                          onClick={() =>
                            draft.video.video_url &&
                            window.open(draft.video.video_url, "_blank")
                          }
                          className="w-full bg-slate-50 border border-slate-200 text-slate-600 h-10 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
                        >
                          ดูวิดีโอที่ส่ง
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .select-content-premium [role="menuitem"] {
          transition: all 0.2s ease;
        }
        .select-content-premium [role="menuitem"]:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          padding-left: 1.5rem !important;
        }
      `}</style>
    </div>
  );
}
