"use client";
import { getAuditList } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log";
import { SortOrder } from "@/lib/types/product";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import AuditRow from "./components/AuditRow";
import FilterBar, { FilterProps } from "@/components/FilterBar";

export default function LogbookPage() {
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [entity, setEntity] = useState<AuditEntity | undefined>(undefined);
  const [action, setAction] = useState<AuditAction | undefined>(undefined);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [filter, setFilter] = useState(false);

  useEffect(() => {
    async function loadAudit() {
      const result = await getAuditList({ entity, action, order });
      if (result.ok) {
        setAudit(result.value);
      } else {
        console.log(result.error);
      }
    }

    loadAudit();
  }, [entity, action, order]);

  const handleFilterChange = (title: string, sub: string, checked: boolean) => {
    if (title === "ACTION") {
      setAction(checked ? (sub as AuditAction) : undefined);
    } else if (title === "ORDER") {
      setEntity(checked ? (sub as AuditEntity) : undefined);
    } else if (title === "ENTITY") {
      setOrder(checked ? (sub as SortOrder) : undefined);
    }
  };

  const FilterOptions: FilterProps[] = [
    {
      title: "ACTION",
      sub: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "CANCEL",
        "STOCK_ADJUSTMENT",
        "RESTORE_STOCK",
      ],
    },
    {
      title: "ENTITY",
      sub: ["TRANSACTION", "PRODUCT", "STOCK", "TRANSACTIONITEM"],
    },
    {
      title: "ORDER",
      sub: ["asc", "desc"],
    },
  ];

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-4xl font-bold text-foreground">Logbook</h2>

        <button
          onClick={() => setFilter(!filter)}
          aria-pressed={filter}
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            filter
              ? "border-violet-700 bg-violet-700 text-white"
              : "border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>
      </div>

      {filter && (
        <div className="rounded-xl border border-border bg-card p-4">
          <FilterBar
            filters={FilterOptions}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2.5 text-center text-xs font-bold text-foreground">
                ID
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold text-foreground">
                Date
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold text-foreground">
                Time
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold text-foreground">
                Action
              </th>
              <th className="px-4 py-2.5 text-xs font-bold text-foreground">
                Entity
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-bold text-foreground">
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {audit.map((item) => (
              <AuditRow key={item.id} audit={item} />
            ))}
            {audit.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={6}>
                  No audit records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}