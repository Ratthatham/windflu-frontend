"use client";

import React from "react";
import {
  Banknote,
  PieChart,
  Megaphone,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  TrendingDown,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Flame,
  Wallet,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/app/utils/api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrandDashboardStats {
  approved_submissions: number;
  expired_campaigns: number;
  pending_approve_campaigns: number;
  pending_payment_campaigns: number;
  rejected_submissions: number;
  remaining_budget: number;
  running_campaigns: number;
  total_budget: number;
  total_campaigns: number;
  total_spent: number;
  total_submissions: number;
  total_views: number;
}

export default function BrandDashboardPage() {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["brand-dashboard-stats"],
    queryFn: async () => {
      return await api({ url: "/v1/brands/dashboard" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-slate-200 animate-spin" />
        <p className="text-slate-400 font-bold text-sm">
          กำลังโหลดภาพรวมข้อมูลแบรนด์...
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
      label: "งบประมาณทั้งหมด",
      value: `฿${stats.total_budget.toLocaleString()}`,
      icon: Banknote,
      color: "blue",
      description: "งบรวมทุกแคมเปญที่เปิด",
    },
    {
      label: "งบประมาณคงเหลือ",
      value: `฿${stats.remaining_budget.toLocaleString()}`,
      icon: PieChart,
      color: "green",
      description: "งบที่ใช้ได้สำหรับแคมเปญปัจจุบัน",
    },
    {
      label: "ยอดการรับชมรวม",
      value: stats.total_views.toLocaleString(),
      icon: Eye,
      color: "purple",
      description: "ยอดวิวทั้งหมดจากทุกคอนเทนต์",
    },
    {
      label: "แคมเปญที่รันอยู่",
      value: stats.running_campaigns,
      icon: Flame,
      color: "orange",
      description: "จำนวนแคมเปญที่กำลังดำเนินการ",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-slate-900">
            ภาพรวมแบรนด์
          </h1>
          <p className="text-slate-500 text-base font-bold">
            ติดตามประสิทธิภาพและงบประมาณแคมเปญของคุณ
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 h-11 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
          <Megaphone className="w-4 h-4" />
          สร้างแคมเปญใหม่
        </button>
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
                        : "bg-orange-50 text-orange-600",
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
        {/* Campaign Analytics */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-slate-400" />
              วิเคราะห์แคมเปญ
            </h2>
            <div className="flex gap-2">
              <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase">
                {stats.total_campaigns} ทั้งหมด
              </span>
            </div>
          </div>
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-500" /> รันอยู่
              </span>
              <span className="text-2xl font-black text-slate-900">
                {stats.running_campaigns}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock className="w-3 h-3 text-amber-500" /> รออนุมัติ
              </span>
              <span className="text-2xl font-black text-slate-900">
                {stats.pending_approve_campaigns}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Wallet className="w-3 h-3 text-blue-500" /> รอชำระเงิน
              </span>
              <span className="text-2xl font-black text-slate-900">
                {stats.pending_payment_campaigns}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <XCircle className="w-3 h-3 text-slate-400" /> หมดอายุ
              </span>
              <span className="text-2xl font-black text-slate-900">
                {stats.expired_campaigns}
              </span>
            </div>
          </div>

          <div className="px-8 pb-8 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">
                    ยอดการใช้จ่ายรวม
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    จากแคมเปญที่เสร็จสิ้นแล้ว
                  </p>
                </div>
              </div>
              <p className="text-lg font-black text-slate-900">
                ฿{stats.total_spent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content Status Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              สรุปคอนเทนต์
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ผลงานที่อนุมัติ
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {stats.approved_submissions}
                  </p>
                </div>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: "70%" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    ผลงานที่ไม่ผ่าน
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {stats.rejected_submissions}
                  </p>
                </div>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    คอนเทนต์ทั้งหมด
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {stats.total_submissions}
                  </p>
                </div>
                <Megaphone className="w-6 h-6 text-slate-200" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold text-slate-400 text-center mb-4">
              ประสิทธิภาพแคมเปญเฉลี่ย:{" "}
              <span className="text-emerald-600 font-black">ดีเยี่ยม</span>
            </p>
            <button className="w-full bg-white border border-slate-200 text-slate-900 h-12 rounded-xl font-black text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              ส่งออกรายงาน PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
