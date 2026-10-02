"use client";

import { useMemo } from "react";
import { Transaction } from "@/lib/types/transaction";
import { formatDate, formatTime, peso, txnId } from "@/lib/utils/format";
import Skeleton from "@/components/ui/Skeleton";
import StatusBadge from "@/components/StatusBadge";
import { Table, TableHead, Td, Th, Tr } from "@/components/ui/table";

export default function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[] | null;
}) {
  const recent = useMemo(() => {
    if (!transactions) return null;
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [transactions]);

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Recent transactions
      </h3>

      {recent === null ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">
          No transactions found
        </p>
      ) : (
        <Table className="border-0 shadow-none" minWidth="min-w-[560px]">
          <TableHead>
            <Th>Transaction</Th>
            <Th>When</Th>
            <Th>Handled by</Th>
            <Th>Status</Th>
            <Th align="right">Total</Th>
          </TableHead>
          <tbody>
            {recent.map((transaction) => (
              <Tr key={transaction.id}>
                <Td className="font-mono text-xs text-muted-foreground">
                  {txnId(transaction.id)}
                </Td>
                <Td className="whitespace-nowrap">
                  <p>{formatDate(transaction.createdAt)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(transaction.createdAt)}
                  </p>
                </Td>
                <Td>{transaction.user?.name ?? transaction.handledBy}</Td>
                <Td>
                  <StatusBadge status={transaction.status} />
                </Td>
                <Td numeric className="font-semibold">
                  {peso(transaction.totalAmount)}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  );
}
