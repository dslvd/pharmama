import { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Trend {
  value: number
  label: string
}

interface StatCardProps {
  icon: ReactNode
  iconClassName: string
  label: string
  value: ReactNode
  helperText?: string
  trend?: Trend
  loading?: boolean
}

export default function StatCard({
  icon,
  iconClassName,
  label,
  value,
  helperText,
  trend,
  loading,
}: StatCardProps) {
  const isPositive = trend ? trend.value >= 0 : true

  return (
    <article className="bg-card rounded-lg border border-border p-6 flex flex-col gap-4">
      <div
        className={`h-11 w-11 rounded-lg flex items-center justify-center ${iconClassName}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-muted-foreground text-sm">{label}</p>

        {loading ? (
          <div className="h-9 w-24 mt-2 rounded-md bg-muted animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-primary mt-1 tabular-nums">
            {value}
          </p>
        )}

        {helperText && !loading && (
          <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
        )}
      </div>

      {trend && !loading && (
        <div
          className={`inline-flex w-fit items-center gap-1 text-xs font-medium ${
            isPositive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </article>
  )
}