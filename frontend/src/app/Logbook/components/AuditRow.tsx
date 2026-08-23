import { AuditLog } from "@/lib/types/audit-log";

export default function AuditRow({ audit }: { audit: AuditLog }) {
  const createdAt = new Date(audit.createdAt);
  const date = createdAt.toLocaleDateString();
  const time = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <tr className="odd:bg-white even:bg-violet-50">
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {audit.id}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {date}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {time}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
        {audit.action}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm">
        {audit.entity}
      </td>
      <td className="border border-slate-300 px-3 py-2 text-sm text-center">
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
