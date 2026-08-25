import type { HTMLAttributes } from "react";

function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={`skeleton ${className}`} {...props} />;
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <Skeleton className="mt-4 h-4 w-28 rounded" />
      <Skeleton className="mt-3 h-9 w-32 rounded" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col space-y-6 p-6">
      <div className="space-y-6" role="status" aria-label="Loading dashboard">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </section>
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-36 rounded" />
            </div>
            <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
          </div>
          <div className="mt-5 flex min-h-64 items-end gap-3 px-3 pb-2">
            <Skeleton className="h-32 w-full rounded" />
            <Skeleton className="h-44 w-full rounded" />
            <Skeleton className="h-24 w-full rounded" />
            <Skeleton className="h-52 w-full rounded" />
            <Skeleton className="h-36 w-full rounded" />
            <Skeleton className="h-48 w-full rounded" />
          </div>
        </section>
      </div>
    </main>
  );
}
