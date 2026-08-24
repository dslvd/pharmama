import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Category, Prisma, Product } from "src/generated/prisma/client";
import { CreateProductDto, UpdateProductDto } from "./validation";

@Controller("product")
export class ProductController {
  constructor(private prService: ProductService) {}

  @Get("search")
  async searchPr(@Query("query") query: string): Promise<Product[]> {
    return this.prService.searchProducts(query);
  }

  @Get(":id")
  async getPr(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return this.prService.getProduct(id);
  }

  @Get()
  async getPrList(
    @Query("category") category?: Category,
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<Product[]> {
    return this.prService.getProductList({ category, order });
  }

  @Post()
  async createPr(@Body() data: CreateProductDto): Promise<Product> {
    return this.prService.createProduct(data);
  }

  @Patch(":id")
  async updatePr(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ): Promise<Product> {
    return this.prService.updateProduct(id, body);
  }

  @Delete(":id")
  async deletePr(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return this.prService.deleteProduct(id);
  }
}
