"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Package,
  ChevronRight,
  Wind,
  LogOut,
  Plus,
  Shield,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const roleNavigation: Record<
  string,
  { name: string; href: string; icon: any }[]
> = {
  creator: [
    { name: "ภาพรวม", href: "/creator/dashboard", icon: LayoutDashboard },
    { name: "แคมเปญ", href: "/creator/campaigns", icon: BarChart3 },
    { name: "งานของฉัน", href: "/creator/my-work", icon: Package },
  ],
  brand: [
    { name: "ภาพรวม", href: "/brand/dashboard", icon: LayoutDashboard },
    { name: "แคมเปญ", href: "/brand/campaigns", icon: BarChart3 },
    // { name: "รีวิวงาน", href: "/brand/review", icon: Package },
    { name: "สร้างแคมเปญ", href: "/brand/create-campaign", icon: Plus },
  ],
  admin: [
    { name: "ภาพรวม", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "แผงผู้ดูแล", href: "/admin", icon: Shield },
    { name: "แคมเปญ", href: "/admin/campaigns", icon: BarChart3 },
    { name: "ตรวจ KYC", href: "/admin/kyc", icon: CheckCircle2 },
  ],
};

import { useAuthStore } from "@/lib/store/auth-store";

export default function Sidebar({ className }: { className?: string }) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const role = user?.role || "creator";
  const navigation = roleNavigation[role] || roleNavigation.creator;

  const handleLogout = async () => {
    await fetch("/api/auth/set-token", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "bg-white h-screen sticky top-0 flex flex-col transition-all duration-300 border-r border-slate-100 px-6 py-8",
        className,
      )}
    >
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center">
          <Wind className="h-5 w-5 text-brand-purple" />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900">
          Windflu
        </span>
      </div>
      <nav className="space-y-2 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-900",
                  )}
                />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 mt-auto pt-6">
        {user && (
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-slate-900">
                {(user.full_name || user.email || "U")[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 truncate">
                {user.full_name ||
                  user.display_name ||
                  user.company_name ||
                  user.email ||
                  "Anonymous"}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                {user.role === "admin"
                  ? "แอดมิน"
                  : user.role === "brand"
                    ? "แบรนด์"
                    : "Clipper"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 py-3 rounded-2xl transition-all border border-slate-200 active:scale-95 px-4"
        >
          <LogOut className="w-4 h-4" />
          <span>ออกก่อนนะ</span>
        </button>
      </div>
    </aside>
  );
}
