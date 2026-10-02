import Skeleton from "@/components/ui/Skeleton";

// mirrors dashboard/page.tsx: header, 4 stat cards, chart + watchlist,
// recent transactions

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-28 rounded" />
      <Skeleton className="mt-3 h-9 w-32 rounded" />
      <Skeleton className="mt-2 h-3 w-24 rounded" />
    </div>
  );
}

export default function Loading() {
  return (
    <main
      className="flex min-h-screen flex-col space-y-6 p-6"
      role="status"
      aria-label="Loading dashboard"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="mt-2 h-4 w-56 rounded" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* stat cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </section>

      {/* sales chart + low stock watchlist */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex h-105 flex-col rounded-xl border border-border bg-card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-36 rounded" />
            </div>
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-12 rounded-md" />
              ))}
            </div>
          </div>
          <div className="mt-5 flex h-64 items-end gap-6 px-6 pb-2">
            {["h-24", "h-40", "h-20", "h-48", "h-32", "h-44", "h-28"].map(
              (h, i) => (
                <Skeleton key={i} className={`${h} w-6 rounded-t`} />
              ),
            )}
          </div>
        </div>

        <div className="flex h-105 flex-col rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-40 rounded" />
          </div>
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      {/* recent transactions */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="px-5 py-4">
          <Skeleton className="h-6 w-44 rounded" />
        </div>
        <div className="grid grid-cols-5 gap-4 border-y border-border bg-surface-subtle px-4 py-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 rounded" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-5 items-center gap-4 border-b border-border/70 px-4 py-3 last:border-0"
          >
            <Skeleton className="h-3 w-14 rounded" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="ml-auto h-4 w-16 rounded" />
          </div>
        ))}
      </section>
    </main>
  );
}
