export function formatNaira(n: number | null | undefined): string {
  const v = Number(n ?? 0);
  return "₦" + v.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

export function daysUntil(date: string | Date | null | undefined): number {
  if (!date) return 0;
  const target = typeof date === "string" ? new Date(date) : date;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
