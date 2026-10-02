import { useMemo, useState } from "react";
import { Minus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Transaction } from "@/lib/types/transaction";
import { peso } from "@/lib/utils/format";

// YYYY-MM-DD in Manila time, so "today" matches the pharmacy's day
const manilaDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila" });
const DAY_MS = 24 * 60 * 60 * 1000;

export default function SalesCard({
  transactions,
}: {
  transactions: Transaction[] | null;
}) {
  // fixed at mount; the dashboard refetches on reload anyway
  const [now] = useState(() => Date.now());

  const { today, yesterday } = useMemo(() => {
    const todayKey = manilaDay.format(now);
    const yesterdayKey = manilaDay.format(now - DAY_MS);
    let today = 0;
    let yesterday = 0;

    for (const t of transactions ?? []) {
      if (t.status !== "COMPLETED") continue;
      const key = manilaDay.format(new Date(t.createdAt));
      if (key === todayKey) today += t.totalAmount;
      else if (key === yesterdayKey) yesterday += t.totalAmount;
    }
    return { today, yesterday };
  }, [transactions, now]);

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
          <Wallet className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Today&apos;s sales</p>
      <p className="mt-3 text-3xl font-bold text-foreground">
        {transactions === null ? "—" : peso(today)}
      </p>
      {transactions !== null && <Delta today={today} yesterday={yesterday} />}
    </article>
  );
}

function Delta({ today, yesterday }: { today: number; yesterday: number }) {
  if (yesterday === 0) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">No sales yesterday</p>
    );
  }

  const pct = Math.round(((today - yesterday) / yesterday) * 100);
  const [Icon, color, sign] =
    pct > 0
      ? [TrendingUp, "text-emerald-600", "+"]
      : pct < 0
        ? [TrendingDown, "text-rose-600", ""]
        : [Minus, "text-muted-foreground", ""];

  return (
    <div className={`mt-2 flex items-center gap-1 ${color}`}>
      <Icon className="h-4 w-4" />
      <span className="text-xs font-medium">
        {sign}
        {pct}% vs. yesterday
      </span>
    </div>
  );
}
