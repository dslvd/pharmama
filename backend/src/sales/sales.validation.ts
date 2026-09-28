import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export const PERIODS = ["Today", "Week", "Month", "Year"] as const;
export type Period = (typeof PERIODS)[number];

export class SalesOverviewQuery {
  @IsOptional()
  @IsIn(PERIODS, { message: `period must be one of: ${PERIODS.join(", ")}` })
  period: Period = "Today";
}

export class SalesPoint {
  @IsString() @IsNotEmpty() label!: string;
  @IsInt() @IsPositive() value!: number;
}
