import {
  CreateTransactionPayload,
  GetTrListParams,
  Transaction,
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

export const getTodaySales = () =>
  apiFetch<{ total: number; date: string }>("/transaction/getTodaySales");

export const cancelTransaction = (id: number) =>
  apiFetch<Transaction>(`/transaction/${id}`, {
    method: "DELETE",
  });

export const createTransaction = (data: CreateTransactionPayload) =>
  apiFetch<Transaction>("/transaction", {
    method: "POST",
    body: JSON.stringify(data),
  });
