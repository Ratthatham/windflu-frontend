import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";

const typeColors = {
  food: "purple",
  game: "cyan",
  gadget: "yellow",
  education: "purple",
} as const;

const typeLabels = {
  food: "อาหาร",
  game: "เกม",
  gadget: "แกดเจ็ต",
  education: "การเรียน",
};

interface Campaign {
  id: string;
  name: string;
  brand: string;
  description: string;
  type: string;
  status: string;
  budget?: string;
  cpm?: string;
  thumbnail?: string;
}

interface WindflowCampaignCardProps {
  campaign: Campaign;
}

export default function WindflowCampaignCard({
  campaign,
}: WindflowCampaignCardProps) {
  const isOpen = campaign.status === "open";
  // Mock budget calculation
  const budgetUsed = 90;
  const variant = (typeColors[campaign.type as keyof typeof typeColors] ||
    "purple") as any;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-[32px] overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-zinc-100">
        {campaign.thumbnail ? (
          <img
            src={campaign.thumbnail}
            alt={campaign.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-brand-purple/20 to-brand-cyan/20 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-brand-purple/30" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            variant={variant}
            className="backdrop-blur-md bg-white/80 border-none shadow-sm capitalize"
          >
            {typeLabels[campaign.type as keyof typeof typeLabels] ||
              campaign.type}
          </Badge>
          <Badge
            variant={isOpen ? "success" : "outline"}
            className={
              isOpen
                ? "bg-emerald-500 text-white border-none"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }
          >
            {isOpen ? "เปิดรับ" : "งบหมด"}
          </Badge>
        </div>
      </div>

      <div className="p-7">
        <div className="mb-4">
          <h3 className="text-xl font-black text-[#1a1230] mb-1 line-clamp-1 group-hover:text-brand-purple transition-colors">
            {campaign.name}
          </h3>
          <p className="text-xs font-bold text-brand-purple uppercase tracking-wider">
            {campaign.brand}
          </p>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 rounded-lg bg-brand-purple/10">
              <TrendingUp className="w-4 h-4 text-brand-purple" />
            </div>
            <span className="text-base font-black text-[#1a1230]">
              {campaign.cpm || "฿40"}
            </span>
            <span className="text-xs font-bold text-[#6b5f8a]">/ 1K วิว</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b5f8a]">
            <Calendar className="w-4 h-4" />
            <span>30 เม.ย. 67</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-[#6b5f8a] mb-2">
            <span>งบประมาณคงเหลือ</span>
            <span className="text-[#1a1230]">
              {campaign.budget || "ไม่จำกัด"}
            </span>
          </div>
          <div className="h-2 bg-[#f0e8ff] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(10, 100 - budgetUsed)}%`,
                background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
              }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/campaigns/${campaign.id}`} className="flex-1">
            <button className="btn-secondary w-full text-sm h-12 shadow-sm">
              ดูรายละเอียด
            </button>
          </Link>

          <Link href={`/submit/${campaign.id}`}>
            <button className="btn-cta h-12 text-sm px-6 shadow-lg shadow-brand-purple/20">
              รับงาน
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
