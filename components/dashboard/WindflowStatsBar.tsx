import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

interface WindflowStatsBarProps {
  stats: StatItem[];
}

const WindflowStatsBar = ({ stats }: WindflowStatsBarProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all relative overflow-hidden group shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-lg transition-transform group-hover:scale-110">
              <stat.icon className="w-4 h-4 text-brand-purple" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900 leading-none">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          </div>
          <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-slate-50 rounded-full blur-xl group-hover:bg-slate-100 transition-colors" />
        </motion.div>
      ))}
    </div>
  );
};

export default WindflowStatsBar;
