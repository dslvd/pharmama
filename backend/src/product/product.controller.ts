import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "src/generated/prisma/client";
import { CreateProductDto, UpdateProductDto } from "./validation";

@Controller("product")
export class ProductController {
  constructor(private prService: ProductService) {}

  @Get(":id")
  async getPr(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return this.prService.getProduct(id);
  }

  @Get()
  async getPrList(): Promise<Product[]> {
    return this.prService.getProductList();
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