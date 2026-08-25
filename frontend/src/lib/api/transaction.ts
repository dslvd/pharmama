import {
  CreateTransactionPayload,
  GetTrListParams,
  Transaction,
  UpdateTrStatusPayload,
} from "../types/transaction";
import { apiFetch } from "../utils/client";

export const searchtransaction = (query: string) =>
  apiFetch<Transaction[]>(
    `/transaction/search?query=${encodeURIComponent(query)}`,
  );

export const getTransaction = (id: string) =>
  apiFetch<Transaction>(`/transaction/${id}`);

export const getTransactionList = ({
  status,
  order,
  handledBy,
}: GetTrListParams = {}) => {
  const params = new URLSearchParams();
  if (status) params.set("category", status);
  if (handledBy) params.set("category", handledBy);
  if (order) params.set("order", order);

  const query = params.toString();
  return apiFetch<Transaction[]>(`/transaction${query ? `?${query}` : ""}`);
};

export const cancelTransaction = (id: number) =>
  apiFetch<Transaction>(`/transaction/${id}`, {
    method: "PATCH",
  });

export const createTransaction = (data: CreateTransactionPayload) =>
  apiFetch<Transaction>("/transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTransactionStatus = (
  id: number,
  status: UpdateTrStatusPayload,
) =>
  apiFetch<Transaction>(`/transaction/${id}/updateStatus`, {
    method: "PATCH",
    body: JSON.stringify(status),
  });
