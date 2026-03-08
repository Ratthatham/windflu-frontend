"use client";

import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Package,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/dashboard/users", icon: Users },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-zinc-200/60 bg-white/50 backdrop-blur-xl p-6 md:block hidden h-screen sticky top-0">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200">
          <Package className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-zinc-900">
          NexaSaaS
        </span>
      </div>
      <nav className="space-y-1.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-zinc-900 text-white shadow-md shadow-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    isActive
                      ? "text-white"
                      : "text-zinc-400 group-hover:text-zinc-900",
                  )}
                />
                {item.name}
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-6 right-6">
        <div className="rounded-2xl bg-zinc-900 p-4 shadow-xl">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Pro Plan
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Upgrade for more features
          </p>
          <button className="mt-3 w-full rounded-lg bg-white py-2 text-xs font-bold text-zinc-900 hover:bg-zinc-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
