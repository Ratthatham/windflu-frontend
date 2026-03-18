"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign, RefreshCw, XCircle, RotateCcw, CheckCircle2,
  Loader2, AlertTriangle, Send, Filter, User
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const STATUS_STYLE = {
  pending:    { bg: "#fff4e0", color: "#c2690a",  label: "รอดำเนินการ" },
  processing: { bg: "#e3f2fd", color: "#1565c0",  label: "กำลังโอน" },
  paid:       { bg: "#e8f5e9", color: "#2e7d32",  label: "โอนแล้ว" },
  failed:     { bg: "#ffe4f0", color: "#c2185b",  label: "ล้มเหลว" },
  rejected:   { bg: "#f3e5f5", color: "#7b1fa2",  label: "ปฏิเสธ" },
};

export default function AdminPayouts() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [tab, setTab] = useState("payouts");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [modal, setModal] = useState<{ type: "reject" | "payout", item: any } | null>(null);
  const [reason, setReason] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutChannel, setPayoutChannel] = useState("bank_transfer");
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/");
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  const { data: payouts = [], isLoading: isLoadingPayouts } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: async () => {
      const res = await api({ url: "/v1/admin/payouts?limit=50" });
      return res.items || res || [];
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: unpaid = [], isLoading: isLoadingUnpaid } = useQuery({
    queryKey: ["admin-unpaid-submissions"],
    queryFn: async () => {
      const res = await api({ url: "/v1/admin/submissions/unpaid?limit=50" });
      return res.items || res || [];
    },
    enabled: isAuthenticated && user?.role === "admin",
  });

  const refreshMutation = useMutation({
    mutationFn: (id: string) => api({ url: `/v1/admin/payouts/${id}/refresh`, method: "POST" }),
    onSuccess: () => {
      toast.success("รีเฟรชสถานะสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: () => toast.error("รีเฟรชไม่สำเร็จ"),
    onSettled: () => setRefreshingId(null),
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => api({ url: `/v1/admin/payouts/${id}/retry`, method: "PATCH" }),
    onSuccess: () => {
      toast.success("Retry สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: () => toast.error("Retry ไม่สำเร็จ"),
    onSettled: () => setRetryingId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string, reason: string }) => 
      api({ 
        url: `/v1/admin/payouts/${id}/reject`, 
        method: "PATCH", 
        body: { reason } 
      }),
    onSuccess: () => {
      toast.success("ปฏิเสธ Payout แล้ว");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: () => toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"),
  });

  const markPaidMutation = useMutation({
    mutationFn: (submissionId: string) => api({ url: `/v1/admin/submissions/${submissionId}/pay`, method: "PATCH" }),
    onSuccess: () => {
      toast.success("Mark as Paid สำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["admin-unpaid-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: () => toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง"),
  });

  const createPayoutMutation = useMutation({
    mutationFn: ({ submissionId, body }: { submissionId: string, body: any }) => 
      api({ 
        url: `/v1/admin/submissions/${submissionId}/payout`, 
        method: "POST", 
        body 
      }),
    onSuccess: () => {
      toast.success("สร้าง Payout สำเร็จ");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["admin-unpaid-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-payouts"] });
    },
    onError: (err: any) => toast.error(err.message || "สร้าง Payout ไม่สำเร็จ"),
  });

  const handleRefresh = (id: string) => {
    setRefreshingId(id);
    refreshMutation.mutate(id);
  };

  const handleRetry = (id: string) => {
    setRetryingId(id);
    retryMutation.mutate(id);
  };

  const handleReject = () => {
    if (modal?.item?.id) {
      rejectMutation.mutate({ id: modal.item.id, reason });
    }
  };

  const handleCreatePayout = () => {
    if (modal?.item?.id) {
      const body: any = { paid_channel: payoutChannel };
      if (payoutAmount) body.amount = parseFloat(payoutAmount);
      createPayoutMutation.mutate({ submissionId: modal.item.id, body });
    }
  };

  const closeModal = () => { 
    setModal(null); 
    setReason(""); 
    setPayoutAmount(""); 
    setPayoutChannel("bank_transfer"); 
  };

  const filteredPayouts = filterStatus === "all" ? payouts : payouts.filter((p: any) => p.status === filterStatus);

  const pendingCount = payouts.filter((p: any) => p.status === "pending" || p.status === "failed").length;

  if (isAuthLoading || isLoadingPayouts || isLoadingUnpaid) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#8B5CF6", borderTopColor: "transparent" }} />
    </div>
  );

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-[#1a1230]">จัดการ Payouts</h1>
        <p className="text-[#6b5f8a]">ตรวจสอบและอนุมัติการจ่ายเงินให้ Clipper</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Payout ทั้งหมด", value: payouts.length, color: "#8B5CF6" },
          { label: "กำลังดำเนินการ", value: payouts.filter((p: any) => p.status === "processing").length, color: "#1565c0" },
          { label: "ต้องดูแล", value: pendingCount, color: "#c2690a" },
          { label: "รอจ่าย (Submission)", value: unpaid.length, color: "#c2185b" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white border border-[#ede8f5] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(135deg,#8B5CF6,#22D3EE)" }} />
            <p className="text-xs text-[#6b5f8a] mb-1 mt-1">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {pendingCount > 0 && (
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3 border" style={{ background: "#fff4e0", borderColor: "#ffe0a0" }}>
          <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: "#c2690a" }} />
          <p className="text-sm font-medium" style={{ color: "#c2690a" }}>
            มี {pendingCount} Payout ที่ต้องดูแล (รอดำเนินการ / ล้มเหลว)
          </p>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-white border border-[#ede8f5]">
          <TabsTrigger value="payouts" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white font-semibold text-sm text-[#6b5f8a]">
            รายการ Payouts
          </TabsTrigger>
          <TabsTrigger value="unpaid" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white font-semibold text-sm text-[#6b5f8a]">
            รอจ่ายเงิน
            {unpaid.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full font-bold text-white" style={{ background: "#c2185b" }}>
                {unpaid.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {["all", "pending", "processing", "paid", "failed", "rejected"].map(s => (
              <button key={s}
                onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={filterStatus === s
                  ? { background: "linear-gradient(135deg,#8B5CF6,#22D3EE)", color: "#fff", borderColor: "transparent" }
                  : { background: "#fff", color: "#6b5f8a", borderColor: "#ede8f5" }}>
                {s === "all" ? "ทั้งหมด" : (STATUS_STYLE as any)[s]?.label || s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredPayouts.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#ede8f5] rounded-2xl">
                <DollarSign className="w-12 h-12 text-[#c4b8e0] mx-auto mb-3" />
                <p className="text-[#6b5f8a]">ไม่มีรายการ Payout</p>
              </div>
            )}
            {filteredPayouts.map((p: any, i: number) => {
              const s = (STATUS_STYLE as any)[p.status] || STATUS_STYLE.pending;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white border border-[#ede8f5] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold text-[#1a1230]">฿{(p.amount || 0).toLocaleString()}</span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        {p.paid_channel && (
                          <span className="text-xs px-2 py-0.5 rounded-lg border border-[#ede8f5] text-[#6b5f8a]">{p.paid_channel}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#6b5f8a] flex-wrap">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-mono">{p.creator_id}</span>
                        {p.created_at && <span>· {new Date(p.created_at).toLocaleDateString('th-TH')}</span>}
                      </div>
                      {p.reject_reason && (
                        <p className="text-xs text-[#c2185b] mt-1 bg-red-50 rounded-lg px-2 py-1">เหตุผล: {p.reject_reason}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleRefresh(p.id)} disabled={refreshingId === p.id}
                        title="รีเฟรชสถานะ"
                        className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#ede8f5] hover:bg-[#f5f0ff] transition-colors">
                        <RefreshCw className={`w-4 h-4 text-[#8B5CF6] ${refreshingId === p.id ? "animate-spin" : ""}`} />
                      </button>
                      {p.status === "failed" && (
                        <button onClick={() => handleRetry(p.id)} disabled={retryingId === p.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "linear-gradient(135deg,#FF8C42,#FFD93D)" }}>
                          {retryingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                          Retry
                        </button>
                      )}
                      {(p.status === "pending" || p.status === "processing") && (
                        <button onClick={() => setModal({ type: "reject", item: p })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50"
                          style={{ borderColor: "#ffcdd2", color: "#c2185b" }}>
                          <XCircle className="w-3.5 h-3.5" />
                          ปฏิเสธ
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="unpaid">
          <div className="space-y-3">
            {unpaid.length === 0 && (
              <div className="text-center py-16 bg-white border border-[#ede8f5] rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-[#6b5f8a]">ไม่มี Submission ที่รอจ่ายเงิน 🎉</p>
              </div>
            )}
            {unpaid.map((sub: any, i: number) => (
              <motion.div key={sub.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="bg-white border border-[#ede8f5] rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#1a1230] mb-1 truncate">
                      {sub.campaign_title || `Campaign #${sub.campaign_id}`}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#6b5f8a] flex-wrap">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-mono">{sub.creator_id || sub.clipper_id}</span>
                      {sub.platform && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f5f0ff] text-[#8B5CF6] font-semibold">{sub.platform}</span>
                      )}
                      {sub.view_count != null && (
                        <span>· {sub.view_count?.toLocaleString()} views</span>
                      )}
                    </div>
                    {sub.earnings != null && (
                      <p className="text-sm font-black mt-1" style={{ color: "#2e7d32" }}>฿{(sub.earnings || 0).toLocaleString()}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => setModal({ type: "payout", item: sub })}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 bg-brand-purple">
                      <Send className="w-3.5 h-3.5" />
                      จ่ายเงิน
                    </button>
                    <button onClick={() => markPaidMutation.mutate(sub.id)}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-green-50"
                      style={{ borderColor: "#c8e6c9", color: "#2e7d32" }}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Paid
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-md p-8 relative overflow-hidden"
              style={{ boxShadow: "0 8px 40px rgba(139,92,246,0.2)" }}>
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-2xl"
                style={{ background: modal.type === "reject"
                  ? "linear-gradient(135deg,#c2185b,#e91e63)"
                  : "linear-gradient(135deg,#8B5CF6,#22D3EE)" }} />

              {modal.type === "reject" && (
                <>
                  <div className="flex items-center gap-3 mb-4 mt-1">
                    <XCircle className="w-7 h-7 text-red-600" />
                    <h3 className="text-[#1a1230] text-xl font-bold">ปฏิเสธ Payout</h3>
                  </div>
                  <p className="text-sm text-[#6b5f8a] mb-5">
                    จำนวน: <span className="font-bold text-[#1a1230]">฿{(modal.item.amount || 0).toLocaleString()}</span>
                  </p>
                  <div className="mb-5">
                    <Label className="text-sm text-[#6b5f8a] mb-2 block">เหตุผลที่ปฏิเสธ *</Label>
                    <Textarea value={reason} onChange={e => setReason(e.target.value)}
                      className="bg-[#fafafa] border-[#ede8f5] min-h-[80px] rounded-xl"
                      placeholder="ระบุเหตุผล..." />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={closeModal} className="flex-1 h-12 rounded-2xl font-bold text-[#6b5f8a]">ยกเลิก</Button>
                    <button onClick={handleReject} disabled={rejectMutation.isPending || !reason.trim()}
                      className="flex-1 h-12 rounded-2xl font-bold text-white disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#c2185b,#e91e63)" }}>
                      {rejectMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin inline" /> : "ปฏิเสธ"}
                    </button>
                  </div>
                </>
              )}

              {modal.type === "payout" && (
                <>
                  <div className="flex items-center gap-3 mb-4 mt-1">
                    <Send className="w-7 h-7" style={{ color: "#8B5CF6" }} />
                    <h3 className="text-[#1a1230] text-xl font-bold">สร้าง Payout</h3>
                  </div>
                  <p className="text-sm text-[#6b5f8a] mb-5">
                    แคมเปญ: <span className="font-semibold text-[#1a1230]">{modal.item.campaign_title || modal.item.campaign_id}</span>
                    {modal.item.earnings != null && (
                      <><br />ยอดรายได้: <span className="font-bold text-green-700">฿{(modal.item.earnings || 0).toLocaleString()}</span></>
                    )}
                  </p>
                  <div className="space-y-4 mb-5">
                    <div>
                      <Label className="text-sm text-[#6b5f8a] mb-2 block">ช่องทางการโอน</Label>
                      <select value={payoutChannel} onChange={e => setPayoutChannel(e.target.value)}
                        className="w-full h-12 px-3 rounded-xl border border-[#ede8f5] bg-[#fafafa] text-[#1a1230] text-sm focus:ring-1 focus:ring-brand-purple outline-none">
                        <option value="bank_transfer">โอนผ่านธนาคาร</option>
                        <option value="promptpay">พร้อมเพย์</option>
                        <option value="omise">Omise</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm text-[#6b5f8a] mb-2 block">จำนวนเงิน (ไม่ระบุ = ใช้ยอดรายได้)</Label>
                      <input value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)}
                        type="number" placeholder="0.00"
                        className="w-full h-12 px-3 rounded-xl border border-[#ede8f5] bg-[#fafafa] text-[#1a1230] text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={closeModal} className="flex-1 h-12 rounded-2xl font-bold text-[#6b5f8a]">ยกเลิก</Button>
                    <button onClick={handleCreatePayout} disabled={createPayoutMutation.isPending}
                      className="flex-1 h-12 rounded-2xl font-bold text-white bg-brand-purple">
                      {createPayoutMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin inline" /> : "สร้าง Payout"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
