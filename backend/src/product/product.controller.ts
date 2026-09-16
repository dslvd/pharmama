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
import { ProductService } from "./product.service";
import { Product, Role } from "src/generated/prisma/client";
import { CreateProductDto, UpdateProductDto } from "./product.validation";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/auth.decorator";
import { CurrentUser } from "src/auth/decorator/current-user.decorator";
import type { AuthenticatedUser } from "src/auth/types/jwt-payload.type";

@Controller("product")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class ProductController {
  constructor(private prService: ProductService) {}

  @Get()
  @Roles(Role.STAFF, Role.OWNER, Role.ADMIN)
  async getPrList(): Promise<Product[]> {
    return this.prService.getProductList();
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  async createPr(
    @Body() data: CreateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Product> {
    return this.prService.createProduct(data, user.userId);
  }

  @Patch(":id")
  @Roles(Role.OWNER, Role.ADMIN)
  async updatePr(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Product> {
    return this.prService.updateProduct(id, body, user.userId);
  }

  @Delete(":id")
  @Roles(Role.OWNER, Role.ADMIN)
  async deletePr(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Product> {
    return this.prService.deleteProduct(id, user.userId);
  }
}
