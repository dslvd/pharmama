import { SortOrder } from "./product";

export interface Stock {
  id: number;
  productId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateStockPayload = Partial<CreateStockPayload>;

export interface CreateStockPayload {
  productId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
}

export type SortBy = "quantity" | "expiryDate" | "createdAt";

export interface GetStListParams {
  sortBy?: SortBy;
  order?: SortOrder;
}
