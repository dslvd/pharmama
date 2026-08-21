"use client";
import { getAuditList } from "@/lib/api/logbook";
import { AuditAction, AuditEntity, AuditLog } from "@/lib/types/audit-log";
import { SortOrder } from "@/lib/types/product";
import { useEffect, useState } from "react";
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
    <main className="space-y-6 p-5">
      <h2 className="text-5xl font-bold text-primary">Logbook</h2>
      <button onClick={() => setFilter(!filter)}>Filter</button>
      {filter && (
        <FilterBar
          filters={FilterOptions}
          onFilterChange={handleFilterChange}
        />
      )}

      {audit.map((item) => {
        return <AuditRow key={item.id} audit={item} />;
      })}
    </main>
  );
}
