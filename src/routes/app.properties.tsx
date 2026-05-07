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
import { Plus, Search, Building2, Trash2, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/properties")({
  head: () => ({ meta: [{ title: "Properties — PayPadi" }] }),
  component: PropertiesPage,
});

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  landlord_name: string | null;
  agent_name: string | null;
  service_charge: number;
  status: string;
}

const TYPES = ["apartment", "duplex", "self_contained", "shop", "office", "warehouse"];
const STATUSES = ["occupied", "vacant", "under_maintenance"];

function PropertiesPage() {
  const [items, setItems] = useState<Property[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState({
    name: "", address: "", type: "apartment", units: 1,
    landlord_name: "", agent_name: "", service_charge: 0, status: "vacant",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Property[]);
  }

  function openNew() {
    setEditing(null);
    setForm({ name: "", address: "", type: "apartment", units: 1, landlord_name: "", agent_name: "", service_charge: 0, status: "vacant" });
    setOpen(true);
  }

  function openEdit(p: Property) {
    setEditing(p);
    setForm({
      name: p.name, address: p.address, type: p.type, units: p.units,
      landlord_name: p.landlord_name ?? "", agent_name: p.agent_name ?? "",
      service_charge: p.service_charge, status: p.status,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name || !form.address) { toast.error("Name and address are required"); return; }
    const payload = { ...form, units: Number(form.units), service_charge: Number(form.service_charge) };
    const { error } = editing
      ? await supabase.from("properties").update(payload as any).eq("id", editing.id)
      : await supabase.from("properties").insert(payload as any);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Property updated" : "Property added");
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Property deleted");
    load();
  }

  const filtered = items.filter((p) => {
    const ok = filter === "all" || p.status === filter;
    const m = q.toLowerCase();
    return ok && (p.name.toLowerCase().includes(m) || p.address.toLowerCase().includes(m));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{items.length} total properties</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Property" : "Add Property"}</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div><Label>Property name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Units</Label><Input type="number" min={1} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Landlord</Label><Input value={form.landlord_name} onChange={(e) => setForm({ ...form, landlord_name: e.target.value })} /></div>
                <div><Label>Agent</Label><Input value={form.agent_name} onChange={(e) => setForm({ ...form, agent_name: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Service charge (₦)</Label><Input type="number" value={form.service_charge} onChange={(e) => setForm({ ...form, service_charge: Number(e.target.value) })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
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
            <Input className="pl-9" placeholder="Search properties..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No properties yet" description="Add your first property to get started." icon={Building2} action={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Property</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary"><Building2 className="h-5 w-5" /></div>
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.type.replace("_", " ")} · {p.units} units</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.address}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Landlord:</span> <span className="font-medium">{p.landlord_name ?? "—"}</span></div>
                  <div><span className="text-muted-foreground">Agent:</span> <span className="font-medium">{p.agent_name ?? "—"}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Service charge:</span> <span className="font-medium">{formatNaira(p.service_charge)}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="mr-2 h-3.5 w-3.5" />Edit</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => remove(p.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
