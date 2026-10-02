import Skeleton from "@/components/ui/Skeleton";

// mirrors transaction/page.tsx: product picker + current sale side by side
// (same fixed heights), then the sales history table

const CARD_HEIGHT = "h-[520px] sm:h-[560px] lg:h-[620px]";
const SALES_COLS = "grid-cols-[1fr_1.2fr_1fr_0.6fr_0.8fr_1fr_5rem]";

export default function Loading() {
  return (
    <main
      className="min-h-screen space-y-6 p-6"
      role="status"
      aria-label="Loading transactions"
    >
      <Skeleton className="h-9 w-48 rounded-lg" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* product picker */}
        <div
          className={`flex ${CARD_HEIGHT} flex-col rounded-2xl border border-border bg-background p-4 sm:p-5`}
        >
          <Skeleton className="mb-3 h-9 w-full rounded-full" />
          <div className="mb-3 flex flex-wrap gap-2">
            {["w-10", "w-24", "w-24", "w-28", "w-20", "w-24", "w-20", "w-20", "w-18"].map(
              (w, i) => (
                <Skeleton key={i} className={`h-6 ${w} rounded-full`} />
              ),
            )}
          </div>
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-card">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-16 items-center justify-between gap-3 border-b border-border/60 px-4 py-3"
              >
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* current sale */}
        <div
          className={`flex ${CARD_HEIGHT} flex-col rounded-2xl border border-border bg-card p-4 sm:p-5`}
        >
          <Skeleton className="h-6 w-32 rounded" />
          <div className="flex flex-1 items-center justify-center">
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-full" />
          </div>
        </div>
      </div>

      {/* sales history */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-36 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-48 rounded-full" />
          </div>
        </div>
        <div className="h-[30rem] overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div
            className={`grid ${SALES_COLS} gap-4 border-b border-border bg-surface-subtle px-4 py-3.5`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16 rounded" />
            ))}
            <span />
          </div>
          {Array.from({ length: 7 }).map((_, row) => (
            <div
              key={row}
              className={`grid ${SALES_COLS} items-center gap-4 border-b border-border/70 px-4 py-3`}
            >
              <Skeleton className="h-3 w-12 rounded" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="ml-auto h-4 w-6 rounded" />
              <Skeleton className="ml-auto h-4 w-16 rounded" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="ml-auto h-7 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
