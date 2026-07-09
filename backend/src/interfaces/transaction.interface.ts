import { TransactionStatus } from "src/generated/prisma/enums";
import { TransactionItem } from "./transaction-item.interface";

export interface Transaction {
  id: number;
  totalAmount: number;
  status: TransactionStatus;
  createdAt: Date;
}

export interface TransactionCreateInput {
  totalAmount: number;
  status: TransactionStatus;
  transactionItems: TransactionItem[];
  createdAt: Date;
}
