import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Calendar, TrendingUp } from "lucide-react";
import dayjs from "dayjs";
import { Campaign } from "@/type/campaigns";
import router from "next/router";

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

interface WindflowCampaignCardProps {
  campaign: Campaign;
}

export default function WindflowCampaignCard({
  campaign,
}: WindflowCampaignCardProps) {
  const isOpen = campaign.status === "open";
  const budget = campaign.budget || 0;
  const remainingBudget = campaign.remaining_budget ?? budget;
  const spentBudget = budget - remainingBudget;
  const budgetUsed = budget > 0 ? (spentBudget / budget) * 100 : 0;
  const variant = (typeColors[campaign.type as keyof typeof typeColors] ||
    "purple") as any;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
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

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-black text-[#1a1230] mb-1 line-clamp-1 group-hover:text-brand-purple transition-colors">
            {campaign.name}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md bg-brand-purple/10">
              <TrendingUp className="w-3.5 h-3.5 text-brand-purple" />
            </div>
            <span className="text-sm font-black text-[#1a1230]">
              {campaign.cpm != null
                ? `฿${campaign.cpm.toLocaleString()}`
                : "฿40"}
            </span>
            <span className="text-xs font-bold text-[#6b5f8a]">
              / 1K วิว
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#6b5f8a]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dayjs(campaign.end_date).format("DD/MM/YYYY")}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#6b5f8a] mb-1.5">
            <span>งบประมาณคงเหลือ</span>
            <span className="text-[#1a1230]">
              {campaign.budget != null
                ? `฿${campaign.budget.toLocaleString()}`
                : "ไม่จำกัด"}
            </span>
          </div>
          <div className="h-1.5 bg-[#f0e8ff] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${budgetUsed}%`,
                background: "linear-gradient(135deg,#8B5CF6,#22D3EE)",
              }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/creator/campaigns/${campaign.id}`} className="flex-1">
            <button className="btn-secondary w-full text-xs h-10 shadow-sm">
              ดูรายละเอียด
            </button>
          </Link>

          <button
            className="btn-cta h-10 text-xs px-5 shadow-sm shadow-brand-purple/20"
            disabled={campaign.submitted}
            onClick={() => router.push(`/creator/submit/${campaign.id}`)}
          >
            รับงาน
          </button>
        </div>
      </div>
    </div>
  );
}
