// sales.controller.ts
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { SalesOverviewQuery } from "./sales.validation";
import { Role } from "src/generated/prisma/enums";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/auth.decorator";

@Controller("sales")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get("overview")
  @Roles(Role.ADMIN, Role.OWNER)
  getOverview(@Query() query: SalesOverviewQuery) {
    return this.salesService.getSalesOverview(query.period);
  }
}
