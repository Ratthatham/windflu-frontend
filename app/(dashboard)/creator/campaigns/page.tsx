"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import WindflowCampaignCard from "@/components/dashboard/WindflowCampaignCard";
import api from "@/app/utils/api";
import { APICampaign, Campaign } from "@/type/campaigns";
import { useQuery } from "@tanstack/react-query";
import { mapApiToCard } from "@/app/utils/campaign";

export default function ClipperDashboard() {
  const [filter, setFilter] = useState("all");

  const {
    data: campaigns,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () =>
      await api({
        url: "/v1/campaigns",
        method: "GET",
      }),
    select(resp: { items: APICampaign[] }) {
      const mapData: Campaign[] = resp.items.map(mapApiToCard);
      return mapData;
    },
  });

  const TABS = [
    ["all", "ทั้งหมด"],
    ["food", "อาหาร"],
    ["game", "เกม"],
    ["gadget", "แกดเจ็ต"],
    ["education", "การเรียน"],
  ];

  const filteredCampaigns =
    filter === "all" ? campaigns : campaigns?.filter((c) => c.type === filter);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
            แคมเปญ
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            เลือกแคมเปญที่คุณสนใจ แล้วเริ่มสร้างคอนเทนต์ได้เลย
          </p>
        </div>
      </div>

      {/* Tabs + campaign grid */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <Tabs
          value={filter}
          onValueChange={setFilter}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-slate-100 border border-slate-200 p-1.5 h-12 rounded-2xl">
            {TABS.map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="rounded-xl px-6 py-2 h-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm font-bold text-sm text-slate-500 hover:text-slate-900 transition-all outline-none"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredCampaigns?.map((items) => (
          <WindflowCampaignCard key={items.id} campaign={items} />
        ))}
      </div>

      {filteredCampaigns?.length === 0 && !loading && (
        <div className="text-center py-32 bg-white/50 border border-dashed border-[#ede8f5] rounded-[40px] mt-10">
          <div className="bg-zinc-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="w-10 h-10 text-[#c4b8e0]" />
          </div>
          <h3 className="text-xl font-bold text-[#1a1230] mb-2">
            {error ? "โหลดข้อมูลไม่สำเร็จ" : "ไม่พบแคมเปญในหมวดนี้"}
          </h3>
          <p className="text-[#6b5f8a] font-medium">
            {error
              ? (error as Error).message || "กรุณาลองใหม่ภายหลัง"
              : "ลองเปลี่ยนหมวดหมู่ หรือกลับมาเช็คใหม่ภายหลังนะ"}
          </p>
        </div>
      )}
    </div>
  );
}
