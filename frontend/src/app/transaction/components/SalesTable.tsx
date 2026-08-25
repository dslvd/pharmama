"use client";

import { useEffect, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Transaction, TransactionStatus } from "@/lib/types/transaction";
import { getTransactionList } from "@/lib/api/transaction";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";

interface SalesTableProps {
  initialRecords?: Transaction[];
  onViewClick?: (id: number) => void;
  onError?: (message: string) => void;
}

export default function SalesTable({
  initialRecords = [],
  onViewClick,
  onError,
}: SalesTableProps) {
  const [sales, setSales] = useState<Transaction[]>(initialRecords);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(false);

  useEffect(() => {
    async function getTransaction() {
      setLoading(true);
      const result = await getTransactionList({ status, order });

      if (result.ok) {
        setSales(result.value);
        setLoading(false);
      } else {
        onError?.(result.error);
        setLoading(false);
      }
    }

    getTransaction();
  }, [order, status, onError]);

  const getStatusColor = (status: TransactionStatus) => {
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

  const handleStatusChange = async (
    id: number,
    newStatus: TransactionStatus,
  ) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
    );

    const result = await updateTransactionStatus(id, newStatus);
    if (!result.ok) {
      onError?.(result.error);
      setSales((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: s.status } : s)),
      );
    }
  };

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "STATUS") {
      setStatus(checked ? (sub as TransactionStatus) : undefined);
    } else if (title === "ORDER") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    {
      title: "ACTION",
      sub: ["COMPLETED", "REFUNDED", "CANCELLED"],
    },
    {
      title: "ORDER",
      sub: ["asc", "desc"],
    },
  ];

  return (
    <section>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        {loading && <div>Loading...</div>}
        <div className="max-h-88 overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-border bg-muted/60">
              <tr>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Transaction ID
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Total
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Handled by
                </th>
                <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div className="flex items-center justify-end gap-3 text-muted-foreground">
                    <button
                      aria-label="Filter"
                      className="transition-colors hover:text-violet-900"
                    >
                      <Filter size={14} onClick={() => setFilter(true)} />
                    </button>
                    {filter && (
                      <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-lg">
                        <FilterBar
                          filters={FilterOptions}
                          onFilterChange={handleFilterChange}
                        />
                      </div>
                    )}
                    <button
                      aria-label="Search"
                      className="transition-colors hover:text-violet-900"
                    >
                      <Search size={14} />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                sales.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-border odd:bg-card even:bg-muted/40 hover:bg-violet-50/60"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{record.id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      ${record.totalAmount}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {record.handledBy}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={record.status}
                        onChange={(e) =>
                          handleStatusChange(
                            record.id,
                            e.target.value as TransactionStatus,
                          )
                        }
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 ${getStatusColor(
                          record.status,
                        )}`}
                      >
                        <option value="SUCCESS">COMPLETED</option>
                        <option value="REFUNDED">REFUNDED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewClick?.(record.id)}
                        className="rounded-md border border-border bg-white px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        view
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
