import Skeleton from "@/components/ui/Skeleton";

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
  const cols = "grid-cols-[9rem_11rem_10rem_10rem_1fr]";
  return (
    <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div
        className={`grid min-w-[860px] ${cols} gap-4 border-b border-border bg-surface-subtle px-4 py-3.5`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-14 rounded" />
        ))}
      </div>
      {Array.from({ length: 9 }).map((_, row) => (
        <div
          key={row}
          className={`grid min-w-[860px] ${cols} gap-4 border-b border-border/70 px-4 py-3`}
        >
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-8 rounded" />
          </div>
          <Skeleton className="h-4 w-56 max-w-full rounded" />
        </div>
      ))}
    </div>
  );
}
