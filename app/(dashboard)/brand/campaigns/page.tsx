"use client";

import {
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Megaphone,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  title: string;
  budget: number;
  status: string;
  platform: string;
  category: string;
  created_at: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending_payment: {
    label: "รอชำระเงิน",
    color: "text-amber-600 bg-amber-50 border-amber-100",
    icon: Clock,
  },
  pending_approve: {
    label: "รอการตรวจสอบ",
    color: "text-blue-600 bg-blue-50 border-blue-100",
    icon: Clock,
  },
  active: {
    label: "เปิดรับสมัคร",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: CheckCircle2,
  },
  rejected: {
    label: "ถูกปฏิเสธ",
    color: "text-red-600 bg-red-50 border-red-100",
    icon: XCircle,
  },
};

export default function BrandCampaignsPage() {
  const router = useRouter();
  const {
    data: campaigns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["brand-campaigns"],
    queryFn: async () => {
      const data = await api({ url: "/v1/campaigns" });
      return Array.isArray(data) ? data : (data.items ?? data.campaigns ?? []);
    },
  });

  if (isLoading || isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดแคมเปญของคุณ...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
            แคมเปญทั้งหมด
          </h1>
          <p className="text-slate-500 text-base font-bold">
            จัดการและติดตามสถานะแคมเปญที่คุณสร้างขึ้น
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c: Campaign) => {
          const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending_payment;
          const Icon = st.icon;

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 border",
                    st.color,
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {st.label}
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2 leading-tight">
                  {c.title}
                </h3>

                <div className="flex gap-2 mb-6">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                    {c.platform}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                    {c.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-400">
                    งบประมาณ
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    ฿{c.budget.toLocaleString()}
                  </span>
                </div>

                {c.status === "pending_payment" && (
                  <button
                    onClick={() => router.push(`/brand/payment/${c.id}`)}
                    className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 transition-all"
                  >
                    <CreditCard className="w-4 h-4" />
                    ชำระเงินเดี๋ยวนี้
                  </button>
                )}

                {c.status !== "pending_payment" && (
                  <button
                    onClick={() =>
                      router.push(`/brand/campaigns/${c.id}/review`)
                    }
                    className="w-full h-12 rounded-2xl bg-white text-slate-900 font-bold text-xs flex items-center justify-center border-2 border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    รีวิว Draft
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {campaigns.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 border border-dashed border-slate-200 rounded-[40px]">
            <Megaphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">
              ยังไม่มีแคมเปญที่คุณสร้าง (ยังไม่ได้จ่ายเงิน)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
