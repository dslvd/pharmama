"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Filter, Funnel, Search } from "lucide-react";
import { Transaction, TransactionStatus } from "@/lib/types/transaction";
import {
  getTransactionList,
  updateTransactionStatus,
} from "@/lib/api/transaction";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "../../../components/FilterBar";

interface SalesTableProps {
  initialRecords?: Transaction[];
  refreshKey?: number;
  onViewClick?: (id: number) => void;
  onError?: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}
const inputClasses =
  "rounded-full border border-border bg-white py-1.5 text-sm text-foreground focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";
const STATUS_VALUES: TransactionStatus[] = [
  "COMPLETED",
  "REFUNDED",
  "CANCELLED",
];

export default function SalesTable({
  initialRecords = [],
  onViewClick,
  onError,
  onLoadingChange,
  refreshKey = 0,
}: SalesTableProps) {
  const [allSales, setAllSales] = useState<Transaction[]>(initialRecords);
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [filter, setFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);

  useEffect(() => {
    async function getTransaction() {
      onLoadingChange?.(true);
      const result = await getTransactionList({});
      if (result.ok) {
        setAllSales(result.value);
      } else {
        onError?.(result.error);
      }
      onLoadingChange?.(false);
    }
    getTransaction();
  }, [refreshKey]);

  const sales = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let list = allSales.filter((tx) => {
      const statusFilterMatch = !status || tx.status === status;
      const searchMatch =
        !q ||
        tx.handledBy.toLowerCase().includes(q) ||
        tx.status.toLowerCase().includes(q);

      return statusFilterMatch && searchMatch;
    });

    list = [...list].sort((a, b) =>
      (order ?? "desc") === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return list;
  }, [allSales, status, order, searchTerm]);

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
      setAllSales((prev) =>
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
    { title: "STATUS", sub: ["COMPLETED", "REFUNDED", "CANCELLED"] },
    { title: "ORDER", sub: ["asc", "desc"] },
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
                    onClick={() => setFilter((f) => !f)}
                    aria-label="Toggle filters"
                    aria-pressed={filter}
                    className={`rounded-lg border p-2.5 transition-colors ${
                      filter
                        ? "border-primary bg-violet-100 text-violet-700"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Funnel size={18} />
                  </button>

                  {filter && (
                    <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-border bg-card p-4 shadow-lg">
                      <FilterBar
                        filters={FilterOptions}
                        onFilterChange={handleFilterChange}
                        selectedValues={{
                          STATUS: status,
                          ORDER: order,
                        }}
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search"
                      className={`${inputClasses} pl-9 pr-3`}
                    />
                  </div>
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
                          {STATUS_VALUES.map((option) => (
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
