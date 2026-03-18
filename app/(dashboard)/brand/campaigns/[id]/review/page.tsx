"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  AlertTriangle,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import api from "@/app/utils/api";
import WindflowStatsBar from "@/components/dashboard/WindflowStatsBar";
import { Submission } from "@/type/submission";
import { useParams } from "next/navigation";

const RETURN_REASONS = [
  "ตัดผิดบริบท ทำให้แบรนด์เสียภาพ",
  "ใช้ช่วงที่ไม่อนุญาต",
  "คุณภาพวิดีโอต่ำเกินไป",
  "ไม่ตรงกับสิ่งที่กำหนดไว้",
  "อื่น ๆ พิมพ์เอง",
];

export default function BrandReviewPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("video_submitted");
  const [returningDraft, setReturningDraft] = useState<Submission | null>(null);
  const [feedbackMode, setFeedbackMode] = useState<"revise" | "reject">(
    "revise",
  );
  const [selectedReason, setSelectedReason] = useState("");
  const [returnText, setReturnText] = useState("");
  const queryClient = useQueryClient();

  // Fetch submissions for this specific campaign
  const { data: drafts = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["brand-submissions", campaignId],
    queryFn: async () => {
      const res = await api({ url: `/v1/submissions/campaign/${campaignId}` });
      return Array.isArray(res) ? res : [];
    },
    // Refetch every 5 minutes to pick up auto-approvals or new submissions
    refetchInterval: 5 * 60 * 1000,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) =>
      api({
        url: `/v1/submissions/${id}/approve`,
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brand-submissions", campaignId],
      });
      toast.success("ผ่านแล้ว โพสต์ได้เลย");
    },
  });

  const reviseMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api({
        url: `/v1/submissions/${id}/revise`,
        method: "PATCH",
        body: { comment: reason },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brand-submissions", campaignId],
      });
      toast.success("ส่งให้แก้ไขเรียบร้อยแล้ว");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api({
        url: `/v1/submissions/${id}/reject`,
        method: "PATCH",
        body: { comment: reason },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brand-submissions", campaignId],
      });
      toast.success("ปฏิเสธคลิปเรียบร้อยแล้ว");
    },
  });

  // Auto-approve drafts past 48h (Logic as requested by user)
  useEffect(() => {
    if (!drafts.length) return;

    const overdue = drafts.filter((d) => {
      // Assuming 'video_submitted' is the status for 'pending_review'
      if (d.status !== "video_submitted" || !d.created_at) return false;
      const submittedAt = new Date(d.created_at).getTime();
      return (Date.now() - submittedAt) / 3600000 >= 48;
    });

    if (overdue.length > 0) {
      toast.info(
        `ระบบผ่าน ${overdue.length} Draft ที่ครบ 48 ชม. ให้อัตโนมัติแล้วนะ`,
      );
      overdue.forEach((d) => {
        approveMutation.mutate(d.id);
      });
    }
  }, [drafts.length]);

  const handleApprove = (draft: Submission) => {
    approveMutation.mutate(draft.id);
  };

  const handleReturn = () => {
    if (!returningDraft) return;
    const reason =
      selectedReason === "อื่น ๆ พิมพ์เอง" ? returnText : selectedReason;

    if (feedbackMode === "revise") {
      reviseMutation.mutate({
        id: returningDraft.id,
        reason: reason,
      });
    } else {
      rejectMutation.mutate({
        id: returningDraft.id,
        reason: reason,
      });
    }

    setReturningDraft(null);
    setSelectedReason("");
    setReturnText("");
  };

  const pendingDrafts = drafts.filter((d) => d.status === "video_submitted");
  const approvedDrafts = drafts.filter(
    (d) => d.status === "approved" || d.status === "active",
  );
  const returnedDrafts = drafts.filter(
    (d) => d.status === "returned" || d.status === "rejected",
  );
  const urgentDrafts = pendingDrafts.filter((d) => {
    if (!d.created_at) return false;
    const hoursElapsed =
      (Date.now() - new Date(d.created_at).getTime()) / 3600000;
    return hoursElapsed >= 40 && hoursElapsed < 48;
  });

  const stats = [
    { icon: Clock, value: pendingDrafts.length, label: "รอรีวิว" },
    { icon: CheckCircle2, value: approvedDrafts.length, label: "อนุมัติแล้ว" },
    { icon: XCircle, value: returnedDrafts.length, label: "ส่งคืนแล้ว" },
    {
      icon: AlertTriangle,
      value: urgentDrafts.length,
      label: "ใกล้ครบ 48 ชม.",
    },
  ];

  const filtered = drafts
    .filter((d) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "video_submitted")
        return d.status === "video_submitted";
      if (filterStatus === "approved")
        return d.status === "approved" || d.status === "active";
      if (filterStatus === "returned")
        return d.status === "returned" || d.status === "rejected";
      return true;
    })
    .filter((d) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      // Using video_title or id as fallback for clipper_username if not directly available
      return (
        (d.video_title || "").toLowerCase().includes(q) ||
        (d.id || "").toLowerCase().includes(q)
      );
    });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดข้อมูล Draft...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
          รีวิว Draft
        </h1>
        <p className="text-slate-500 text-base font-bold">
          ดู Draft ของ Clipper แล้วตัดสินใจได้เลย ก่อนที่เขาจะโพสต์จริง
        </p>
      </div>

      <WindflowStatsBar stats={stats} />

      {urgentDrafts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 mb-8 flex items-center gap-4 border bg-amber-50 border-amber-100 shadow-sm"
        >
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-amber-200 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-amber-800">
            มี {urgentDrafts.length} Draft ใกล้ครบ 48 ชม. แล้ว
            รีบดูก่อนระบบผ่านให้อัตโนมัตินะ
          </p>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาตามชื่อคลิป หรือ ID..."
            className="pl-11 bg-white border-slate-200 text-slate-900 h-12 rounded-2xl font-bold focus:ring-2 focus:ring-brand-purple/10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="md:w-56 bg-white border-slate-200 text-slate-900 h-12 rounded-2xl font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-slate-100 shadow-xl bg-white">
            <SelectItem value="all" className="font-bold py-3">
              ทุกสถานะ
            </SelectItem>
            <SelectItem value="video_submitted" className="font-bold py-3">
              รอรีวิว
            </SelectItem>
            <SelectItem value="approved" className="font-bold py-3">
              อนุมัติแล้ว
            </SelectItem>
            <SelectItem value="returned" className="font-bold py-3">
              ส่งคืนแล้ว
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 bg-white border border-slate-200 rounded-[40px] text-center"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                ไม่มี Draft ในหมวดนี้
              </p>
            </motion.div>
          ) : (
            filtered.map((draft) => {
              const isUrgent = !!urgentDrafts.find((u) => u.id === draft.id);
              const createdAt = draft.created_at
                ? new Date(draft.created_at).getTime()
                : 0;
              const hoursElapsed = (Date.now() - createdAt) / 3600000;
              const hoursLeft = Math.max(0, 48 - hoursElapsed).toFixed(0);

              return (
                <motion.div
                  key={draft.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] p-8 transition-all hover:shadow-xl border border-slate-200 relative group"
                  style={{ borderColor: isUrgent ? "#fbbf24" : "#e2e8f0" }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 rounded-t-[32px]"
                    style={{
                      background: "linear-gradient(90deg,#9333ea,#3b82f6)",
                    }}
                  />

                  <div className="flex items-start gap-2 mb-6 flex-wrap">
                    <span
                      className="text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm"
                      style={
                        draft.status === "video_submitted"
                          ? {
                              background: "#fffbeb",
                              color: "#b45309",
                              borderColor: "#fef3c7",
                            }
                          : draft.status === "approved" ||
                              draft.status === "active"
                            ? {
                                background: "#f0fdf4",
                                color: "#15803d",
                                borderColor: "#dcfce7",
                              }
                            : {
                                background: "#fff1f2",
                                color: "#be185d",
                                borderColor: "#ffe4e6",
                              }
                      }
                    >
                      {draft.status === "video_submitted"
                        ? "รอรีวิว"
                        : draft.status === "approved" ||
                            draft.status === "active"
                          ? "ผ่านแล้ว"
                          : "ส่งคืน"}
                    </span>
                    <span className="text-xs font-black px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 uppercase tracking-widest border border-slate-100">
                      {draft.video?.platform || "PLATFORM"}
                    </span>
                    {isUrgent && draft.status === "video_submitted" && (
                      <span className="text-xs font-black px-4 py-1.5 rounded-full bg-amber-500 text-white uppercase tracking-widest">
                        เหลือ {hoursLeft} ชม.
                      </span>
                    )}
                  </div>

                  <h3 className="text-slate-900 font-black text-xl mb-1 truncate leading-tight group-hover:text-brand-purple transition-colors">
                    {draft.video_title || "Untitled Video"}
                  </h3>
                  <p className="text-sm text-slate-500 font-bold mb-6">
                    Campaign ID:{" "}
                    <span className="text-slate-900">{draft.campaign_id}</span>
                  </p>

                  {draft.description && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                      <p className="text-xs text-slate-600 font-bold leading-relaxed">
                        "{draft.description}"
                      </p>
                    </div>
                  )}

                  {(draft.status === "returned" ||
                    draft.status === "rejected") &&
                    draft.reject_comment && (
                      <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-pink-500 uppercase tracking-wider mb-0.5">
                            เหตุผลที่ส่งคืน:
                          </p>
                          <p className="text-xs text-slate-700 font-bold leading-relaxed">
                            {draft.reject_comment}
                          </p>
                        </div>
                      </div>
                    )}

                  {draft.video?.video_url && (
                    <button
                      onClick={() =>
                        window.open(draft.video?.video_url, "_blank")
                      }
                      className="w-full mb-6 py-4 rounded-2xl border border-slate-200 bg-white font-black text-sm text-slate-900 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                      <Play className="w-5 h-5 text-brand-purple fill-brand-purple" />
                      ดูวิดีโอผลงาน
                    </button>
                  )}

                  {draft.status === "video_submitted" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(draft)}
                        disabled={approveMutation.isPending}
                        className="flex-[1.5] h-11 rounded-xl font-black text-xs text-white transition-all shadow-lg active:scale-95 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50"
                      >
                        ✓ ผ่าน
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackMode("revise");
                          setReturningDraft(draft);
                        }}
                        className="flex-1 h-11 rounded-xl font-black text-xs border-2 transition-all hover:shadow-md active:scale-95 bg-white border-brand-purple text-brand-purple hover:bg-brand-purple/5"
                      >
                        ✎ แก้ไข
                      </button>
                      <button
                        onClick={() => {
                          setFeedbackMode("reject");
                          setReturningDraft(draft);
                        }}
                        className="flex-1 h-11 rounded-xl font-black text-xs border-2 transition-all hover:shadow-md active:scale-95 bg-white border-red-500 text-red-500 hover:bg-red-50"
                      >
                        ✗ ปฏิเสธ
                      </button>
                    </div>
                  )}

                  {draft.created_at && (
                    <p className="text-xs text-slate-300 mt-6 text-center font-bold uppercase tracking-[0.2em]">
                      ส่งเมื่อ{" "}
                      {formatDistanceToNow(new Date(draft.created_at), {
                        addSuffix: true,
                        locale: th,
                      })}
                    </p>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Return reason modal */}
      <AnimatePresence>
        {returningDraft && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                setReturningDraft(null);
                setSelectedReason("");
                setReturnText("");
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white border border-slate-200 rounded-[40px] p-10 w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{
                  background:
                    feedbackMode === "revise"
                      ? "linear-gradient(90deg,#9333ea,#3b82f6)"
                      : "linear-gradient(90deg,#ef4444,#dc2626)",
                }}
              />
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    feedbackMode === "revise"
                      ? "bg-purple-50 border-purple-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  {feedbackMode === "revise" ? (
                    <Play className="w-5 h-5 text-brand-purple" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl font-black mb-1">
                    {feedbackMode === "revise"
                      ? "ส่งแก้ไข Draft"
                      : "ปฏิเสธ Draft"}
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    {feedbackMode === "revise"
                      ? "บอก Clipper ว่าต้องแก้อะไรนะเพื่อความปัง"
                      : "ระบุเหตุผลที่แบรนด์ขอนะเสียดายจัง"}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <Label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">
                  เลือกเหตุผล
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {RETURN_REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedReason(r)}
                      className={`w-full text-left text-sm px-5 py-4 rounded-2xl border-2 transition-all font-bold ${
                        selectedReason === r
                          ? feedbackMode === "revise"
                            ? "bg-purple-50 border-brand-purple text-brand-purple"
                            : "bg-red-50 border-red-500 text-red-700"
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {selectedReason === "อื่น ๆ พิมพ์เอง" && (
                <div className="mb-8 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                    พิมพ์เหตุผล
                  </Label>
                  <Textarea
                    value={returnText}
                    onChange={(e) => setReturnText(e.target.value)}
                    className={`bg-slate-50 border-slate-200 text-slate-900 min-h-[100px] rounded-2xl font-bold p-4 focus:ring-2 placeholder:text-slate-300 resize-none ${
                      feedbackMode === "revise"
                        ? "focus:ring-brand-purple/10"
                        : "focus:ring-red-500/10"
                    }`}
                    placeholder="อธิบายรายละเอียดเพิ่มเติม..."
                    autoFocus
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setReturningDraft(null);
                    setSelectedReason("");
                    setReturnText("");
                  }}
                  className="flex-1 h-14 rounded-2xl font-black text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleReturn}
                  disabled={
                    !selectedReason ||
                    (selectedReason === "อื่น ๆ พิมพ์เอง" &&
                      !returnText.trim()) ||
                    reviseMutation.isPending ||
                    rejectMutation.isPending
                  }
                  className={`flex-1 h-14 rounded-2xl font-black text-sm text-white shadow-xl active:scale-95 border-none transition-all disabled:opacity-50 disabled:grayscale ${
                    feedbackMode === "revise"
                      ? "bg-slate-900 shadow-purple-500/10"
                      : "bg-red-600 shadow-red-500/20"
                  }`}
                >
                  {reviseMutation.isPending || rejectMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : feedbackMode === "revise" ? (
                    "ส่งให้แก้ไข"
                  ) : (
                    "ยืนยันปฏิเสธ"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
