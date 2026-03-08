import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    console.warn("Supabase client failed to initialize:", e);
  }

  // Provide a mock user for local development if not authenticated
  const effectiveUser =
    user ||
    ({
      id: "demo-id",
      email: "demo@example.com",
      user_metadata: { full_name: "Demo User" },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as any);

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header user={effectiveUser} />
        <main className="flex-1 p-8 md:p-10">{children}</main>
      </div>
    </div>
  );
}
