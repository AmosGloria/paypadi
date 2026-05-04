import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/format";

export const Route = createFileRoute("/app/reports")({
  head: () => ({ meta: [{ title: "Reports — RentEase NG" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => { (async () => {
    const [pay, props, maint, tenants] = await Promise.all([
      supabase.from("payments").select("amount_due, amount_paid, status, property_id"),
      supabase.from("properties").select("id, name, status"),
      supabase.from("maintenance_requests").select("cost"),
      supabase.from("tenants").select("full_name, payment_status, rent_amount"),
    ]);
    const totalCollected = (pay.data ?? []).reduce((a, p) => a + Number(p.amount_paid), 0);
    const outstanding = (pay.data ?? []).reduce((a, p) => a + (Number(p.amount_due) - Number(p.amount_paid)), 0);
    const occupied = (props.data ?? []).filter((p) => p.status === "occupied").length;
    const rate = (props.data ?? []).length ? (occupied / (props.data ?? []).length) * 100 : 0;
    const maintCost = (maint.data ?? []).reduce((a, m) => a + Number(m.cost ?? 0), 0);
    const debt = (tenants.data ?? []).filter((t) => t.payment_status === "overdue" || t.payment_status === "partial");

    // per-property
    const perProp: Record<string, number> = {};
    (pay.data ?? []).forEach((p: any) => { if (p.property_id) perProp[p.property_id] = (perProp[p.property_id] ?? 0) + Number(p.amount_paid); });
    const propertyPerf = (props.data ?? []).map((p: any) => ({ name: p.name, total: perProp[p.id] ?? 0 }));

    setData({ totalCollected, outstanding, rate, maintCost, debt, propertyPerf });
  })(); }, []);

  if (!data) return <div className="text-muted-foreground">Loading reports...</div>;

  const stats = [
    { label: "Total Rent Collected", value: formatNaira(data.totalCollected) },
    { label: "Outstanding Rent", value: formatNaira(data.outstanding) },
    { label: "Occupancy Rate", value: data.rate.toFixed(1) + "%" },
    { label: "Maintenance Cost", value: formatNaira(data.maintCost) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Property Performance</CardTitle></CardHeader>
          <CardContent>
            {data.propertyPerf.length === 0 ? <p className="text-sm text-muted-foreground">No data</p> : (
              <ul className="divide-y">
                {data.propertyPerf.map((p: any, i: number) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-sm font-semibold">{formatNaira(p.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tenant Debt Report</CardTitle></CardHeader>
          <CardContent>
            {data.debt.length === 0 ? <p className="text-sm text-muted-foreground">No outstanding debts.</p> : (
              <ul className="divide-y">
                {data.debt.map((t: any, i: number) => (
                  <li key={i} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium">{t.full_name}</div>
                      <div className="text-xs capitalize text-muted-foreground">{t.payment_status}</div>
                    </div>
                    <span className="text-sm font-semibold text-destructive">{formatNaira(t.rent_amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Agent Performance</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Agent commission tracking will appear once agents are linked to properties and payments are recorded against them.</p>
        </CardContent>
      </Card>
    </div>
  );
}
