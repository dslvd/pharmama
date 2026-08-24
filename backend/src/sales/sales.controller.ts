// sales.controller.ts
import { Controller, Get, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get("overview")
  getOverview(
    @Query("period") period: "Today" | "Week" | "Month" | "Year" = "Today",
  ) {
    return this.salesService.getSalesOverview(period);
  }
}
