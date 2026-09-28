import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { StockService } from "./stock.service";
import { Role, Stock } from "src/generated/prisma/client";
import {
  CreateStockDto,
  StockWithProduct,
  UpdateStockDto,
} from "./stock.validation";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/auth/decorator/auth.decorator";
import type { AuthenticatedUser } from "src/auth/types/jwt-payload.type";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import { unwrap } from "src/util/domain-error.util";

@Controller("stock")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class StockController {
  constructor(private stService: StockService) {}

  @Get()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async getStList(): Promise<StockWithProduct[]> {
    return this.stService.getStockList();
  }

  @Post()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async createSt(
    @Body() data: CreateStockDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Stock> {
    return unwrap(await this.stService.createStock(data, user.id));
  }

  @Patch(":id")
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async updateSt(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateStockDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Stock> {
    return unwrap(await this.stService.updateStock(id, body, user.id));
  }

  @Delete(":id")
  @Roles(Role.OWNER, Role.ADMIN)
  async deleteSt(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Stock> {
    return unwrap(await this.stService.deleteStock(id, user.id));
  }
}
