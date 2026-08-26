"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Filter, Search } from "lucide-react";
import { Transaction, TransactionStatus } from "@/lib/types/transaction";
import {
  getTransactionList,
  updateTransactionStatus,
} from "@/lib/api/transaction";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "../../../components/FilterBar";

interface SalesTableProps {
  initialRecords?: Transaction[];
  onViewClick?: (id: number) => void;
  onError?: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function SalesTable({
  initialRecords = [],
  onViewClick,
  onError,
  onLoadingChange,
}: SalesTableProps) {
  const [sales, setSales] = useState<Transaction[]>(initialRecords);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [filter, setFilter] = useState(false);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);

  useEffect(() => {
    async function getTransaction() {
      onLoadingChange?.(true);
      const result = await getTransactionList({ status, order });
      if (result.ok) {
        setSales(result.value);
      } else {
        onError?.(result.error);
      }
      onLoadingChange?.(false);
    }
    getTransaction();
  }, [order, status]);

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
    setOpenStatusId(null);
    const result = await updateTransactionStatus(id, { status: newStatus });

    if (result.ok) {
      setSales((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)),
      );
    } else {
      onError?.(result.error);
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
      title: "STATUS",
      sub: ["COMPLETED", "REFUNDED", "CANCELLED"],
    },
    {
      title: "ORDER",
      sub: ["asc", "desc"],
    },
  ];

  return (
    <section className="relative">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-b border-border bg-muted/60">
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
              sales.map((record, index) => (
                <tr key={record.id} className="border-t border-border bg-card">
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
                    <div className="relative w-fit">
                      <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={openStatusId === record.id}
                        onClick={() =>
                          setOpenStatusId((current) =>
                            current === record.id ? null : record.id,
                          )
                        }
                        className={`flex min-w-28 items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-violet-200 ${getStatusColor(
                          record.status,
                        )}`}
                      >
                        {record.status}
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            openStatusId === record.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openStatusId === record.id && (
                        <div
                          role="listbox"
                          aria-label="Transaction status"
                          className={`absolute left-0 z-30 w-36 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg ${
                            index >= sales.length - 2
                              ? "bottom-[calc(100%+6px)]"
                              : "top-[calc(100%+6px)]"
                          }`}
                        >
                          {(
                            [
                              "COMPLETED",
                              "REFUNDED",
                              "CANCELLED",
                            ] as TransactionStatus[]
                          ).map((option) => (
                            <button
                              key={option}
                              type="button"
                              role="option"
                              aria-selected={record.status === option}
                              onClick={() =>
                                handleStatusChange(record.id, option)
                              }
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted ${
                                record.status === option
                                  ? "bg-muted/60 font-semibold"
                                  : ""
                              }`}
                            >
                              {option}
                              {record.status === option && <Check size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
    </section>
  );
}
