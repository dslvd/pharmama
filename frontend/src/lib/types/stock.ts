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
