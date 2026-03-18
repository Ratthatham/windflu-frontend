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
  ImageIcon,
  RotateCcw,
  Instagram,
  Youtube,
  Music2,
  Mail,
  Globe,
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

import { KYCRequest, KYCListResponse } from "@/type/kyc";
import { reviewSchema, ReviewFormValues } from "@/lib/validations/kyc";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { CreatorBackendProfile } from "@/type/profile";

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

  // Fetch creator profile when a KYC is selected for the modal
  const { data: creatorProfile, isLoading: isLoadingProfile } =
    useQuery<CreatorBackendProfile>({
      queryKey: ["admin-creator-profile", selectedKYC?.creator_id],
      queryFn: async () => {
        if (!selectedKYC?.creator_id) return null;
        return await api({
          url: `/v1/admin/creators/${selectedKYC.creator_id}`,
        });
      },
      enabled: !!selectedKYC,
    });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: "approved",
      comment: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      comment,
    }: {
      id: string;
      status: "approved" | "rejected" | "revise";
      comment?: string;
    }) => {
      return await api({
        url: `/v1/admin/kyc/${id}/status`,
        method: "PATCH",
        body: {
          status,
          ...(status === "revise" || status === "rejected" ? { comment } : {}),
        },
      });
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "approved"
          ? "อนุมัติ KYC แล้ว"
          : variables.status === "revise"
            ? "ส่งรายการให้แก้ไขแล้ว"
            : "ระงับ/Ban บัญชีแล้ว",
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
  const reviseRequests = kycRequests.filter((k) => k.status === "revise");

  const stats = [
    { icon: Clock, value: pendingRequests.length, label: "รอตรวจสอบ" },
    {
      icon: CheckCircle2,
      value: approvedRequests.length,
      label: "อนุมัติแล้ว",
    },
    { icon: XCircle, value: rejectedRequests.length, label: "โดนBanแล้ว" },
    { icon: RotateCcw, value: reviseRequests.length, label: "ให้ส่งใหม่" },
    { icon: Shield, value: kycRequests.length, label: "ทั้งหมด" },
  ];

  /* ── Table Configuration ──────────────────────────── */
  const columns = React.useMemo<ColumnDef<KYCRequest>[]>(
    () => [
      {
        accessorKey: "status",
        header: "สถานะ",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${
                status === "pending"
                  ? "bg-amber-50 text-amber-600 border-amber-100"
                  : status === "approved"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-pink-50 text-pink-500 border-pink-100"
              }`}
            >
              {status === "pending"
                ? "รอตรวจสอบ"
                : status === "approved"
                  ? "อนุมัติแล้ว"
                  : status === "revise"
                    ? "ให้ส่งใหม่"
                    : "โดนBan"}
            </span>
          );
        },
      },
      {
        accessorKey: "creator_id",
        header: "Creator ID",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-mono text-slate-900 truncate max-w-[150px]">
              {row.original.creator_id}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "last_submitted_at",
        header: "ส่งเมื่อ",
        cell: ({ row }) => (
          <div className="text-xs font-bold text-slate-500">
            {row.original.last_submitted_at
              ? new Date(row.original.last_submitted_at).toLocaleDateString(
                  "th-TH",
                )
              : "-"}
          </div>
        ),
      },
      {
        id: "actions",
        header: "จัดการ",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedKYC(row.original);
              }}
              className="w-10 h-10 p-0 rounded-2xl bg-white border-slate-200 text-slate-400 hover:text-brand-purple hover:border-brand-purple/20 shadow-sm"
            >
              <Eye className="w-5 h-5" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: kycRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

      {/* <WindflowStatsBar stats={stats} /> */}

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
            {["all", "pending", "approved", "revise", "rejected"].map(
              (status) => (
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
                        : status === "revise"
                          ? "ให้ส่งใหม่"
                          : "โดนBan"}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-slate-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-8 py-6 h-auto"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j} className="px-8 py-6">
                        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : kycRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
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
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer border-slate-50"
                    onClick={() => setSelectedKYC(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-8 py-6">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
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

              <div className="p-10 border-b border-slate-100 flex shrink-0 justify-between items-center bg-white shadow-xs">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    {creatorProfile?.avatar_url ||
                    creatorProfile?.profile_image_url ? (
                      <img
                        src={
                          creatorProfile.avatar_url ||
                          creatorProfile.profile_image_url
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-black text-slate-900">
                        {isLoadingProfile ? (
                          <Skeleton className="h-8 w-40" />
                        ) : (
                          creatorProfile?.display_name || "Clipper"
                        )}
                      </h3>
                      {creatorProfile?.account_verified && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {creatorProfile?.email && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {creatorProfile.email}
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {creatorProfile?.tiktok_profile_link && (
                          <a
                            href={creatorProfile.tiktok_profile_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple hover:bg-brand-purple/5 transition-all border border-slate-100 shadow-sm"
                            title="TikTok"
                          >
                            <Music2 className="w-4 h-4" />
                          </a>
                        )}
                        {creatorProfile?.instagram_profile_link && (
                          <a
                            href={creatorProfile.instagram_profile_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple hover:bg-brand-purple/5 transition-all border border-slate-100 shadow-sm"
                            title="Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {creatorProfile?.youtube_channel && (
                          <a
                            href={creatorProfile.youtube_channel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-purple hover:bg-brand-purple/5 transition-all border border-slate-100 shadow-sm"
                            title="YouTube"
                          >
                            <Youtube className="w-4 h-4" />
                          </a>
                        )}
                        {!creatorProfile?.tiktok_profile_link &&
                          !creatorProfile?.instagram_profile_link &&
                          !creatorProfile?.youtube_channel && (
                            <span className="text-xs text-slate-300 font-bold uppercase tracking-widest italic">
                              No social links
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
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
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        สถานะปัจจุบัน
                      </p>
                      <span
                        className={`text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider inline-block ${
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
                            : selectedKYC.status === "revise"
                              ? "ให้ส่งใหม่"
                              : "โดนBan"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
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
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
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
                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
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
                    onSubmit={handleSubmit(() => {})}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-sm font-black text-slate-900 mb-3 block">
                        ระบุเหตุผล (จำเป็นสำหรับ "ให้ส่งใหม่" หรือ "โดนBan")
                      </Label>
                      <Textarea
                        {...register("comment")}
                        className={`bg-slate-50 border-slate-200 rounded-[24px] p-6 min-h-[120px] focus:ring-brand-purple/20 transition-all font-bold ${errors.comment ? "border-pink-500" : ""}`}
                        placeholder="เช่น ข้อมูลไม่ชัดเจน, บัตรหมดอายุ, รูปถ่ายยืนยันไม่ตรงกัน..."
                      />
                      {errors.comment && (
                        <p className="text-pink-500 text-xs font-black mt-2 ml-4 uppercase tracking-wider">
                          {errors.comment.message}
                        </p>
                      )}
                    </div>
                  </form>
                )}

                {selectedKYC.comment && selectedKYC.status !== "pending" && (
                  <div
                    className={`rounded-[32px] shadow-inner border-2 ${
                      selectedKYC.status === "revise"
                        ? "bg-indigo-50 border-indigo-100"
                        : "bg-pink-50 border-pink-100"
                    }`}
                  >
                    <h4
                      className={`text-sm font-black mb-4 flex items-center gap-2 ${
                        selectedKYC.status === "revise"
                          ? "text-indigo-700"
                          : "text-pink-700"
                      }`}
                    >
                      {selectedKYC.status === "revise" ? (
                        <RotateCcw className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                      หมายเหตุจากการตรวจสอบ
                    </h4>
                    <p className="text-slate-600 font-bold leading-relaxed italic">
                      "{selectedKYC.comment}"
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 bg-slate-50/50 shrink-0">
                {selectedKYC.status === "pending" && (
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
                      onClick={() => {
                        setValue("status", "revise");
                        handleSubmit((values) =>
                          reviewMutation.mutate({
                            id: selectedKYC.id,
                            status: "revise",
                            comment: values.comment,
                          }),
                        )();
                      }}
                      disabled={reviewMutation.isPending}
                      className="flex-1 h-14 rounded-[28px] font-black bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "ให้ส่งใหม่"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setValue("status", "rejected");
                        handleSubmit((values) =>
                          reviewMutation.mutate({
                            id: selectedKYC.id,
                            status: "rejected",
                            comment: values.comment,
                          }),
                        )();
                      }}
                      disabled={reviewMutation.isPending}
                      className="flex-1 h-14 rounded-[28px] font-black bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "โดนBan"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setValue("status", "approved");
                        handleSubmit((values) =>
                          reviewMutation.mutate({
                            id: selectedKYC.id,
                            status: "approved",
                          }),
                        )();
                      }}
                      disabled={reviewMutation.isPending}
                      className="flex-1 h-14 rounded-[28px] font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      {reviewMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "อนุมัติ"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
