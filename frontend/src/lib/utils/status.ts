import { TransactionStatus } from "../types/transaction";

export const statusClass = (status?: TransactionStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "REFUNDED":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "CANCELLED":
      return "bg-rose-100 text-rose-800 border-rose-300";
    default:
      return "bg-muted text-foreground border-border";
  }
};
