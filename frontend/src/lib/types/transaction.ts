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

export type CreateTransactionItemPayload = {
  productId: number;
  stockId: number;
  quantity: number;
  unitPrice: number;
};

export type CreateTransactionPayload = {
  status: TransactionStatus;
  handledBy: string;
  transactionItem: CreateTransactionItemPayload;
};

export interface GetTrListParams {
  status?: TransactionStatus;
  handledBy?: string;
  order?: SortOrder;
}
