"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  X,
  RefreshCw,
  Calendar,
  Tag,
  DollarSign,
  Target,
  Megaphone,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/utils/api";
import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────── */
interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  budget: number;
  price_per_1000_views: number;
  target_views: number;
  total_views: number;
  start_date: string;
  end_date: string;
  status: string;
  requirements: string[];
  images: string[];
  created_by: string;
  created_at: string;
}

/* ── Helpers ────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending_payment: {
    label: "รอชำระเงิน",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  pending_approve: {
    label: "รออนุมัติ",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  approved: {
    label: "Approved",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600 bg-red-50 border-red-100",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  active: {
    label: "Active",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  expired: {
    label: "หมดอายุ",
    color: "text-slate-600 bg-slate-50 border-slate-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

const fmt = (n: number) => n?.toLocaleString() ?? "0";
const fmtDate = (s: string) =>
  s
    ? new Date(s).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

/* ── Approve Modal ──────────────────────────────────── */
function ApproveModal({
  campaign,
  onClose,
  onSuccess,
}: {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [rate, setRate] = useState(String(campaign.price_per_1000_views || ""));
  const [slotCount, setSlotCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!rate || !slotCount) return;
    setError(null);
    setLoading(true);
    try {
      await api({
        url: `/v1/admin/campaigns/${campaign.id}/approve`,
        method: "PATCH",
        body: {
          rate_per_1000_views: Number(rate),
          slot_submission: Number(slotCount),
        },
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Approve ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-lg">
                  Approve แคมเปญ
                </h3>
                <p className="text-slate-500 text-sm truncate max-w-[200px]">
                  {campaign.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="mb-8">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 block px-1">
              Rate ต่อ 1,000 วิว (บาท)
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                ฿
              </div>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="เช่น 50"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 h-14 rounded-2xl px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs px-1">
              <span>งบที่แบรนด์ตั้ง: ฿{fmt(campaign.budget)}</span>
              <span>·</span>
              <span>ราคาเดิม: ฿{fmt(campaign.price_per_1000_views)}</span>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 block px-1">
              จำนวน Clipper ที่รับ (คน)
            </label>
            <div className="relative group">
              <input
                type="number"
                value={slotCount}
                onChange={(e) => setSlotCount(e.target.value)}
                placeholder="เช่น 50"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 h-14 rounded-2xl px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold transition-all"
                min="1"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all shadow-sm active:scale-95"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleApprove}
              disabled={loading || !rate || !slotCount}
              className="flex-1 h-12 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/20 active:scale-95 hover:bg-slate-800"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Detail Modal ───────────────────────────────────── */
function CampaignDetailModal({
  campaign,
  onClose,
  onApprove,
}: {
  campaign: Campaign;
  onClose: () => void;
  onApprove: (c: Campaign) => void;
}) {
  const st = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.pending_approve;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Megaphone className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h3 className="text-slate-900 font-black text-xl leading-tight">
                รายละเอียดแคมเปญ
              </h3>
              <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-0.5">
                ID: {campaign.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          {/* Status + Title */}
          <div>
            <div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4 border",
                st.color,
              )}
            >
              {st.icon}
              {st.label}
            </div>
            <h2 className="text-slate-900 text-3xl font-black mb-3 leading-tight font-display">
              {campaign.title}
            </h2>
            {campaign.description ? (
              <div
                className="text-slate-500 text-base leading-relaxed font-medium [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4 [&_a]:text-brand-purple [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: campaign.description }}
              />
            ) : (
              <p className="text-slate-500 text-base leading-relaxed font-medium">
                ไม่มีคำอธิบายสำหรับแคมเปญนี้
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: DollarSign,
                label: "งบประมาณ",
                value: `฿${fmt(campaign.budget)}`,
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              },
              {
                icon: Target,
                label: "Target Views",
                value: fmt(campaign.target_views),
                color: "text-blue-600 bg-blue-50 border-blue-100",
              },
              {
                icon: Tag,
                label: "Price/1K",
                value: `฿${fmt(campaign.price_per_1000_views)}`,
                color: "text-amber-600 bg-amber-50 border-amber-100",
              },
              {
                icon: Target,
                label: "Total Views",
                value: fmt(campaign.total_views),
                color: "text-slate-600 bg-slate-50 border-slate-200",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className={cn(
                  "p-5 rounded-3xl border transition-all hover:scale-[1.02] shadow-sm",
                  color,
                )}
              >
                <Icon className="w-5 h-5 mb-3 opacity-80" />
                <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">
                  {label}
                </div>
                <div className="text-lg font-black">{value}</div>
              </div>
            ))}
          </div>

          {/* Info Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                Basic Info
              </h4>
              <div className="bg-slate-50 rounded-[24px] border border-slate-100 p-2 overflow-hidden">
                {[
                  { label: "หมวดหมู่", value: campaign.category },
                  { label: "แพลตฟอร์ม", value: campaign.platform },
                  { label: "วันเริ่ม", value: fmtDate(campaign.start_date) },
                  { label: "วันสิ้นสุด", value: fmtDate(campaign.end_date) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-white transition-all group"
                  >
                    <span className="text-slate-500 text-sm font-bold">
                      {label}
                    </span>
                    <span className="text-slate-900 text-sm font-black text-right">
                      {value || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                Requirements
              </h4>
              <div className="bg-slate-50 rounded-[24px] border border-slate-100 p-6 min-h-[160px]">
                {campaign.requirements?.length > 0 ? (
                  <div className="space-y-3">
                    {campaign.requirements.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-slate-700 text-sm font-bold"
                      >
                        <div className="w-5 h-5 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                        {r}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                    <AlertCircle className="w-6 h-6 opacity-50" />
                    <span className="text-xs font-bold">
                      ไม่มี Requirements
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Images */}
          {campaign.images?.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                Campaign Media
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {campaign.images.map((url, i) => (
                  <div
                    key={i}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {(campaign.status === "pending" ||
          campaign.status === "pending_approve") && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 shrink-0">
            <button
              onClick={() => onApprove(campaign)}
              className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 active:scale-95 hover:bg-slate-800 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              อนุมัติแคมเปญนี้
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [approving, setApproving] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending_payment");
  const [successId, setSuccessId] = useState<string | null>(null);

  const FILTERS = [
    { value: "pending_payment", label: "รอชำระเงิน" },
    { value: "pending_approve", label: "รออนุมัติ" },
    { value: "active", label: "กำลังทำงาน" },
    { value: "expired", label: "หมดอายุ" },
    { value: "rejected", label: "ถูกปฏิเสธ" },
    { value: "", label: "ทั้งหมด" },
  ];

  const {
    data: campaigns = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-campaigns", statusFilter],
    queryFn: async () => {
      const params: Record<string, string> = { limit: "50" };
      if (statusFilter) params.status = statusFilter;

      const data = await api({
        url: "/v1/admin/campaigns",
        method: "GET",
        params,
      });

      return (
        data?.items ?? data?.campaigns ?? (Array.isArray(data) ? data : [])
      );
    },
  });

  /* ── Table Configuration ──────────────────────────── */
  const columnHelper = createColumnHelper<Campaign>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "แคมเปญ",
        cell: (info) => (
          <div className="flex flex-col min-w-[200px]">
            <span className="font-bold text-slate-900 line-clamp-1">
              {info.getValue()}
            </span>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {info.row.original.platform} · {info.row.original.category}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "สถานะ",
        cell: (info) => {
          const status = info.getValue();
          const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending_approve;
          return (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border",
                config.color,
              )}
            >
              {config.icon}
              {config.label}
            </div>
          );
        },
      }),
      columnHelper.accessor("budget", {
        header: "งบประมาณ",
        cell: (info) => (
          <div className="font-black text-slate-900">
            ฿{fmt(info.getValue())}
          </div>
        ),
      }),
      columnHelper.accessor("target_views", {
        header: "เป้าหมายวิว",
        cell: (info) => (
          <div className="font-bold text-slate-600">{fmt(info.getValue())}</div>
        ),
      }),
      columnHelper.accessor("start_date", {
        header: "ระยะเวลา",
        cell: (info) => (
          <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
            {fmtDate(info.getValue())}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "จัดการ",
        cell: (info) => (
          <div className="flex items-center gap-2">
            {(info.row.original.status === "pending" ||
              info.row.original.status === "pending_approve") && (
              <button
                onClick={() => setApproving(info.row.original)}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm border border-emerald-100"
                title="Approve"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelected(info.row.original)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all shadow-sm border border-slate-200"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    data: campaigns,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/set-token", { method: "DELETE" });
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user_role");
      Cookies.remove("user_id");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      router.push("/");
    }
  };

  const handleApproveSuccess = () => {
    setSuccessId(approving?.id ?? null);
    setApproving(null);
    setSelected(null);
    refetch();
    setTimeout(() => setSuccessId(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center border border-slate-100">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              แผงควบคุมแอดมิน
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-display">
            Campaign <span className="text-slate-400">Reviews</span>
          </h1>
          <p className="text-slate-500 font-bold mt-2">
            ตรวจสอบและจัดการคำขอแคมเปญทั้งหมดจากพาร์ทเนอร์แบรนด์
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="h-12 w-12 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all shadow-sm active:scale-95"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
          </button>
          <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden md:block" />
          <button
            onClick={handleLogout}
            className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="space-y-6">
        {/* Success toast */}
        <AnimatePresence>
          {successId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-3xl text-sm font-bold flex items-center gap-3 shadow-xl shadow-emerald-900/5"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              อนุมัติแคมเปญสำเร็จแล้ว ข้อมูลกำลังถูกส่งไปยังขั้นตอนถัดไป
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {FILTERS.map((f) => {
            const isActive = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border shrink-0",
                  isActive
                    ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.05] z-10"
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900 shadow-sm",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-slate-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-8 py-6 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-8 py-6">
                          <div className="h-4 bg-slate-100 rounded-full w-2/3" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center">
                          <Megaphone className="w-8 h-8 text-slate-200" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-900 font-black text-lg">
                            ไม่พบข้อมูลในขณะนี้
                          </p>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                            ลองเปลี่ยนหมวดหมู่หรือสถานะดูนะ
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                      onClick={() => setSelected(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-8 py-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Summary */}
          {!loading && campaigns.length > 0 && (
            <div className="px-8 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                แสดงทั้งหมด {campaigns.length} รายการ
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
                  ขัอมูลเป็นปัจจุบัน
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border border-red-100 rounded-3xl shadow-2xl flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-slate-900 font-bold">
                  เกิดข้อผิดพลาดในการเชื่อมต่อ
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {(error as any)?.message || "โหลดข้อมูลไม่สำเร็จ"}
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              className="h-12 px-6 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/20 active:scale-95 whitespace-nowrap"
            >
              ลองใหม่
            </button>
          </motion.div>
        </div>
      )}

      {/* Centered Campaign Detail Modal */}
      <AnimatePresence>
        {selected && (
          <CampaignDetailModal
            campaign={selected}
            onClose={() => setSelected(null)}
            onApprove={(c) => {
              setApproving(c);
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {approving && (
          <ApproveModal
            campaign={approving}
            onClose={() => setApproving(null)}
            onSuccess={handleApproveSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
