import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Wrench } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/maintenance")({
  head: () => ({ meta: [{ title: "Maintenance — PayPadi" }] }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ type: "plumbing", priority: "medium", status: "open" });

  useEffect(() => { load(); }, []);
  async function load() {
    const [m, t] = await Promise.all([
      supabase.from("maintenance_requests").select("*, properties(name)").order("created_at", { ascending: false }),
      supabase.from("tenants").select("id, full_name, property_id, unit_label"),
    ]);
    setRows(m.data ?? []);
    setTenants(t.data ?? []);
  }

  async function save() {
    const tenant = tenants.find((t) => t.id === form.tenant_id);
    if (!tenant || !form.description) { toast.error("Tenant and description are required"); return; }
    const payload: any = {
      tenant_id: tenant.id,
      tenant_name: tenant.full_name,
      property_id: tenant.property_id,
      unit_label: tenant.unit_label,
      type: form.type, description: form.description,
      priority: form.priority, status: form.status,
    };
    const { error } = await supabase.from("maintenance_requests").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success("Request submitted");
    setOpen(false); setForm({ type: "plumbing", priority: "medium", status: "open" }); load();
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("maintenance_requests").update({ status: status as any }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Status updated"); load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} requests</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Request</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Maintenance Request</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Tenant</Label>
                <Select value={form.tenant_id ?? ""} onValueChange={(v) => setForm({ ...form, tenant_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select tenant" /></SelectTrigger>
                  <SelectContent>{tenants.map((t) => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["plumbing", "electrical", "security", "cleaning", "structural", "other"].map((x) =>
                        <SelectItem key={x} value={x} className="capitalize">{x}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Description</Label><Textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No requests yet" icon={Wrench} description="Maintenance requests will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rows.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold capitalize">{r.type}</h3>
                      <StatusBadge status={r.priority} />
                    </div>
                    <p className="text-xs text-muted-foreground">{r.tenant_name} · {r.properties?.name} · {r.unit_label}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-3 text-sm">{r.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(r.created_at)}</span>
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                    <SelectTrigger className="h-8 w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
