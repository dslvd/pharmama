"use client";

import { getAuditList } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log";
import { SortOrder } from "@/lib/types/product";
import { useEffect, useState } from "react";
import { Funnel } from "lucide-react";
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
    } else if (title === "ENTITY") {
      setEntity(checked ? (sub as AuditEntity) : undefined);
    } else if (title === "ORDER") {
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

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setFilter(!filter)}
              aria-label="Toggle filters"
              aria-pressed={filter}
              className={`rounded-full border p-2.5 transition-colors ${
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
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ID
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Time
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Action
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Entity
              </th>
              <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Change
              </th>
            </tr>
          </thead>

          <tbody>
            {audit.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No audit records found.
                </td>
              </tr>
            ) : (
              audit.map((item) => <AuditRow key={item.id} audit={item} />)
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
