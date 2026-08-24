import { AuditLog } from "@/lib/types/audit-log";

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-rose-100 text-rose-700",
  CANCEL: "bg-amber-100 text-amber-700",
  STOCK_ADJUSTMENT: "bg-violet-100 text-violet-700",
  RESTORE_STOCK: "bg-teal-100 text-teal-700",
};

export default function AuditRow({ audit }: { audit: AuditLog }) {
  const createdAt = new Date(audit.createdAt);
  const date = createdAt.toLocaleDateString();
  const time = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const actionStyle = ACTION_STYLES[audit.action] ?? "bg-muted text-muted-foreground";

  return (
    <tr className="border-b border-border last:border-0 odd:bg-card even:bg-violet-50/60">
      <td className="px-4 py-3 text-center text-muted-foreground">
        {date}
      </td>
      <td className="px-4 py-3 text-center text-muted-foreground">
        {time}
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${actionStyle}`}>
          {audit.action}
        </span>
      </td>
      <td className="px-4 py-3 text-foreground">
        {audit.entity}
      </td>
      <td className="px-4 py-3 text-center text-muted-foreground">
        {audit.changes
          ? `${displayValue(audit.changes.old)} → ${displayValue(audit.changes.new)}`
          : "—"}
      </td>
    </tr>
  );
}

function displayValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") {
    if ("name" in val) return String((val as { name: unknown }).name);
    return JSON.stringify(val);
  }
  return String(val);
}