import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — PayPadi" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, roles } = useAuth();
  const [profile, setProfile] = useState<any>({ full_name: "", phone: "", company_name: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [user]);

  async function save() {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name,
      phone: profile.phone,
      company_name: profile.company_name,
    }).eq("id", user.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Full name</Label><Input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
          <div><Label>Company / Agency</Label><Input value={profile.company_name ?? ""} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} /></div>
          <div><Label>Phone</Label><Input value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
          <Button onClick={save}>Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Role & Permissions</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Your current role(s):</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {roles.length ? roles.map((r) => <span key={r} className="rounded-full bg-accent px-3 py-1 text-sm font-medium capitalize">{r.replace("_", " ")}</span>) : <span className="text-sm text-muted-foreground">No role assigned</span>}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Role permissions are enforced server-side based on your account type.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">Paystack</div>
              <div className="text-xs text-muted-foreground">Coming soon</div>
            </div>
            <Switch disabled />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">Flutterwave</div>
              <div className="text-xs text-muted-foreground">Coming soon</div>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            { k: "rent", l: "Rent reminders" },
            { k: "receipt", l: "Receipt sent confirmations" },
            { k: "lease", l: "Lease expiry reminders" },
            { k: "maintenance", l: "Maintenance updates" },
          ].map((x) => (
            <div key={x.k} className="flex items-center justify-between rounded-md border p-3">
              <div className="font-medium">{x.l}</div>
              <Switch defaultChecked />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Email and WhatsApp delivery coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
