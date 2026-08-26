import type { HTMLAttributes } from "react";

function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div aria-hidden="true" className={`skeleton ${className}`} {...props} />
  );
}

export default function Loading() {
  return (
    <main
      className="flex min-h-screen flex-col gap-5 p-6"
      role="status"
      aria-label="Loading logbook"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-36 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-72 max-w-full rounded" />
        </div>
        <div className="flex w-full items-center justify-end gap-3 md:w-auto">
          <Skeleton className="h-10 min-w-56 flex-1 rounded-lg md:w-56 md:flex-none" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <TableSkeleton />
    </main>
  );
}

function TableSkeleton() {
  return (
    <div className="min-h-128 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="grid min-w-[640px] grid-cols-5 gap-4 border-b border-border bg-[#fdfbf7] px-4 py-3">
        <Skeleton className="mx-auto h-3 w-12 rounded" />
        <Skeleton className="mx-auto h-3 w-12 rounded" />
        <Skeleton className="mx-auto h-3 w-16 rounded" />
        <Skeleton className="mx-auto h-3 w-16 rounded" />
        <Skeleton className="mx-auto h-3 w-20 rounded" />
      </div>
      <div className="min-w-[640px] divide-y divide-border px-4">
        {Array.from({ length: 9 }).map((_, row) => (
          <div key={row} className="grid grid-cols-5 items-center gap-4 py-4">
            <Skeleton className="mx-auto h-4 w-20 rounded" />
            <Skeleton className="mx-auto h-4 w-14 rounded" />
            <Skeleton className="mx-auto h-6 w-24 rounded-full" />
            <Skeleton className="mx-auto h-4 w-20 rounded" />
            <Skeleton className="mx-auto h-4 w-28 max-w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
