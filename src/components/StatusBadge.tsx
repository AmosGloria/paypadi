import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status =
  | "paid" | "pending" | "overdue" | "partial"
  | "occupied" | "vacant" | "under_maintenance"
  | "open" | "in_progress" | "resolved"
  | "low" | "medium" | "high";

const MAP: Record<Status, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  overdue: { label: "Overdue", className: "bg-destructive/15 text-destructive border-destructive/30" },
  partial: { label: "Partial", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  occupied: { label: "Occupied", className: "bg-success/15 text-success border-success/30" },
  vacant: { label: "Vacant", className: "bg-muted text-muted-foreground border-border" },
  under_maintenance: { label: "Maintenance", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  open: { label: "Open", className: "bg-destructive/15 text-destructive border-destructive/30" },
  in_progress: { label: "In progress", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  resolved: { label: "Resolved", className: "bg-success/15 text-success border-success/30" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
  medium: { label: "Medium", className: "bg-warning/15 text-warning-foreground border-warning/40" },
  high: { label: "High", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = MAP[status as Status];
  if (!s) return <Badge variant="outline">{status}</Badge>;
  return <Badge variant="outline" className={cn("font-medium", s.className)}>{s.label}</Badge>;
}
