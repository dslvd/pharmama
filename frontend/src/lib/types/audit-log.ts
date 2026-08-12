import { SortOrder } from "./product";

export interface AuditLog {
  id: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: number;
  changes: JSON;
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

export interface GetAuditListParams {
  entity?: AuditEntity;
  action?: AuditAction;
  order?: SortOrder;
}
