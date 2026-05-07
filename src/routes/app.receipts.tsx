import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ReceiptText, Download, Send } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/receipts")({
  head: () => ({ meta: [{ title: "Receipts — PayPadi" }] }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { (async () => {
    const { data } = await supabase.from("receipts").select("*").order("paid_on", { ascending: false });
    setRows(data ?? []);
  })(); }, []);

  const filtered = rows.filter((r) =>
    r.receipt_number.toLowerCase().includes(q.toLowerCase()) ||
    (r.tenant_name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by receipt # or tenant..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardContent>
      </Card>
      {filtered.length === 0 ? (
        <EmptyState title="No receipts yet" icon={ReceiptText} description="Receipts will appear here once you record payments." />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt #</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-sm font-medium">{r.receipt_number}</TableCell>
                    <TableCell>{r.tenant_name}</TableCell>
                    <TableCell>{r.property_name}</TableCell>
                    <TableCell className="font-medium">{formatNaira(r.amount)}</TableCell>
                    <TableCell>{formatDate(r.paid_on)}</TableCell>
                    <TableCell className="capitalize">{r.method.replace("_", " ")}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.success("Receipt download (PDF coming soon)")}>
                          <Download className="mr-2 h-3.5 w-3.5" />Download
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success("Receipt sent (email/WhatsApp placeholder)")}>
                          <Send className="mr-2 h-3.5 w-3.5" />Send
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
