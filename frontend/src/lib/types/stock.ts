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

export interface CreateStockPayload {
  productId: number;
  batchNumber: string;
  quantity: number;
  expiryDate: Date;
}

export interface GetStListParams {
  category?: string;
  order?: SortOrder;
}

// export interface GetStListParams {
//   sortBy?: "quantity" | "expiryDate" | "createdAt";
//   order?: SortOrder;
// }