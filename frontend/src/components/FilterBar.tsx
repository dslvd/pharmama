"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface FilterProps {
  title: string;
  sub: string[];
  type?: "pills" | "select";
}

interface FilterBarProps {
  filters: FilterProps[];
  selectedValues?: Record<string, string[] | string | undefined>;
  onFilterChange: (title: string, sub: string, checked: boolean) => void;
}

export default function FilterBar({
  filters,
  selectedValues = {},
  onFilterChange,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatHeader = (text: string) => {
    if (text.toUpperCase() === "ACTION") return "Action";
    if (text.toUpperCase() === "ENTITY") return "Entity";
    if (text.toUpperCase() === "ORDER") return "Order By Date";
    if (text.toUpperCase() === "SORTBY") return "Sort By";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatLabel = (text: string) => {
    if (text === "asc") return "Earliest to Latest";
    if (text === "desc") return "Latest to Earliest";
    if (text === "STOCK_ADJUSTMENT") return "Stock Adjustment";
    if (text === "RESTORE_STOCK") return "Restored Stock";
    if (text === "TRANSACTIONITEM") return "Transaction Item";
    if (text === "genericName") return "Generic Name";
    if (text === "expiryDate") return "Expiry Date";
    if (text === "createdAt") return "Created At";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div ref={containerRef} className="w-full space-y-5 text-foreground">
      {filters.map((group) => {
        const titleKey = group.title.toUpperCase();
        const rawValue =
          selectedValues[group.title] ??
          selectedValues[titleKey] ??
          selectedValues[formatHeader(group.title)];
        const currentSelected: string[] = Array.isArray(rawValue)
          ? rawValue
          : rawValue
            ? [rawValue]
            : [];
        const isSelect =
          group.type === "select" ||
          titleKey === "ORDER" ||
          titleKey.includes("SORT");
        const checkedItems = currentSelected.filter((item) =>
          group.sub.includes(item),
        );
        const uncheckedItems = group.sub.filter(
          (item) => !currentSelected.includes(item),
        );
        const orderedSubOptions = [...checkedItems, ...uncheckedItems];
        const isOpen = openDropdown === group.title;
        const selectedOption = currentSelected[0];

        return (
          <div key={group.title} className="space-y-2.5">
5            <h3 className="text-left text-lg font-bold tracking-tight text-foreground">
              {formatHeader(group.title)}
            </h3>
            <hr className="border-border" />
            {isSelect ? (
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(isOpen ? null : group.title)
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border bg-card px-4 py-3 text-xs font-semibold text-foreground shadow-sm transition-all ${
                    isOpen
                      ? "border-violet-900 ring-1 ring-violet-900"
                      : "border-border hover:border-slate-400"
                  }`}
                >
                  <span>
                    {selectedOption
                      ? formatLabel(selectedOption)
                      : "Select option..."}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-700 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-2xl border border-border bg-card/95 py-1.5 shadow-xl backdrop-blur-md">
                    {group.sub.map((sub) => {
                      const isSelected = selectedOption === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            onFilterChange(group.title, sub, true);
                            setOpenDropdown(null);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors ${
                            isSelected
                              ? "bg-violet-50 font-semibold text-violet-950"
                              : "text-foreground hover:bg-slate-100/70"
                          }`}
                        >
                          <span>{formatLabel(sub)}</span>
                          {isSelected && (
                            <span className="h-4 w-1 rounded-full bg-violet-900" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {orderedSubOptions.map((sub) => {
                  const isChecked = currentSelected.includes(sub);
                  return (
                    <label
                      key={sub}
                      className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        isChecked
                          ? "border-foreground bg-violet-200 text-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={`filter-${group.title}`}
                        value={sub}
                        checked={isChecked}
                        onChange={(event) =>
                          onFilterChange(group.title, sub, event.target.checked)
                        }
                        className="peer sr-only"
                      />
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-lg border border-border bg-card text-transparent transition-colors peer-checked:border-violet-900 peer-checked:bg-violet-900 peer-checked:text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                      <span>{formatLabel(sub)}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}