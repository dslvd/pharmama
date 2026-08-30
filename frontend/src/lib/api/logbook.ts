import { AuditLog } from "../types/audit-log";
import { apiFetch } from "../utils/client";

export const getAuditList = (_params?: Record<string, unknown>) => {
  return apiFetch<AuditLog[]>(`/audit-log`);
};
