import { Card } from "@/components/dashboard/Card";
import {
  BarChart3,
  Users,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Welcome back! Here's an overview of your platform's performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm">Create Project</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Revenue"
          value="$128,430.20"
          description="+12.5% vs last month"
          icon={DollarSign}
          trend="up"
        />
        <Card
          title="Active Users"
          value="24,532"
          description="+18.2% vs last month"
          icon={Users}
          trend="up"
        />
        <Card
          title="New Sales"
          value="+573"
          description="+4.1% vs last month"
          icon={CreditCard}
          trend="up"
        />
        <Card
          title="Churn Rate"
          value="2.4%"
          description="-0.8% vs last month"
          icon={Activity}
          trend="down"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-4 rounded-3xl border border-zinc-200/60 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                Revenue Growth
              </h3>
              <p className="text-xs text-zinc-500">
                Monthly overview of your revenue
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              2024 Analysis
            </Badge>
          </div>
          <div className="h-[350px] w-full bg-zinc-50 rounded-2xl flex items-end justify-around p-6 overflow-hidden">
            {[40, 70, 45, 90, 65, 80, 50, 85, 60, 95, 75, 100].map((h, i) => (
              <div
                key={i}
                className="w-full max-w-[20px] bg-zinc-900 rounded-t-lg transition-all duration-1000 ease-out hover:bg-zinc-700"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="col-span-full lg:col-span-3 rounded-3xl border border-zinc-200/60 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                Recent Transactions
              </h3>
              <p className="text-xs text-zinc-500">
                Latest successful payments
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-zinc-400" />
          </div>
          <div className="space-y-6">
            {[
              {
                name: "John Doe",
                email: "john@example.com",
                amount: "+$250.00",
                status: "success",
              },
              {
                name: "Sarah Smith",
                email: "sarah@design.co",
                amount: "+$120.00",
                status: "success",
              },
              {
                name: "Alex Rivera",
                email: "alex@tech.io",
                amount: "+$450.00",
                status: "success",
              },
              {
                name: "Elena Gilbert",
                email: "elena@mystic.com",
                amount: "+$89.00",
                status: "success",
              },
              {
                name: "Damon Salv",
                email: "damon@vamp.net",
                amount: "+$299.00",
                status: "success",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between group cursor-pointer p-1 rounded-xl transition-colors hover:bg-zinc-50"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-zinc-500">{t.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900">{t.amount}</p>
                  <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                    Completed
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
