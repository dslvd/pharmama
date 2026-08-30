import { Product } from "./product";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  handledBy: string;
  createdAt: Date;
  transactionItems: TransactionItem[];
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
  product: Product;
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
  transactionItems: CreateTransactionItemPayload[];
};

export interface UpdateTrStatusPayload {
  status: TransactionStatus;
}
