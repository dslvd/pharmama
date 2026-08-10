import { apiFetch } from "../utils/client";
import { SortOrder } from "./product";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  handledBy: string;
  createdAt: Date;
}

export type TransactionStatus = "REFUNDED" | "COMPLETED" | "CANCELLED";

export interface TransactionItem {
  id: number;
  transactionId: number;
  productId: number;
  stockId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

type CreateTransactionItemPayload = {
  productId: number;
  stockId: number;
  quantity: number;
  unitPrice: number;
};

type CreateTransactionPayload = {
  status: TransactionStatus;
  handledBy: string;
  transactionItem: CreateTransactionItemPayload;
};

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

interface GetTrListParams {
  status?: TransactionStatus;
  handledBy?: string;
  order?: SortOrder;
}
