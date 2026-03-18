"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DollarSign,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle2,
  Eye,
  Scissors,
  Calculator,
} from "lucide-react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import api from "@/app/utils/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { APICampaign } from "@/type/campaigns";

const typeColors: Record<string, string> = {
  music: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  game: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  movie: "bg-red-500/20 text-red-400 border-red-500/30",
  podcast: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  food: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  gadget: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  education: "bg-green-500/20 text-green-400 border-green-500/30",
};

const typeLabels: Record<string, string> = {
  music: "เพลง",
  game: "เกม",
  movie: "หนัง",
  podcast: "Podcast",
  food: "อาหาร",
  gadget: "แกดเจ็ต",
  education: "การเรียน",
};

export default function CampaignDetail() {
  const params = useParams();
  const campaignId = params.id as string;
  const [calcViews, setCalcViews] = useState("");

  const {
    data: campaign,
    isLoading,
    error,
  } = useQuery<APICampaign>({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const resp = await api({ url: `/v1/campaigns/${campaignId}` });

      return resp;
    },
    enabled: !!campaignId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b14]">
        <div className="w-8 h-8 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b14] text-white">
        <h2 className="text-xl font-bold mb-2">ไม่พบแคมเปญ</h2>
        <p className="text-[#6b7a96] mb-6">
          แคมเปญนี้อาจถูกลบหรือไม่มีอยู่จริง
        </p>
        <Link href="/creator/campaigns">
          <Button className="bg-[#1e2d45] text-white hover:bg-[#2a3a55]">
            กลับไปหน้าแคมเปญ
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate earnings based on expected views and CPM (per 1,000 views)
  const calcEarnings = calcViews
    ? ((parseFloat(calcViews.replace(/,/g, "")) || 0) / 1000) *
      (campaign.price_per_1000_views || 0)
    : null;

  // Derive UI variables from API fields
  const cpmRate = campaign.price_per_1000_views || 0;
  const thumbnail = (campaign.images && campaign.images[0]) || "";
  const categoryType = (campaign.category || "game").toLowerCase();
  const categoryClass = typeColors[categoryType] || typeColors.game;
  const categoryLabel =
    typeLabels[categoryType] || campaign.category || "อื่นๆ";
  const remainingBudget = campaign.remaining_budget ?? campaign.budget ?? 0;

  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d1421] border border-[#1e2d45] rounded-2xl p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={campaign.title}
                className="w-full md:w-48 h-32 object-cover rounded-xl border border-[#1e2d45]"
              />
            ) : (
              <div className="w-full md:w-48 h-32 rounded-xl border border-[#1e2d45] bg-[#1e2d45]/50 flex items-center justify-center text-[#6b7a96]">
                ไม่มีรูปภาพ
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${categoryClass} border text-xs font-bold`}>
                  {categoryLabel}
                </Badge>
                <Badge
                  className={`border text-xs font-bold ${
                    campaign.status === "open" || campaign.status === "active"
                      ? "bg-[#a8ff3e]/10 text-[#a8ff3e] border-[#a8ff3e]/30"
                      : "bg-[#1e2d45] text-[#6b7a96] border-[#1e2d45]"
                  }`}
                >
                  {campaign.status === "open" || campaign.status === "active"
                    ? "เปิดอยู่"
                    : campaign.status === "closed"
                      ? "ปิดแล้ว งบหมดแล้วนะ รอรอบหน้า"
                      : campaign.status === "paused"
                        ? "หยุดไว้ก่อน"
                        : campaign.status}
                </Badge>
              </div>
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">
                {campaign.title}
              </h1>
              <div className="flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#a8ff3e]" />
                  <span className="text-white font-bold">฿{cpmRate}</span>
                  <span className="text-[#6b7a96] text-sm">ต่อ 1K วิว</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#6b7a96]" />
                  <span className="text-white font-bold">
                    ฿{remainingBudget.toLocaleString()}
                  </span>
                  <span className="text-[#6b7a96] text-sm">งบเหลืออยู่</span>
                </div>
                {campaign.end_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6b7a96]" />
                    <span className="text-[#6b7a96] text-sm">
                      {dayjs(campaign.end_date).format("D MMM YYYY")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0d1421] border border-[#1e2d45] rounded-2xl p-6">
              <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#a8ff3e]" />{" "}
                ต้องทำอะไรบ้าง
              </h2>
              <div className="space-y-3 mb-4">
                {campaign.description ? (
                  <div
                    className="text-[#ccc] text-sm leading-relaxed [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:ml-4 [&_ul]:ml-4 [&_a]:text-[#a8ff3e] [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                  />
                ) : (
                  <p className="text-[#6b7a96] text-sm">
                    ไม่มีข้อกำหนดพิเศษระบุไว้
                  </p>
                )}
              </div>
            </div>

            {campaign.attachment_links &&
              campaign.attachment_links.length > 0 && (
                <div className="bg-[#0d1421] border border-[#1e2d45] rounded-2xl p-6">
                  <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#a8ff3e]" />{" "}
                    โหลดไฟล์เอกสารที่เกี่ยวข้อง
                  </h2>
                  <div className="space-y-2">
                    {campaign.attachment_links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#070b14] border border-[#1e2d45] hover:border-[#a8ff3e]/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-[#a8ff3e]" />
                        <span className="text-sm font-medium text-white">
                          {link}
                        </span>
                        <ExternalLink className="w-3 h-3 text-[#6b7a96] ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#0d1421] border border-[#1e2d45] rounded-2xl p-5">
              <h2 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#a8ff3e]" /> ลองคำนวณรายได้
              </h2>
              <div className="relative mb-3">
                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a96]" />
                <Input
                  value={calcViews}
                  onChange={(e) => setCalcViews(e.target.value)}
                  className="pl-9 bg-[#070b14] border-[#1e2d45] text-white h-11 focus-visible:ring-[#a8ff3e]/40"
                  placeholder="ใส่จำนวนวิวเลย"
                />
              </div>
              <div
                className={`rounded-xl p-4 transition-all ${
                  calcEarnings !== null
                    ? "bg-[#a8ff3e]/10 border border-[#a8ff3e]/30"
                    : "bg-[#070b14] border border-[#1e2d45]"
                }`}
              >
                <div className="text-xs text-[#6b7a96] mb-1">
                  รายได้ที่คาดว่าจะได้
                </div>
                <span
                  className={`text-2xl font-bold ${
                    calcEarnings !== null ? "text-[#a8ff3e]" : "text-[#2a3a55]"
                  }`}
                >
                  {calcEarnings !== null
                    ? `฿${calcEarnings.toFixed(2)}`
                    : "฿0.00"}
                </span>
                {calcEarnings !== null && (
                  <p className="text-xs text-[#6b7a96] mt-1">
                    {Number(calcViews.replace(/,/g, "")).toLocaleString()} วิว ×
                    ฿{cpmRate} CPM ÷ 1,000
                  </p>
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[10000, 100000, 500000, 1000000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setCalcViews(String(v))}
                    className="text-xs p-2 rounded-lg bg-[#070b14] border border-[#1e2d45] hover:border-[#a8ff3e]/40 text-[#6b7a96] hover:text-white transition-all"
                  >
                    {v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}K`} วิว
                  </button>
                ))}
              </div>
            </div>

            {(campaign.status === "open" || campaign.status === "active") && (
              <Link href={`/creator/submit/${campaign.id}`} className="block">
                <Button className="w-full bg-[#a8ff3e] text-[#070b14] hover:bg-[#b8ff5a] font-bold text-base h-14 rounded-2xl">
                  <Scissors className="w-5 h-5 mr-2" /> ตัดคลิปได้เลย
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
