"use client";

import React, { useState, useEffect } from "react";
import { Menu, Wind, LogOut, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  User,
  Shield,
  Plus,
  CheckCircle2,
} from "lucide-react";

const roleNavigation: Record<
  string,
  { name: string; href: string; icon: any }[]
> = {
  creator: [
    { name: "ภาพรวม", href: "/creator/dashboard", icon: LayoutDashboard },
    { name: "แคมเปญ", href: "/creator/campaigns", icon: BarChart3 },
    { name: "งานของฉัน", href: "/creator/my-work", icon: Package },
    { name: "โปรไฟล์", href: "/creator/profile", icon: User },
    { name: "ยืนยันตัวตน", href: "/creator/kyc", icon: Shield },
  ],
  brand: [
    { name: "ภาพรวม", href: "/brand/dashboard", icon: LayoutDashboard },
    { name: "แคมเปญ", href: "/brand/campaigns", icon: BarChart3 },
    { name: "สร้างแคมเปญ", href: "/brand/create-campaign", icon: Plus },
  ],
  admin: [
    { name: "ภาพรวม", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "แผงผู้ดูแล", href: "/admin", icon: Shield },
    { name: "แคมเปญ", href: "/admin/campaigns", icon: BarChart3 },
    { name: "ตรวจ KYC", href: "/admin/kyc", icon: CheckCircle2 },
  ],
};

export default function MobileNav() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const role = user?.role || "creator";
  const navigation = roleNavigation[role] || roleNavigation.creator;

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await fetch("/api/auth/set-token", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-white shadow-lg shadow-black/5 flex items-center justify-center border border-slate-50">
          <Wind className="h-4 w-4 text-brand-purple" />
        </div>
        <span className="text-lg font-black tracking-tight text-slate-900">
          Windflu
        </span>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[60]"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[300px] bg-white z-[70] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex flex-col h-full py-8 px-6">
                <div className="mb-10 flex items-center justify-between px-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-black/5 flex items-center justify-center border border-slate-50">
                      <Wind className="h-5 w-5 text-brand-purple" />
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      Windflu
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2 flex-1 overflow-y-auto">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300",
                          isActive
                            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
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
                        {isActive && (
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="border-t border-slate-100 mt-auto pt-6 bg-white">
                  {user && (
                    <div className="flex items-center gap-3 mb-6 px-1">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-black text-slate-900">
                            {(user.fullName ||
                              user.displayName ||
                              user.email ||
                              "U")[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {user.fullName || user.displayName || user.email}
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">
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
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 py-4 rounded-2xl transition-all border border-slate-100 active:scale-95 shadow-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
