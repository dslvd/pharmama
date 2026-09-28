import { Product } from "./product";
import { User } from "./users";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  handledBy: number;
  user: User;
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

// price, cashier and status are set by the backend
export type CreateTransactionItemPayload = {
  stockId: number;
  quantity: number;
};

export type CreateTransactionPayload = {
  transactionItems: CreateTransactionItemPayload[];
};

export interface UpdateTrStatusPayload {
  status: TransactionStatus;
}
