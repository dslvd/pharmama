import type { HTMLAttributes } from "react";

function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden="true" className={`skeleton ${className}`} {...props} />
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="grid gap-4 border-b border-border bg-muted/60 px-4 py-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-20 rounded" />
        ))}
      </div>
      <div className="space-y-3 px-4 py-4">
        {Array.from({ length: 4 }).map((_, row) => (
          <div
            key={row}
            className="grid gap-4 py-2"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, column) => (
              <Skeleton key={column} className="h-4 w-full rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-56 rounded-lg" />
      </div>
      <div className="space-y-6">
        <div className="flex min-h-32.5 items-center justify-center rounded-2xl border border-border bg-card">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <TableSkeleton columns={5} />
      </div>
    </main>
  );
}
