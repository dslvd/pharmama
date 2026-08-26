import { AuditLog, GetAuditListParams } from "../types/audit-log";
import { apiFetch } from "../utils/client";

export const getAuditList = ({ entity, action, order }: GetAuditListParams) => {
  const params = new URLSearchParams();
  if (entity) params.set("entity", entity);
  if (action) params.set("action", action);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<AuditLog[]>(`/audit-log${query ? `?${query}` : ""}`);
};

export const searchAudit = (query: string) => {
  return apiFetch<AuditLog[]>(
    `/audit-log/search?query=${encodeURIComponent(query)}`,
  );
};
