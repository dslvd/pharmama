import { TransactionStatus } from "src/generated/prisma/enums";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  createdAt: Date;
}
