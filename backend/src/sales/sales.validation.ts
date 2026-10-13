import { IsIn, IsOptional } from "class-validator";

const PERIODS = ["Today", "Week", "Month", "Year"] as const;
export type Period = (typeof PERIODS)[number];

export class SalesOverviewQuery {
  @IsOptional()
  @IsIn(PERIODS, { message: `period must be one of: ${PERIODS.join(", ")}` })
  period: Period = "Today";
}

// one bar on the dashboard sales chart
export interface SalesPoint {
  label: string;
  value: number;
}
