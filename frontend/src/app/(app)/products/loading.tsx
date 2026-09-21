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
    <main className="flex min-h-screen flex-col gap-5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-80 max-w-full rounded" />
        </div>
        <div className="flex w-full flex-wrap items-center justify-end gap-3 md:w-auto">
          <Skeleton className="h-10 min-w-56 flex-1 rounded-lg md:w-56 md:flex-none" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="min-h-122 flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-5 gap-4 border-b border-border bg-[#fdfbf7] px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-20 rounded" />
          ))}
        </div>
        <div className="space-y-3 px-4 py-4">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} className="grid grid-cols-5 gap-4 py-2">
              {Array.from({ length: 5 }).map((_, column) => (
                <Skeleton key={column} className="h-4 w-full rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
