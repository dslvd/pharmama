"use client";

import { cn } from "cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DropdownProps {
  trigger: React.ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  align?: "start" | "center" | "end";
  className?: string;
  children: React.ReactNode;
}

export default function Dropdown({
  trigger,
  open,
  onOpenChange,
  align = "start",
  className,
  children,
}: DropdownProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align={align}
        sideOffset={8}
        className={cn(
          "w-(--anchor-width) max-h-80 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-lg",
          className,
        )}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
