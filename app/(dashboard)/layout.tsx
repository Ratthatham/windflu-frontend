import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 relative items-stretch">
        <MobileNav />
        <Sidebar className="hidden md:flex shrink-0 w-72 sticky top-0 h-screen border-r border-slate-200" />
        <div className="flex flex-1 flex-col relative z-10 overflow-hidden">
          <main className="flex-1 p-4 md:p-10 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
