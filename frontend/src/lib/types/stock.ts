import { Product } from "./product";

// a batch at or below this quantity counts as low stock
export const LOW_STOCK_THRESHOLD = 20;

// batches expiring within this many days get flagged
export const EXPIRING_SOON_DAYS = 30;

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
