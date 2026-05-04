import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatNaira } from "@/lib/format";
import {
  Building2, Users, BanknoteArrowUp, AlertCircle, Wrench, CalendarClock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — RentEase NG" }] }),
  component: DashboardPage,
});

interface Stats {
  properties: number;
  tenants: number;
  collectedThisMonth: number;
  overdueAmount: number;
  pendingMaintenance: number;
  expiringLeases: number;
  monthly: { month: string; amount: number }[];
  occupancy: { name: string; value: number }[];
  maintenance: { name: string; value: number }[];
}

function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const [props, tenants, payments, maint, leases] = await Promise.all([
      supabase.from("properties").select("id,status"),
      supabase.from("tenants").select("id"),
      supabase.from("payments").select("amount_paid,amount_due,payment_date,status"),
      supabase.from("maintenance_requests").select("status"),
      supabase.from("lease_reminders").select("lease_end"),
    ]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const collectedThisMonth = (payments.data ?? [])
      .filter((p) => new Date(p.payment_date) >= monthStart)
      .reduce((a, p) => a + Number(p.amount_paid), 0);

    const overdueAmount = (payments.data ?? [])
      .filter((p) => p.status === "overdue" || p.status === "partial")
      .reduce((a, p) => a + (Number(p.amount_due) - Number(p.amount_paid)), 0);

    // Monthly chart - last 6 months
    const monthly: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const amount = (payments.data ?? [])
        .filter((p) => {
          const pd = new Date(p.payment_date);
          return pd >= d && pd < next;
        })
        .reduce((a, p) => a + Number(p.amount_paid), 0);
      monthly.push({ month: d.toLocaleDateString("en", { month: "short" }), amount });
    }

    const occMap: Record<string, number> = {};
    (props.data ?? []).forEach((p) => { occMap[p.status] = (occMap[p.status] ?? 0) + 1; });
    const occupancy = Object.entries(occMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v }));

    const mMap: Record<string, number> = {};
    (maint.data ?? []).forEach((m) => { mMap[m.status] = (mMap[m.status] ?? 0) + 1; });
    const maintenance = Object.entries(mMap).map(([k, v]) => ({ name: k.replace("_", " "), value: v }));

    const expiring = (leases.data ?? []).filter((l) => {
      const days = (new Date(l.lease_end).getTime() - now.getTime()) / 86400000;
      return days <= 90 && days >= 0;
    }).length;

    setS({
      properties: props.data?.length ?? 0,
      tenants: tenants.data?.length ?? 0,
      collectedThisMonth,
      overdueAmount,
      pendingMaintenance: (maint.data ?? []).filter((m) => m.status !== "resolved").length,
      expiringLeases: expiring,
      monthly,
      occupancy,
      maintenance,
    });
  }

  if (!s) return <div className="text-muted-foreground">Loading dashboard...</div>;

  const cards = [
    { label: "Total Properties", value: s.properties, icon: Building2, tone: "text-primary" },
    { label: "Total Tenants", value: s.tenants, icon: Users, tone: "text-primary" },
    { label: "Collected This Month", value: formatNaira(s.collectedThisMonth), icon: BanknoteArrowUp, tone: "text-success" },
    { label: "Overdue Rent", value: formatNaira(s.overdueAmount), icon: AlertCircle, tone: "text-destructive" },
    { label: "Pending Maintenance", value: s.pendingMaintenance, icon: Wrench, tone: "text-warning-foreground" },
    { label: "Leases Expiring Soon", value: s.expiringLeases, icon: CalendarClock, tone: "text-primary-glow" },
  ];

  const COLORS = ["hsl(280 60% 30%)", "hsl(150 50% 45%)", "hsl(40 80% 55%)", "hsl(0 70% 55%)", "hsl(220 50% 50%)"];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-2xl font-bold">{c.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg bg-accent ${c.tone}`}>
                <c.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Monthly Rent Collection</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.monthly}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => "₦" + (v / 1000).toFixed(0) + "k"} />
                <Tooltip formatter={(v: number) => formatNaira(v)} />
                <Bar dataKey="amount" fill="oklch(0.42 0.18 290)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Occupancy</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={s.occupancy} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {s.occupancy.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Maintenance Status</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={s.maintenance} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="oklch(0.55 0.20 290)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
