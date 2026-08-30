export interface AuditChange {
  old: string | number | null;
  new: string | number | null;
}

export interface AuditLog {
  id: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: number;
  changes?: AuditChange;
  createdAt: Date;
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
  | "TRANSACTIONITEM";
