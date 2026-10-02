"use client";

import { getAuditList } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log";
import { SortOrder } from "@/lib/types/product";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search, SlidersHorizontal } from "lucide-react";
import AuditRow from "./components/AuditRow";
import FilterBar, { FilterProps } from "@/components/FilterBar";
import { ErrorStack } from "@/components/ErrorCard";
import Loading from "@/app/(app)/logbook/loading";
import Dropdown from "@/components/ui/Dropdown";
import { Table, TableEmpty, TableHead, Th } from "@/components/ui/table";

export default function LogbookPage() {
  const [allAudit, setAllAudit] = useState<AuditLog[]>([]);
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
      const result = await getAuditList();

      if (result.ok) {
        setAllAudit(result.value);
      } else {
        addError(result.error);
      }
      setLoading(false);
    }

    loadAudit();
  }, []);

  const audit = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    let list = allAudit.filter(
      (log) =>
        (!entity || log.entity === entity) &&
        (!action || log.action === action) &&
        (!q ||
          log.action.toLowerCase().includes(q) ||
          log.entity.toLowerCase().includes(q) ||
          log.user?.name.toLowerCase().includes(q)),
    );

    list = [...list].sort((a, b) =>
      (order ?? "desc") === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return list;
  }, [allAudit, entity, action, order, searchTerm]);

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
      sub: ["TRANSACTION", "PRODUCT", "STOCK", "TRANSACTIONITEM", "USER"],
    },
    {
      title: "ORDER",
      sub: ["asc", "desc"],
    },
  ];

  return (
    <>
      <main className="flex h-dvh min-h-[36rem] flex-col gap-5 p-6">
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
                placeholder="Search user, entity or action..."
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <Dropdown
              open={filter}
              onOpenChange={setFilter}
              align="end"
              className="w-96 max-h-none overflow-visible rounded-2xl border-2 border-foreground bg-card p-5 shadow-2xl"
              trigger={
                <button
                  aria-label="Toggle filters"
                  aria-pressed={filter}
                  className={`rounded-lg border p-2.5 transition-colors ${
                    filter
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <SlidersHorizontal size={18} strokeWidth={2.2} />
                </button>
              }
            >
              <FilterBar
                filters={FilterOptions}
                onFilterChange={handleFilterChange}
                onReset={() => {
                  setAction(undefined);
                  setEntity(undefined);
                  setOrder(undefined);
                }}
                selectedValues={{
                  ACTION: action,
                  ENTITY: entity,
                  ORDER: order,
                }}
              />
            </Dropdown>
          </div>
        </div>

        <Table className="min-h-0 flex-1" minWidth="min-w-[860px]">
          <TableHead>
            <Th className="w-36">When</Th>
            <Th className="w-44">User</Th>
            <Th className="w-40">Action</Th>
            <Th className="w-40">Entity</Th>
            <Th>Changes</Th>
          </TableHead>
          <tbody>
            {audit.length === 0 ? (
              <TableEmpty
                colSpan={5}
                icon={<BookOpen className="h-6 w-6" />}
                title={
                  allAudit.length === 0
                    ? "Nothing logged yet"
                    : "No matching entries"
                }
              >
                <p>
                  {allAudit.length === 0
                    ? "Every add, edit, and delete across the app will be recorded here automatically."
                    : "Try a different search or clear the filters."}
                </p>
              </TableEmpty>
            ) : (
              audit.map((item) => <AuditRow key={item.id} audit={item} />)
            )}
          </tbody>
        </Table>
        <ErrorStack errors={errors} />
      </main>
      <div
        className={`absolute inset-0 z-40 bg-background transition-opacity duration-300 ease-out ${
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
