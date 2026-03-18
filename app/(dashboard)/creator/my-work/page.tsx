"use client";

import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Film,
  Send,
  RefreshCw,
  Loader2,
  ExternalLink,
  Globe,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { DraftTimeline } from "@/components/dashboard/DraftTimeline";

const MyWorkPage = () => {
  const router = useRouter();
  const [activeDraftForLink, setActiveDraftForLink] = useState<any | null>(
    null,
  );
  const [socialLinkInput, setSocialLinkInput] = useState("");
  const queryClient = useQueryClient();

  const {
    data: submissions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-submissions"],
    queryFn: async () => {
      const res = await api({ url: "/v1/creators/me/submissions" });
      return Array.isArray(res) ? res : [];
    },
  });

  const updateSocialLinkMutation = useMutation({
    mutationFn: ({ id, social_link }: { id: string; social_link: string }) =>
      api({
        url: `/v1/submissions/${id}/social-link`,
        method: "PATCH",
        body: { social_link },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
      setActiveDraftForLink(null);
      setSocialLinkInput("");
      toast.success("ส่งลิงก์เรียบร้อยแล้ว! แบรนด์จะตรวจสอบเร็วๆ นี้ครับ");
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาดในการส่งลิงก์ กรุณาลองใหม่");
    },
  });

  const handleSubmitSocialLink = (id: string) => {
    if (!socialLinkInput.trim()) {
      toast.error("กรุณาใส่ลิงก์ของคุณก่อนนะครับ");
      return;
    }
    updateSocialLinkMutation.mutate({ id, social_link: socialLinkInput });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดข้อมูลงานของคุณ...
        </p>
      </div>
    );
  }

  if (error) {
    toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-pink-500 mx-auto mb-4 opacity-50" />
        <p className="text-slate-500 font-bold">
          ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900">
            งานของฉัน
          </h1>
          <p className="text-slate-500 text-base font-bold">
            ติดตามสถานะผลงานที่คุณส่งให้แบรนด์
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl text-slate-900 font-black text-sm border border-slate-200 shadow-sm">
          {submissions?.length || 0} ผลงาน
        </div>
      </div>

      <div className="space-y-5">
        <AnimatePresence mode="popLayout">
          {!submissions || submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white border border-slate-200 rounded-[32px] shadow-sm"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Film className="w-8 h-8 text-slate-200" />
              </div>
              <h3 className="text-slate-900 text-xl font-black mb-1">
                ยังไม่มีงานที่กำลังดำเนินการ
              </h3>
              <p className="text-slate-400 text-sm font-bold">
                คุณสามารถรับงานได้จากหน้าแคมเปญหลัก
              </p>
            </motion.div>
          ) : (
            submissions.map((draft: any) => (
              <motion.div
                key={draft.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-[32px] p-6 hover:border-slate-300 transition-all relative overflow-hidden group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider"
                        style={
                          draft.status === "pending_review" ||
                          draft.status === "pending"
                            ? { background: "#fbbf24", color: "#1a1a1a" }
                            : draft.status === "approved" ||
                                draft.status === "active"
                              ? { background: "#22c55e", color: "white" }
                              : { background: "#ec4899", color: "white" }
                        }
                      >
                        {draft.status === "pending_review"
                          ? "รอการตรวจสอบ"
                          : draft.status === "approved"
                            ? "อนุมัติแล้ว"
                            : draft.status === "revise" ||
                                draft.status === "returned"
                              ? "แก้ไขงาน"
                              : "แก้ไข"}
                      </span>
                      {draft.video?.platform && (
                        <span className="text-xs font-black px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 uppercase tracking-wider border border-slate-200">
                          {draft.video.platform}
                        </span>
                      )}
                    </div>

                    <h3 className="text-slate-900 text-xl font-black mb-2 tracking-tight group-hover:text-brand-purple transition-colors">
                      {draft.video_title || "Untitled Submission"}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-5">
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
                  </div>

                  <div className="flex flex-col gap-2 lg:w-40 shrink-0">
                    {draft.status === "approved" &&
                      (draft.social_link ? (
                        <div className="w-full bg-emerald-50 border border-emerald-100 text-emerald-600 h-11 rounded-1.5xl font-black text-xs flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          ส่งลิงก์แล้ว
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveDraftForLink(draft);
                            setSocialLinkInput(draft.social_link || "");
                          }}
                          className="w-full bg-slate-900 text-white h-11 rounded-1.5xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          SUBMIT LINK
                        </button>
                      ))}
                    {(draft.status === "rejected" ||
                      draft.status === "revise") && (
                      <button
                        onClick={() =>
                          router.push(`/creator/submit/${draft.campaign_id}`)
                        }
                        className="w-full bg-pink-500 text-white h-11 rounded-1.5xl font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-pink-600 active:scale-95 transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        แก้ไขผลงาน
                      </button>
                    )}
                    {(draft.status === "pending_review" ||
                      draft.status === "pending") && (
                      <div className="w-full bg-slate-50 border border-slate-200 text-slate-400 h-11 rounded-1.5xl font-bold text-xs flex items-center justify-center gap-2">
                        <Clock className="w-3 h-3" />
                        รอผลรีวิว...
                      </div>
                    )}
                    <button className="w-full bg-slate-50 border border-slate-200 text-slate-600 h-11 rounded-1.5xl font-bold text-xs hover:bg-slate-100 transition-colors">
                      ดูวิดีโอที่ส่ง
                    </button>
                  </div>
                </div>

                {(draft.status === "rejected" || draft.status === "revise") &&
                  draft.revision_comment && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 rounded-2xl border bg-pink-500/5 border-pink-500/20 flex items-start gap-4"
                    >
                      <div className="p-2 rounded-xl bg-pink-500/20">
                        <AlertCircle className="w-4 h-4 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-pink-500 mb-0.5 uppercase tracking-wider">
                          ฟีดแบ็คจากแบรนด์:
                        </p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                          {draft.revision_comment}
                        </p>
                      </div>
                    </motion.div>
                  )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Social Link Modal */}
      <AnimatePresence>
        {activeDraftForLink && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setActiveDraftForLink(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 bg-white rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-white/20"
            >
              <div
                className="absolute inset-x-0 top-0 h-2 rounded-t-[40px]"
                style={{
                  background: "linear-gradient(90deg, #8B5CF6, #3B82F6)",
                }}
              />

              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-brand-purple" />
                </div>
                <div>
                  <h3 className="text-slate-900 text-2xl font-black leading-tight">
                    Submit Final Link
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    วางลิงก์โซเชียลของคุณที่โพสต์แล้วนะ
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Social Link
                    </label>
                    <div className="flex items-center gap-1.5 opacity-60">
                      <Share2 className="w-3 h-3 text-slate-400" />
                      <span className="text-xs font-bold text-slate-400">
                        TikTok, FB, IG, Reels
                      </span>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                      <ExternalLink className="w-4 h-4 text-slate-300 group-focus-within:text-brand-purple transition-colors" />
                    </div>
                    <Input
                      autoFocus
                      value={socialLinkInput}
                      onChange={(e) => setSocialLinkInput(e.target.value)}
                      placeholder="https://www.tiktok.com/@user/video/..."
                      className="bg-slate-50 border-slate-100 h-16 pl-12 rounded-[24px] font-bold text-sm text-slate-900 focus:ring-4 focus:ring-brand-purple/5 transition-all"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    ตรวจสอบลิงก์ให้ถูกต้องนะ แบรนด์จะตรวจสอบผลลัพธ์ผ่านลิงก์นี้
                    เพื่อสรุปยอดนะจ๊ะ
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setActiveDraftForLink(null)}
                  className="flex-1 h-14 rounded-2xl font-black text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  ย้อนกลับ
                </button>
                <button
                  onClick={() => handleSubmitSocialLink(activeDraftForLink.id)}
                  disabled={updateSocialLinkMutation.isPending}
                  className="flex-2 bg-slate-900 text-white h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50"
                >
                  {updateSocialLinkMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>ยืนยันการส่ง</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyWorkPage;
