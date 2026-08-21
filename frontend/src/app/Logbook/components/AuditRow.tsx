import { AuditLog } from "@/lib/types/audit-log";

export default function AuditRow({ audit }: { audit: AuditLog }) {
  return <div className="grid grid-cols">{audit.action}</div>;
}
