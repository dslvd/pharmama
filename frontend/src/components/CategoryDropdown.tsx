"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import Dropdown from "@/components/ui/Dropdown";
import { Category } from "@/lib/types/product";

export const CATEGORY_OPTIONS: Category[] = [
  "ANALGESICS",
  "ANTIBIOTICS",
  "ANTIHISTAMINES",
  "VITAMINS",
  "SUPPLEMENTS",
  "ANTACIDS",
  "HYGIENE",
  "OTHERS",
];

interface CategoryDropdownProps {
  value: Category;
  onChange: (category: Category) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  open,
  onOpenChange,
  error,
}: CategoryDropdownProps) {
  return (
    <Dropdown
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-border bg-input px-3 py-2.5 text-left text-sm text-foreground outline-none transition-colors duration-200 hover:border-ring focus:border-ring focus:ring-2 focus:ring-ring/20",
            error && "border-destructive",
          )}
        >
          <span className="font-semibold uppercase tracking-[0.02em]">
            {value}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      }
    >
      <div className="max-h-56 overflow-y-auto py-1.5">
        {CATEGORY_OPTIONS.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onOpenChange(false);
              }}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors",
                isSelected
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span>{option}</span>
              {isSelected && (
                <span className="h-4 w-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </Dropdown>
  );
}
