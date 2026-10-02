import Skeleton from "@/components/ui/Skeleton";

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
      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[2fr_1fr_1fr_6rem] gap-4 border-b border-border bg-surface-subtle px-4 py-3.5">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="ml-auto h-3 w-12 rounded" />
          <span />
        </div>
        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-[2fr_1fr_1fr_6rem] items-center gap-4 border-b border-border/70 px-4 py-3"
          >
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-3 w-28 rounded" />
            </div>
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="ml-auto h-4 w-20 rounded" />
            <Skeleton className="ml-auto h-6 w-16 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}
