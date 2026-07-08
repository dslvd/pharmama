export interface Batch {
  id: number;
  productId: number;
  batchNumber: number;
  quantity: number;
  expiryDate: Date;
  createdAt: Date;
}
