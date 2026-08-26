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
  const actionStyle =
    ACTION_STYLES[audit.action] ?? "bg-muted text-muted-foreground";

  return (
    <tr className="border-b border-border last:border-0 odd:bg-card even:bg-violet-50/60">
      <td className="px-4 py-3 text-center text-muted-foreground">{date}</td>
      <td className="px-4 py-3 text-center text-muted-foreground">{time}</td>
      <td className="px-4 py-3 text-center text-muted-foreground">
        {audit.entityId}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${actionStyle}`}
        >
          {audit.action}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-foreground">{audit.entity}</td>
      <td className="px-4 py-3 text-center text-muted-foreground">
        {audit.changes
          ? formatChanges(audit.changes.old, audit.changes.new)
          : "—"}
      </td>
    </tr>
  );
}

function formatChanges(oldVal: unknown, newVal: unknown): string {
  if (oldVal === null || oldVal === undefined) return "—";

  if (
    typeof oldVal === "object" &&
    typeof newVal === "object" &&
    oldVal !== null &&
    newVal !== null
  ) {
    const oldObj = oldVal as Record<string, unknown>;
    const newObj = newVal as Record<string, unknown>;
    const changedKeys = Object.keys(newObj).filter(
      (key) => JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key]),
    );

    if (changedKeys.length === 0) return "No changes";

    return changedKeys
      .map(
        (key) =>
          `${formatFieldName(key)}: ${displayValue(oldObj[key])} → ${displayValue(newObj[key])}`,
      )
      .join(", ");
  }

  return `${displayValue(oldVal)} → ${displayValue(newVal)}`;
}

function formatFieldName(key: string): string {
  // camelCase -> "Camel Case"
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function displayValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (val instanceof Date) return val.toLocaleDateString();
  if (typeof val === "string") {
    // catch ISO date strings and format them nicely
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      return parsed.toLocaleDateString();
    }
    return val;
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if ("name" in obj) return String(obj.name);
    return JSON.stringify(obj);
  }
  return String(val);
}
