import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down";
}

export function Card({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: CardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 active:scale-[0.99]">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-zinc-50 p-2 text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
              trend === "up"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend === "up" ? "+12%" : "-5%"}
          </div>
        )}
      </div>
      <div className="mt-5">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
          {value}
        </h3>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <p className="text-xs text-zinc-400">
          <span
            className={cn(
              "font-semibold",
              trend === "up" ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {description}
          </span>
        </p>
      </div>
    </div>
  );
}
