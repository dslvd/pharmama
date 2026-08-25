import { Product, SortOrder } from "./product";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  handledBy: string;
  createdAt: Date;
  transactionitem: TransactionItem[];
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

export interface GetTrListParams {
  status?: TransactionStatus;
  handledBy?: string;
  order?: SortOrder;
}

export interface UpdateTrStatusPayload {
  status: TransactionStatus;
}
