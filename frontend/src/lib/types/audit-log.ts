import { User } from "./users";

// changed fields before/after, e.g. { old: { quantity: 5 }, new: { quantity: 3 } }
export interface AuditChange {
  old: Record<string, unknown> | null;
  new: Record<string, unknown> | null;
}

export interface AuditLog {
  id: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: number;
  changes?: AuditChange;
  createdAt: Date;
  user: User;
}

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CANCEL"
  | "STOCK_ADJUSTMENT"
  | "RESTORE_STOCK";

export type AuditEntity =
  | "TRANSACTION"
  | "PRODUCT"
  | "STOCK"
  | "TRANSACTIONITEM"
  | "USER";
