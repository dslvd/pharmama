import { AuditLog } from "@/lib/types/audit-log";
import { formatDate, formatTime, titleCase } from "@/lib/utils/format";
import { Badge, Td, Tr } from "@/components/ui/table";

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-success-soft text-success",
  UPDATE: "bg-info-soft text-info",
  DELETE: "bg-danger-soft text-danger",
  CANCEL: "bg-warning-soft text-warning",
  STOCK_ADJUSTMENT: "bg-primary-soft text-primary",
  RESTORE_STOCK: "bg-success-soft text-success",
};

const ENTITY_LABELS: Record<string, string> = {
  TRANSACTIONITEM: "Transaction item",
};

export default function AuditRow({ audit }: { audit: AuditLog }) {
  const actionStyle =
    ACTION_STYLES[audit.action] ?? "bg-muted text-muted-foreground";
  const changes = audit.changes
    ? formatChanges(audit.changes.old, audit.changes.new)
    : [];

  return (
    <Tr className="align-top">
      <Td className="whitespace-nowrap">
        <p>{formatDate(audit.createdAt)}</p>
        <p className="text-xs text-muted-foreground">
          {formatTime(audit.createdAt)}
        </p>
      </Td>
      <Td>
        <p className="font-medium">{audit.user?.name ?? "—"}</p>
        <p className="text-xs text-muted-foreground">
          {audit.user ? titleCase(audit.user.role) : ""}
        </p>
      </Td>
      <Td>
        <Badge className={actionStyle}>{titleCase(audit.action)}</Badge>
      </Td>
      <Td className="whitespace-nowrap">
        <p>{ENTITY_LABELS[audit.entity] ?? titleCase(audit.entity)}</p>
        <p className="font-mono text-xs text-muted-foreground">
          #{audit.entityId}
        </p>
      </Td>
      <Td className="text-muted-foreground">
        {changes.length === 0 ? (
          "—"
        ) : (
          <ul className="space-y-0.5 text-xs">
            {changes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </Td>
    </Tr>
  );
}

// one "Field: old → new" line per changed field
function formatChanges(oldVal: unknown, newVal: unknown): string[] {
  if (oldVal === null || oldVal === undefined) return [];

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

    if (changedKeys.length === 0) return ["No changes"];

    return changedKeys.map(
      (key) =>
        `${formatFieldName(key)}: ${displayValue(oldObj[key])} → ${displayValue(newObj[key])}`,
    );
  }

  return [`${displayValue(oldVal)} → ${displayValue(newVal)}`];
}

function formatFieldName(key: string): string {
  // camelCase -> "Camel Case"
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function displayValue(val: unknown): string {
  if (val === null || val === undefined) return "—";
  if (val instanceof Date) return formatDate(val);
  if (typeof val === "string") {
    // catch ISO date strings and format them nicely
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime()) && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
      return formatDate(parsed);
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
