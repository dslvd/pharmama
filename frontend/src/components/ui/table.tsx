import { cn } from "cn";

// Shared table styling so every list in the app looks the same.
// Plain elements with consistent classes; no behavior.

type Align = "left" | "right" | "center";

const alignClass: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

// card wrapper + horizontal scroll on narrow screens
export function Table({
  className,
  minWidth = "min-w-[720px]",
  children,
}: {
  className?: string;
  minWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-auto rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <table className={cn("w-full border-collapse text-sm", minWidth)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="sticky top-0 z-10 bg-surface-subtle shadow-[inset_0_-1px_0_var(--border)]">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({
  align = "left",
  className,
  children,
}: {
  align?: Align;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        alignClass[align],
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Tr({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/70 transition-colors last:border-0 hover:bg-background/60",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  align = "left",
  numeric = false,
  className,
  colSpan,
  children,
}: {
  align?: Align;
  // right-aligned, fixed-width digits so amounts line up
  numeric?: boolean;
  className?: string;
  colSpan?: number;
  children?: React.ReactNode;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-4 py-3 align-middle text-foreground",
        alignClass[numeric ? "right" : align],
        numeric && "tabular-nums",
        className,
      )}
    >
      {children}
    </td>
  );
}

// big centered message for a table with no rows
export function TableEmpty({
  colSpan,
  icon,
  title,
  children,
}: {
  colSpan: number;
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {icon && (
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              {icon}
            </span>
          )}
          <p className="text-base font-semibold text-foreground">{title}</p>
          {children && (
            <div className="max-w-sm text-sm leading-5 text-muted-foreground">
              {children}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// small pill used in table cells
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
