import {
  CreateTransactionPayload,
  Transaction,
  UpdateTrStatusPayload,
} from "../types/transaction";
import { apiFetch } from "../utils/client";

export const getTransaction = (id: number) =>
  apiFetch<Transaction>(`/transaction/${id}`);

export const getTransactionList = (_params?: Record<string, unknown>) => {
  return apiFetch<Transaction[]>(`/transaction`);
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
