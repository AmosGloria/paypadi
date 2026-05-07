import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Send } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { formatDate, daysUntil } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/leases")({
  head: () => ({ meta: [{ title: "Lease Reminders — PayPadi" }] }),
  component: LeasesPage,
});

function LeasesPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => { (async () => {
    const { data } = await supabase
      .from("tenants")
      .select("id, full_name, lease_end, property_id, properties(name)")
      .not("lease_end", "is", null)
      .order("lease_end", { ascending: true });
    setRows(data ?? []);
  })(); }, []);

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{rows.length} active leases</p>
      {rows.length === 0 ? (
        <EmptyState title="No leases tracked" icon={CalendarClock} />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Days Remaining</TableHead>
                  <TableHead>Renewal Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => {
                  const days = daysUntil(t.lease_end);
                  const tone = days < 0 ? "destructive" : days <= 30 ? "warning" : days <= 90 ? "default" : "secondary";
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.full_name}</TableCell>
                      <TableCell>{t.properties?.name ?? "—"}</TableCell>
                      <TableCell>{formatDate(t.lease_end)}</TableCell>
                      <TableCell>
                        <Badge variant={tone === "destructive" ? "destructive" : "outline"}>
                          {days < 0 ? `Expired ${-days}d ago` : `${days} days`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{days <= 0 ? "Action needed" : "Pending"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toast.success("Reminder sent (placeholder)")}>
                          <Send className="mr-2 h-3.5 w-3.5" />Send Reminder
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
