'use client'

import { useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

type Period = "Today" | "Week" | "Month" | "Year"

const PERIODS: Period[] = ["Today", "Week", "Month", "Year"]

// TODO: replace with real sales data from the API, keyed by period
const MOCK_DATA: Record<Period, { label: string; value: number }[]> = {
  Today: [
    { label: "6AM", value: 0 },
    { label: "9AM", value: 1200 },
    { label: "12PM", value: 3400 },
    { label: "3PM", value: 5100 },
    { label: "6PM", value: 8300 },
    { label: "9PM", value: 12500 },
  ],
  Week: [
    { label: "Mon", value: 8200 },
    { label: "Tue", value: 9600 },
    { label: "Wed", value: 7400 },
    { label: "Thu", value: 11200 },
    { label: "Fri", value: 15800 },
    { label: "Sat", value: 18300 },
    { label: "Sun", value: 12500 },
  ],
  Month: [
    { label: "Wk 1", value: 42000 },
    { label: "Wk 2", value: 51000 },
    { label: "Wk 3", value: 38000 },
    { label: "Wk 4", value: 60500 },
  ],
  Year: [
    { label: "Jan", value: 180000 },
    { label: "Feb", value: 165000 },
    { label: "Mar", value: 210000 },
    { label: "Apr", value: 198000 },
    { label: "May", value: 225000 },
    { label: "Jun", value: 240000 },
  ],
}

export default function SalesOverview() {
  const [period, setPeriod] = useState<Period>("Today")
  const data = useMemo(() => MOCK_DATA[period], [period])

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
            <TrendingUp className="h-4 w-4" />
          </span>
          <h3 className="text-lg font-semibold text-foreground">Sales Overview</h3>
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

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
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
              formatter={(value: number) => [`₱${value.toLocaleString()}`, "Sales"]}
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
      </div>
    </section>
  )
}