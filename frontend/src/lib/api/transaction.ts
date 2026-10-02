import {
  CreateTransactionPayload,
  Transaction,
  UpdateTrStatusPayload,
} from "../types/transaction";
import { apiFetch } from "../utils/client";
import { mapResult, toTransaction } from "../utils/decimal";

export const getTransactionList = async () =>
  mapResult(await apiFetch<Transaction[]>(`/transaction`), (list) =>
    list.map(toTransaction),
  );

export const createTransaction = async (data: CreateTransactionPayload) =>
  mapResult(
    await apiFetch<Transaction>("/transaction", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    toTransaction,
  );

export const updateTransactionStatus = (
  id: number,
  status: UpdateTrStatusPayload,
) =>
  apiFetch<Transaction>(`/transaction/${id}/updateStatus`, {
    method: "PATCH",
    body: JSON.stringify(status),
  });
