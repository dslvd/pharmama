"use client";

import { useEffect, useState } from "react";
import { getTransactionList } from "@/lib/api/transaction";
import { Transaction } from "@/lib/types/transaction";

export default function RecentTransactions({
  onError,
}: {
  onError?: (message: string) => void;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const result = await getTransactionList();
        if (result.ok) {
          const sorted = result.value
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5);
          setTransactions(sorted);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        onError?.(message);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [onError]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-teal-100 text-teal-700";
      case "REFUNDED":
        return "bg-orange-100 text-orange-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Recent transactions
      </h3>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          No transactions found
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">
                  ID
                </th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">
                  TOTAL
                </th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">
                  HANDLED BY
                </th>
                <th className="py-3 px-4 text-left font-semibold text-muted-foreground">
                  STATUS
                </th>
                <th className="py-3 px-4 text-right font-semibold text-muted-foreground">
                  TIME
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-4 text-foreground font-medium">
                    F{transaction.id.toString().padStart(4, "0")}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    ₱{" "}
                    {transaction.totalAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-foreground">
                    {transaction.handledBy}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        transaction.status,
                      )}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {formatTime(transaction.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
