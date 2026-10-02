import { TransactionStatus } from "../types/transaction";

export const statusClass = (status?: TransactionStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-success-soft text-success border-success/30";
    case "REFUNDED":
      return "bg-warning-soft text-warning border-warning/30";
    case "CANCELLED":
      return "bg-danger-soft text-danger border-danger/30";
    default:
      return "bg-muted text-foreground border-border";
  }
};
