export interface Stock {
  id: number;
  productId: number;
  batchNumber: number;
  quantity: number;
  expiryDate: Date;
  createdAt: Date;
}
