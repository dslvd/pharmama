import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { StockService } from "./stock.service";
import { Prisma, Stock } from "src/generated/prisma/client";
import { CreateStockDto } from "./validation";

@Controller("stock")
export class StockController {
  constructor(private stService: StockService) {}

  @Get("search")
  async searchSt(@Query("query") query: string): Promise<Stock[]> {
    return this.stService.searchStock(query);
  }

  @Get(":id")
  async getSt(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Prisma.StockGetPayload<{ include: { product: true } }>> {
    return this.stService.getStock(id);
  }

  @Get()
  async getStList(
    @Query("sortBy") sortBy?: "quantity" | "expiryDate" | "createdAt",
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<Stock[]> {
    return this.stService.getStockList({ sortBy, order });
  }

  @Post()
  async createSt(@Body() data: CreateStockDto): Promise<Stock> {
    return this.stService.createStock(data);
  }
}
