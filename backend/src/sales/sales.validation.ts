import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export type Period = "Today" | "Week" | "Month" | "Year";

export class SalesPoint {
  @IsString() @IsNotEmpty() label!: string;
  @IsInt() @IsPositive() value!: number;
}
