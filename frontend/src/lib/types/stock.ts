import { Product } from "./product";

export type SortBy = "quantity" | "expiryDate" | "createdAt";

export interface Stock {
  id: number;
  productId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

export type UpdateStockPayload = Partial<CreateStockPayload>;

export interface CreateStockPayload {
  productId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
}
