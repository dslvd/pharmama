"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import {
  STATUS_VALUES,
  Transaction,
  TransactionStatus,
} from "@/lib/types/transaction";
import {
  getTransactionList,
  updateTransactionStatus,
} from "@/lib/api/transaction";
import { SortOrder } from "@/lib/types/product";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import { peso } from "@/lib/utils/format";
import { statusClass } from "@/lib/utils/status";
import Dropdown from "@/components/ui/Dropdown";

interface SalesTableProps {
  initialRecords?: Transaction[];
  refreshKey?: number;
  onViewClick?: (tr: Transaction) => void;
  onError?: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

const inputClasses =
  "rounded-full border border-border bg-card py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);

  useEffect(() => {
    async function getTransaction() {
      const result = await getTransactionList();
      if (result.ok) {
        setAllSales(result.value);
      } else {
        onError?.(result.error);
      }
      onLoadingChange?.(false);
    }
    getTransaction();
  }, [refreshKey, onError, onLoadingChange]);

  const sales = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let list = allSales.filter((tx) => {
      const statusFilterMatch = !status || tx.status === status;
      const searchMatch =
        !q ||
        tx.user?.name.toLowerCase().includes(q) ||
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
    { title: "STATUS", sub: STATUS_VALUES },
    { title: "ORDER", sub: ["asc", "desc"] },
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-background">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-lg font-bold text-foreground">Sales history</h2>

        <div className="flex items-center gap-2">
          <Dropdown
            open={filter}
            onOpenChange={setFilter}
            align="end"
            className="w-64 max-h-none overflow-visible rounded-xl border border-border bg-card p-4 shadow-lg"
            trigger={
              <button
                aria-label="Toggle filters"
                aria-pressed={filter}
                className={`rounded-full border p-2.5 transition-colors ${
                  filter
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary"
                }`}
              >
                <SlidersHorizontal size={16} strokeWidth={2.2} />
              </button>
            }
          >
            <FilterBar
              filters={FilterOptions}
              onFilterChange={handleFilterChange}
              onReset={() => {
                setStatus(undefined);
                setOrder(undefined);
              }}
              selectedValues={{
                STATUS: status,
                ORDER: order,
              }}
            />
          </Dropdown>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className={`${inputClasses} pl-9 pr-4 w-48`}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-y border-border">
            <tr>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Transaction ID
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Total
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Handled by
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-sm text-muted-foreground"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              sales.map((record) => (
                <tr
                  key={record.id}
                  className="border-t border-border bg-card/60"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">
                    #{record.id}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-foreground">
                    {peso(record.totalAmount)}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {record.user?.name ?? record.handledBy}
                  </td>
                  <td className="px-5 py-3.5">
                    <Dropdown
                      open={openStatusId === record.id}
                      onOpenChange={(open) =>
                        setOpenStatusId(open ? record.id : null)
                      }
                      className="w-36 p-1.5"
                      trigger={
                        <button
                          type="button"
                          className={`flex min-w-28 items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-ring/20 ${statusClass(
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
                      }
                    >
                      <div role="listbox" aria-label="Transaction status">
                        {STATUS_VALUES.map((option) => (
                          <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={record.status === option}
                            onClick={() =>
                              handleStatusChange(record.id, option)
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-background ${
                              record.status === option
                                ? "bg-background font-semibold"
                                : ""
                            }`}
                          >
                            {option}
                            {record.status === option && <Check size={14} />}
                          </button>
                        ))}
                      </div>
                    </Dropdown>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onViewClick?.(record)}
                      className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background"
                    >
                      View
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
