import { apiFetch } from "../utils/client";
import { SortOrder } from "./product";

interface AuditLog {
  id: number;
  action: AuditAction;
  entity: AuditEntity;
  entityId: number;
  changes: JSON;
  createdAt: Date;
}

type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "CANCEL"
  | "STOCK_ADJUSTMENT"
  | "RESTORE_STOCK";

type AuditEntity = "TRANSACTION" | "PRODUCT" | "STOCK" | "TRANSACTIONITEM";

export const getAuditList = ({ entity, action, order }: GetAuditListParams) => {
  const params = new URLSearchParams();
  if (entity) params.set("category", entity);
  if (action) params.set("category", action);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<AuditLog[]>(`/audit-log${query ? `?${query}` : ""}`);
};

interface GetAuditListParams {
  entity?: AuditEntity;
  action?: AuditAction;
  order?: SortOrder;
}
