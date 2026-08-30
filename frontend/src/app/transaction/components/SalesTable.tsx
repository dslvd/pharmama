"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Funnel, Search } from "lucide-react";
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
  "rounded-full border border-[#e4dccf] bg-white py-2 text-sm text-[#1e1b3a] placeholder:text-[#9c93b0] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";

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
    <section className="relative rounded-2xl border border-[#e4dccf] bg-[#f5f1e8] overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-lg font-bold text-[#1e1b3a]">Sales history</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter((f) => !f)}
            aria-label="Toggle filters"
            aria-pressed={filter}
            className={`rounded-full border p-2.5 transition-colors ${
              filter
                ? "border-violet-400 bg-violet-100 text-violet-700"
                : "border-[#e4dccf] bg-white text-[#6f6787] hover:bg-[#efe9db]"
            }`}
          >
            <Funnel size={16} />
          </button>

          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9c93b0]"
            />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search"
              className={`${inputClasses} pl-9 pr-4 w-48`}
            />
          </div>

          {filter && (
            <div className="absolute right-5 top-16 z-10 w-64 rounded-xl border border-[#e4dccf] bg-white p-4 shadow-lg">
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
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="border-y border-[#e4dccf]">
            <tr>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#4b4468]">
                Transaction ID
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#4b4468]">
                Total
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#4b4468]">
                Handled by
              </th>
              <th className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#4b4468]">
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
                  className="px-5 py-8 text-center text-sm text-[#6f6787]"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              sales.map((record, index) => (
                <tr
                  key={record.id}
                  className="border-t border-[#e4dccf] bg-white/60"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-[#6f6787]">
                    #{record.id}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-[#1e1b3a]">
                    ₱ {record.totalAmount}
                  </td>
                  <td className="px-5 py-3.5 text-[#4b4468]">
                    {record.handledBy}
                  </td>
                  <td className="px-5 py-3.5">
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
                          className={`absolute left-0 z-30 w-36 overflow-hidden rounded-xl border border-[#e4dccf] bg-white p-1.5 shadow-lg ${
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
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-[#1e1b3a] transition-colors hover:bg-[#f5f1e8] ${
                                record.status === option
                                  ? "bg-[#f5f1e8] font-semibold"
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
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => onViewClick?.(record.id)}
                      className="rounded-full border border-[#d8cfbf] bg-white px-4 py-1.5 text-xs font-semibold text-[#1e1b3a] transition-colors hover:bg-[#f5f1e8]"
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
