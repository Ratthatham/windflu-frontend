"use client";

import React from "react";
import {
  Wallet,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CreatorDashboardStats {
  approved_submissions: number;
  available_balance: number;
  pending_income: number;
  pending_review_submissions: number;
  rejected_submissions: number;
  total_income: number;
  total_paid_out: number;
  total_submissions: number;
  total_views: number;
  total_views_to_pay: number;
}

export default function CreatorDashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["creator-dashboard-stats"],
    queryFn: async () => {
      return await api({ url: "/v1/creators/dashboard" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดภาพรวมข้อมูลของคุณ...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-12 h-12 text-pink-500 mx-auto mb-4 opacity-50" />
        <p className="text-slate-500 font-bold">
          ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
        </p>
      </div>
    );
  }

  const statCards = [
    {
      label: "รายได้ทั้งหมด",
      value: `฿${stats.total_income.toLocaleString()}`,
      icon: TrendingUp,
      color: "blue",
      description: "รายได้สะสมตั้งแต่เริ่มใช้งาน",
    },
    {
      label: "ยอดที่ถอนได้",
      value: `฿${stats.available_balance.toLocaleString()}`,
      icon: Wallet,
      color: "green",
      description: "เงินรางวัลที่พร้อมโอนเข้าบัญชี",
    },
    {
      label: "ยอดการรับชมรวม",
      value: stats.total_views.toLocaleString(),
      icon: Eye,
      color: "purple",
      description: "จากทุกคลิปที่ได้รับการแจ้งเตือน",
    },
    {
      label: "รอการตรวจสอบ",
      value: stats.pending_review_submissions,
      icon: Clock,
      color: "yellow",
      description: "คลิปที่ส่งแล้ว รอการอนุมัติ",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
          ภาพรวมของฉัน
        </h1>
        <p className="text-slate-500 text-base font-bold">
          สรุปรายได้และผลงานทั้งหมดของคุณใน Windflu
        </p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "p-3 rounded-2xl",
                  card.color === "blue"
                    ? "bg-blue-50 text-blue-600"
                    : card.color === "green"
                      ? "bg-emerald-50 text-emerald-600"
                      : card.color === "purple"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-amber-50 text-amber-600",
                )}
              >
                <card.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <h3 className="text-2xl font-black text-slate-900 mb-1">
              {card.value}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submissions Summary */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
              สรุปผลงานของคุณ
            </h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              ทั้งหมด {stats.total_submissions} คลิป
            </span>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />{" "}
                อนุมัติแล้ว
              </span>
              <span className="text-3xl font-black text-slate-900">
                {stats.approved_submissions}
              </span>
              <div className="mt-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-flex self-start">
                {(
                  (stats.approved_submissions /
                    (stats.total_submissions || 1)) *
                  100
                ).toFixed(0)}
                % Approval Rate
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3 text-amber-500" /> รอรีวิว
              </span>
              <span className="text-3xl font-black text-slate-900">
                {stats.pending_review_submissions}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <XCircle className="w-3 h-3 text-pink-500" /> ไม่ผ่าน/แก้ไข
              </span>
              <span className="text-3xl font-black text-slate-900">
                {stats.rejected_submissions}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Income Stats */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
              ยอดเงินรอยืนยัน
            </p>
            <h3 className="text-4xl font-black mb-6">
              ฿{stats.pending_income.toLocaleString()}
            </h3>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs font-bold uppercase">
                  จ่ายแล้วทั้งหมด
                </span>
                <span className="text-sm font-black">
                  ฿{stats.total_paid_out.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs font-bold uppercase">
                  ยอดวิวรอจ่าย
                </span>
                <span className="text-sm font-black">
                  {stats.total_views_to_pay.toLocaleString()} วิว
                </span>
              </div>
            </div>
          </div>

          <button className="relative z-10 w-full mt-8 bg-white text-slate-900 h-14 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
            ถอนเงินรางวัล
          </button>
        </div>
      </div>
    </div>
  );
}
