"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { getSalesOverview } from "@/lib/api/sales";
import { ErrorStack } from "@/components/ErrorCard";

type Period = "Today" | "Week" | "Month" | "Year";

const PERIODS: Period[] = ["Today", "Week", "Month", "Year"];

export default function SalesOverview() {
  const [period, setPeriod] = useState<Period>("Today");
  const [sales, setSales] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([]);

  const addError = (message: string) =>
    setErrors((prev) => [...prev, { id: crypto.randomUUID(), message }]);

  useEffect(() => {
    let cancelled = false;

    async function fetchSales() {
      setLoading(true);

      const result = await getSalesOverview(period);

      if (cancelled) return;

      if (result.ok) {
        setSales(result.value);
      } else {
        addError(result.error);
      }

      setLoading(false);
    }

    fetchSales();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <section className="flex flex-1 flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
            <TrendingUp className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-foreground">
            Sales Overview
          </h3>
        </div>

        <div className="flex rounded-lg border border-border bg-muted p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 min-h-64 flex-1 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm">
            loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={sales}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v: number) => `₱${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `₱${value.toLocaleString()}`,
                  "Sales",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <ErrorStack errors={errors} />
    </section>
  );
}
