"use client";

import { getAuditList, searchAudit } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log";
import { SortOrder } from "@/lib/types/product";
import { useEffect, useState } from "react";
import { BookOpen, Funnel, Search } from "lucide-react";
import AuditRow from "./components/AuditRow";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "@/app/logbook/loading";

export default function LogbookPage() {
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [action, setAction] = useState<AuditAction | undefined>(undefined);
  const [entity, setEntity] = useState<AuditEntity | undefined>(undefined);
  const [order, setOrder] = useState<SortOrder | undefined>(undefined);
  const [filter, setFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  useEffect(() => {
    async function loadAudit() {
      setLoading(true);

      const result = searchTerm
        ? await searchAudit(searchTerm)
        : await getAuditList({ entity, action, order });

      if (result.ok) {
        setAudit(result.value);
      } else {
        addError(result.error);
      }
      setLoading(false);
    }

    loadAudit();
  }, [entity, action, order, searchTerm]);

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
    <>
      <main className="flex min-h-screen flex-col gap-5 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Logbook</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Audit trail of every change made in the system.
            </p>
          </div>

          <div className="flex w-full items-center justify-end gap-3 md:w-auto">
            <div className="relative min-w-56 flex-1 md:w-56 md:flex-none">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search entity or action..."
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setFilter(!filter)}
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
                <div className="absolute right-0 z-10 mt-2 w-96 rounded-2xl border-2 border-foreground bg-card p-5 shadow-2xl">
                  <FilterBar
                    filters={FilterOptions}
                    onFilterChange={handleFilterChange}
                    selectedValues={{
                      ACTION: action,
                      ENTITY: entity,
                      ORDER: order,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-128 flex-1 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-[#fdfbf7]">
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Time
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ID
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Action
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Entity
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Change
                </th>
              </tr>
            </thead>

            <tbody>
              {audit.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="h-112 px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-950">
                        <BookOpen className="h-7 w-7" />
                      </span>
                      <p className="text-base font-semibold text-foreground">
                        Nothing logged yet
                      </p>
                      <p className="max-w-sm leading-5 text-muted-foreground">
                        Every add, edit, and delete across the app will be
                        recorded here automatically — no action needed.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                audit.map((item) => <AuditRow key={item.id} audit={item} />)
              )}
            </tbody>
          </table>
        </div>
        <ErrorStack errors={errors} />
      </main>
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-300 ease-out ${
          loading
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!loading}
      >
        <Loading />
      </div>
    </>
  );
}
