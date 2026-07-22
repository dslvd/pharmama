import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ProductService, UpdateProductDto } from "./product.service";
import { Prisma, Product } from "src/generated/prisma/client";
import type { ProductCreateInput } from "src/generated/prisma/models";

@Controller("product")
export class ProductController {
  constructor(private prService: ProductService) {}

  @Get("search")
  async searchPr(@Query("query") query: string): Promise<Product[]> {
    return this.prService.searchProducts(query);
  }

  @Get(":id")
  async getPr(@Param("id", ParseIntPipe) id: number): Promise<Product | null> {
    return this.prService.getProduct(id);
  }

  @Get()
  async getPrList(
    @Query("category") category?: string,
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<Product[]> {
    return this.prService.getProductList({ category, order });
  }

  @Post()
  async createPr(@Body() data: ProductCreateInput): Promise<Product> {
    return this.prService.createProduct(data);
  }

  @Patch(":id")
  async updatePr(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.prService.updateProduct(id, body);
  }
}
