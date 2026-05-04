import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, BanknoteArrowUp, ReceiptText, Upload } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/payments")({
  head: () => ({ meta: [{ title: "Rent Payments — RentEase NG" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => { load(); }, []);

  async function load() {
    const [p, t] = await Promise.all([
      supabase.from("payments").select("*, tenants(full_name), properties(name)").order("payment_date", { ascending: false }),
      supabase.from("tenants").select("id, full_name, property_id, rent_amount"),
    ]);
    setRows(p.data ?? []);
    setTenants(t.data ?? []);
  }

  function openNew() {
    setForm({ tenant_id: "", amount_due: 0, amount_paid: 0, method: "bank_transfer", payment_date: new Date().toISOString().slice(0, 10), status: "pending" });
    setOpen(true);
  }

  async function save() {
    const tenant = tenants.find((t) => t.id === form.tenant_id);
    if (!tenant) { toast.error("Select a tenant"); return; }
    const payload: any = {
      tenant_id: form.tenant_id,
      property_id: tenant.property_id,
      amount_due: Number(form.amount_due),
      amount_paid: Number(form.amount_paid),
      method: form.method,
      payment_date: form.payment_date,
      status: form.status,
    };
    const { error } = await supabase.from("payments").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Payment recorded");
    setOpen(false); load();
  }

  async function generateReceipt(p: any) {
    const num = "RNT-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 9000 + 1000);
    const payload: any = {
      receipt_number: num,
      payment_id: p.id,
      tenant_id: p.tenant_id,
      property_id: p.property_id,
      tenant_name: p.tenants?.full_name,
      property_name: p.properties?.name,
      amount: p.amount_paid,
      paid_on: p.payment_date,
      method: p.method,
    };
    const { error } = await supabase.from("receipts").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(`Receipt ${num} generated`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} payments recorded</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Record Payment</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Tenant</Label>
                <Select value={form.tenant_id} onValueChange={(v) => {
                  const tt = tenants.find((x) => x.id === v);
                  setForm({ ...form, tenant_id: v, amount_due: tt?.rent_amount ?? 0 });
                }}>
                  <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                  <SelectContent>{tenants.map((t) => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount due (₦)</Label><Input type="number" value={form.amount_due} onChange={(e) => setForm({ ...form, amount_due: e.target.value })} /></div>
                <div><Label>Amount paid (₦)</Label><Input type="number" value={form.amount_paid} onChange={(e) => setForm({ ...form, amount_paid: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Method</Label>
                  <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Payment date</Label><Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} /></div>
              <div>
                <Label>Proof of payment</Label>
                <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  <Upload className="h-4 w-4" /> Upload coming soon (Paystack/Flutterwave integration)
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No payments yet" icon={BanknoteArrowUp} description="Record rent payments to start tracking collections." />
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.tenants?.full_name ?? "—"}</TableCell>
                    <TableCell>{p.properties?.name ?? "—"}</TableCell>
                    <TableCell>{formatNaira(p.amount_due)}</TableCell>
                    <TableCell>{formatNaira(p.amount_paid)}</TableCell>
                    <TableCell>{formatNaira(p.balance)}</TableCell>
                    <TableCell className="capitalize">{p.method.replace("_", " ")}</TableCell>
                    <TableCell>{formatDate(p.payment_date)}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => generateReceipt(p)}>
                        <ReceiptText className="mr-2 h-3.5 w-3.5" />Receipt
                      </Button>
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
