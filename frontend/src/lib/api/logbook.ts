import { AuditLog } from "../types/audit-log";
import { apiFetch } from "../utils/client";

export const getAuditList = () => {
  return apiFetch<AuditLog[]>(`/audit-log`);
};
