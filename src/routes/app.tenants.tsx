import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Users, Trash2, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira, formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/tenants")({
  head: () => ({ meta: [{ title: "Tenants — PayPadi" }] }),
  component: TenantsPage,
});

interface Tenant {
  id: string; full_name: string; phone: string | null; email: string | null;
  property_id: string | null; unit_label: string | null; rent_amount: number;
  rent_cycle: string; lease_start: string | null; lease_end: string | null;
  caution_fee: number; payment_status: string; emergency_contact: string | null;
}
interface PropOpt { id: string; name: string; }

function TenantsPage() {
  const [items, setItems] = useState<Tenant[]>([]);
  const [props, setProps] = useState<PropOpt[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => { load(); }, []);

  async function load() {
    const [t, p] = await Promise.all([
      supabase.from("tenants").select("*").order("created_at", { ascending: false }),
      supabase.from("properties").select("id,name"),
    ]);
    setItems((t.data ?? []) as Tenant[]);
    setProps(p.data ?? []);
  }

  function openNew() {
    setEditing(null);
    setForm({
      full_name: "", phone: "", email: "", property_id: null, unit_label: "",
      rent_amount: 0, rent_cycle: "yearly", lease_start: "", lease_end: "",
      caution_fee: 0, payment_status: "pending", emergency_contact: "",
    });
    setOpen(true);
  }
  function openEdit(t: Tenant) { setEditing(t); setForm({ ...t }); setOpen(true); }

  async function save() {
    if (!form.full_name) { toast.error("Name is required"); return; }
    const payload = {
      ...form,
      rent_amount: Number(form.rent_amount),
      caution_fee: Number(form.caution_fee),
      property_id: form.property_id || null,
      lease_start: form.lease_start || null,
      lease_end: form.lease_end || null,
    };
    const { error } = editing
      ? await supabase.from("tenants").update(payload as any).eq("id", editing.id)
      : await supabase.from("tenants").insert(payload as any);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Tenant updated" : "Tenant added");
    setOpen(false); load();
  }
  async function remove(id: string) {
    const { error } = await supabase.from("tenants").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Tenant removed"); load();
  }

  const filtered = items.filter((t) => {
    const ok = filter === "all" || t.payment_status === filter;
    const m = q.toLowerCase();
    return ok && (t.full_name.toLowerCase().includes(m) || (t.email ?? "").toLowerCase().includes(m));
  });

  const propName = (id: string | null) => props.find((p) => p.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{items.length} total tenants</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Tenant</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit Tenant" : "Add Tenant"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Full name</Label><Input value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div>
                <Label>Property</Label>
                <Select value={form.property_id ?? ""} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{props.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Unit</Label><Input value={form.unit_label ?? ""} onChange={(e) => setForm({ ...form, unit_label: e.target.value })} /></div>
              <div><Label>Rent amount (₦)</Label><Input type="number" value={form.rent_amount ?? 0} onChange={(e) => setForm({ ...form, rent_amount: Number(e.target.value) })} /></div>
              <div>
                <Label>Rent cycle</Label>
                <Select value={form.rent_cycle} onValueChange={(v) => setForm({ ...form, rent_cycle: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Caution fee (₦)</Label><Input type="number" value={form.caution_fee ?? 0} onChange={(e) => setForm({ ...form, caution_fee: Number(e.target.value) })} /></div>
              <div><Label>Lease start</Label><Input type="date" value={form.lease_start ?? ""} onChange={(e) => setForm({ ...form, lease_start: e.target.value })} /></div>
              <div><Label>Lease end</Label><Input type="date" value={form.lease_end ?? ""} onChange={(e) => setForm({ ...form, lease_end: e.target.value })} /></div>
              <div>
                <Label>Payment status</Label>
                <Select value={form.payment_status} onValueChange={(v) => setForm({ ...form, payment_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2"><Label>Emergency contact</Label><Input value={form.emergency_contact ?? ""} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search tenants..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No tenants yet" description="Add tenants to start tracking rent." icon={Users} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Cycle</TableHead>
                    <TableHead>Lease End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.full_name}</div>
                        <div className="text-xs text-muted-foreground">{t.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div>{propName(t.property_id)}</div>
                        <div className="text-xs text-muted-foreground">{t.unit_label}</div>
                      </TableCell>
                      <TableCell className="font-medium">{formatNaira(t.rent_amount)}</TableCell>
                      <TableCell className="capitalize">{t.rent_cycle}</TableCell>
                      <TableCell>{formatDate(t.lease_end)}</TableCell>
                      <TableCell><StatusBadge status={t.payment_status} /></TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove tenant?</AlertDialogTitle>
                                <AlertDialogDescription>This will also remove related payment records.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => remove(t.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
