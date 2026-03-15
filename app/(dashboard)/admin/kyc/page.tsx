"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  User,
  Calendar,
  Loader2,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import WindflowStatsBar from "@/components/dashboard/WindflowStatsBar";
import api from "@/app/utils/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface KYCRequest {
  id: string;
  creator_id: string;
  status: string;
  selfie_with_id_url: string;
  id_card_image_url: string;
  comment?: string;
  last_submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

interface KYCListResponse {
  items: KYCRequest[];
  limit: number;
  offset: number;
  total: number;
}

const reviewSchema = z.object({
  comment: z.string().min(1, "กรุณาระบุเหตุผลที่ปฏิเสธ"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function KYCReviewPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedKYC, setSelectedKYC] = useState<KYCRequest | null>(null);

  const { data, isLoading } = useQuery<KYCListResponse>({
    queryKey: ["admin-kyc", filterStatus],
    queryFn: async () => {
      const statusParam =
        filterStatus === "all" ? "" : `status=${filterStatus}`;
      return await api({ url: `/v1/admin/kyc?${statusParam}&limit=50` });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: "approved" | "rejected";
      comment?: string;
    }) => {
      return await api({
        url: `/v1/admin/kyc/${id}/status`,
        method: "PATCH",
        body: { status, comment },
      });
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "approved"
          ? "อนุมัติ KYC แล้ว"
          : "ปฏิเสธ KYC แล้ว",
      );
      setSelectedKYC(null);
      reset();
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
    },
    onError: () => {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    },
  });

  const kycRequests = data?.items || [];
  const pendingRequests = kycRequests.filter((k) => k.status === "pending");
  const approvedRequests = kycRequests.filter((k) => k.status === "approved");
  const rejectedRequests = kycRequests.filter((k) => k.status === "rejected");

  const stats = [
    { icon: Clock, value: pendingRequests.length, label: "รอตรวจสอบ" },
    {
      icon: CheckCircle2,
      value: approvedRequests.length,
      label: "อนุมัติแล้ว",
    },
    { icon: XCircle, value: rejectedRequests.length, label: "ปฏิเสธแล้ว" },
    { icon: Shield, value: kycRequests.length, label: "ทั้งหมด" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-slate-100 shrink-0">
          <Shield className="w-8 h-8 text-brand-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
            KYC Verification
          </h1>
          <p className="text-slate-500 font-bold">
            ตรวจสอบและอนุมัติเอกสารยืนยันตัวตนของ Clipper
          </p>
        </div>
      </div>

      <WindflowStatsBar stats={stats} />

      {pendingRequests.length > 0 && (
        <div className="rounded-[24px] p-6 mb-8 flex items-center gap-4 border border-amber-100 bg-amber-50/50 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-amber-800 font-black text-sm">
            มี {pendingRequests.length} คำขอรอตรวจสอบ
          </p>
        </div>
      )}

      <div className="mb-8">
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList className="bg-white border border-slate-200 p-1 rounded-2xl h-14 shadow-sm inline-flex">
            {["all", "pending", "approved", "rejected"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="px-8 rounded-xl font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white capitalize"
              >
                {status === "all"
                  ? "ทั้งหมด"
                  : status === "pending"
                    ? "รอตรวจสอบ"
                    : status === "approved"
                      ? "อนุมัติแล้ว"
                      : "ปฏิเสธแล้ว"}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden h-[360px]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-slate-100 opacity-50" />
              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-20 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-2xl" />
              </div>
              <div className="space-y-4 mb-6">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-10 w-full rounded-2xl" />
              </div>
              <Skeleton className="h-12 w-full rounded-[24px]" />
            </div>
          ))
        ) : kycRequests.length === 0 ? (
          <div className="col-span-full py-32 bg-white border border-dashed border-slate-200 rounded-[40px] text-center flex flex-col items-center gap-4">
            <Shield className="w-12 h-12 text-slate-200" />
            <div>
              <p className="text-slate-900 font-black text-lg">
                ยังไม่มีคำขอ KYC
              </p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">
                ในหมวดหมู่นี้
              </p>
            </div>
          </div>
        ) : (
          kycRequests.map((kyc, idx) => (
            <motion.div
              key={kyc.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-brand-purple to-pink-500 opacity-20" />

              <div className="flex items-start justify-between mb-6">
                <span
                  className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                    kyc.status === "pending"
                      ? "bg-amber-50 text-amber-600 border-amber-100"
                      : kyc.status === "approved"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-pink-50 text-pink-500 border-pink-100"
                  }`}
                >
                  {kyc.status === "pending"
                    ? "รอตรวจสอบ"
                    : kyc.status === "approved"
                      ? "อนุมัติแล้ว"
                      : "ปฏิเสธแล้ว"}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 transition-colors group-hover:border-brand-purple/20">
                  <User className="w-5 h-5 text-brand-purple/50 group-hover:text-brand-purple" />
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                  Creator ID
                </p>
                <p className="text-sm font-mono text-slate-900 border-b border-dashed border-slate-100 pb-1 break-all truncate">
                  {kyc.creator_id}
                </p>
              </div>

              {kyc.last_submitted_at && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6 bg-slate-50 p-3 rounded-2xl">
                  <Calendar className="w-3.5 h-3.5" />
                  ส่งเมื่อ{" "}
                  {new Date(kyc.last_submitted_at).toLocaleDateString("th-TH")}
                </div>
              )}

              {kyc.comment && kyc.status === "rejected" && (
                <div className="bg-pink-50/50 border border-pink-100 rounded-2xl p-4 mb-6 italic text-xs text-pink-600 leading-relaxed shadow-xs">
                  "{kyc.comment}"
                </div>
              )}

              <Button
                onClick={() => setSelectedKYC(kyc)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-[24px] h-12 shadow-lg shadow-slate-900/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                ดูรายละเอียด
              </Button>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {selectedKYC && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => {
                setSelectedKYC(null);
                reset();
              }}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 bg-white border border-slate-200 rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-brand-purple to-pink-500" />

              <div className="p-10 border-b border-slate-100 flex shrink-0 justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">
                    ตรวจสอบ KYC
                  </h3>
                  <p className="text-sm text-slate-500 font-bold">
                    Creator ID: {selectedKYC.creator_id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedKYC(null);
                    reset();
                  }}
                  className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  <XCircle className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-brand-purple" />
                      </div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                        รูปถ่ายคู่บัตรประชาชน
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden p-2 group shadow-inner">
                      {selectedKYC.selfie_with_id_url ? (
                        <a
                          href={selectedKYC.selfie_with_id_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative"
                        >
                          <img
                            src={selectedKYC.selfie_with_id_url}
                            alt="Selfie"
                            className="w-full aspect-square object-cover rounded-[24px] group-hover:opacity-90 transition-all active:scale-[0.99]"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </a>
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center">
                          <p className="text-slate-400 font-bold">ไม่มีรูป</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-pink-500" />
                      </div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-widest">
                        รูปบัตรประชาชน
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-[32px] overflow-hidden p-2 group shadow-inner">
                      {selectedKYC.id_card_image_url ? (
                        <a
                          href={selectedKYC.id_card_image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative"
                        >
                          <img
                            src={selectedKYC.id_card_image_url}
                            alt="ID"
                            className="w-full aspect-square object-cover rounded-[24px] group-hover:opacity-90 transition-all active:scale-[0.99]"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                          </div>
                        </a>
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center">
                          <p className="text-slate-400 font-bold">ไม่มีรูป</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-slate-400">
                    ข้อมูลคำขอ
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        สถานะปัจจุบัน
                      </p>
                      <span
                        className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider inline-block ${
                          selectedKYC.status === "pending"
                            ? "bg-amber-500/20 text-amber-400"
                            : selectedKYC.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-pink-500/20 text-pink-400"
                        }`}
                      >
                        {selectedKYC.status === "pending"
                          ? "รอตรวจสอบ"
                          : selectedKYC.status === "approved"
                            ? "อนุมัติแล้ว"
                            : "ปฏิเสธแล้ว"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        ส่งคำขอล่าสุด
                      </p>
                      <p className="text-sm font-black">
                        {selectedKYC.last_submitted_at
                          ? new Date(
                              selectedKYC.last_submitted_at,
                            ).toLocaleString("th-TH")
                          : "-"}
                      </p>
                    </div>
                    {selectedKYC.reviewed_at && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          ตรวจสอบเมื่อ
                        </p>
                        <p className="text-sm font-black">
                          {new Date(selectedKYC.reviewed_at).toLocaleString(
                            "th-TH",
                          )}
                        </p>
                      </div>
                    )}
                    {selectedKYC.reviewed_by && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          ผู้ตรวจสอบ
                        </p>
                        <p className="text-sm font-black break-all">
                          {selectedKYC.reviewed_by}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedKYC.status === "pending" && (
                  <form
                    id="kyc-review-form"
                    onSubmit={handleSubmit((values) =>
                      reviewMutation.mutate({
                        id: selectedKYC.id,
                        status: "rejected",
                        comment: values.comment,
                      }),
                    )}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-sm font-black text-slate-900 mb-3 block">
                        ระบุเหตุผลที่ปฏิเสธ (จำเป็นสำหรับสถานะปฏิเสธ)
                      </Label>
                      <Textarea
                        {...register("comment")}
                        className={`bg-slate-50 border-slate-200 rounded-[24px] p-6 min-h-[120px] focus:ring-brand-purple/20 transition-all font-bold ${errors.comment ? "border-pink-500" : ""}`}
                        placeholder="เช่น ข้อมูลไม่ชัดเจน, บัตรหมดอายุ, รูปถ่ายยืนยันไม่ตรงกัน..."
                      />
                      {errors.comment && (
                        <p className="text-pink-500 text-[10px] font-black mt-2 ml-4 uppercase tracking-wider">
                          {errors.comment.message}
                        </p>
                      )}
                    </div>
                  </form>
                )}

                {selectedKYC.comment && selectedKYC.status !== "pending" && (
                  <div className="bg-pink-50 border-2 border-pink-100 rounded-[32px] p-8 shadow-inner">
                    <h4 className="text-sm font-black text-pink-700 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      หมายเหตุจากการตรวจสอบ
                    </h4>
                    <p className="text-slate-600 font-bold leading-relaxed italic">
                      "{selectedKYC.comment}"
                    </p>
                  </div>
                )}
              </div>

              <div className="p-10 border-t border-slate-100 bg-slate-50/50 shrink-0">
                {selectedKYC.status === "pending" ? (
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedKYC(null);
                        reset();
                      }}
                      className="flex-1 h-14 rounded-[28px] font-black text-slate-400 hover:text-slate-900 transition-all"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      form="kyc-review-form"
                      disabled={reviewMutation.isPending}
                      className="flex-1 h-14 rounded-[28px] font-black bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "ปฏิเสธคำขอ"
                      )}
                    </Button>
                    <Button
                      onClick={() =>
                        reviewMutation.mutate({
                          id: selectedKYC.id,
                          status: "approved",
                        })
                      }
                      disabled={reviewMutation.isPending}
                      className="flex-1 h-14 rounded-[28px] font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "อนุมัติ KYC"
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedKYC(null);
                      reset();
                    }}
                    className="w-full h-14 rounded-[28px] font-black bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                  >
                    ปิดหน้าต่าง
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
