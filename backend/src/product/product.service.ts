import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Product,
} from "src/generated/prisma/client";
import { ProductCreateInput } from "src/generated/prisma/models";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProduct(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductList(filter: {
    category?: string;
    order?: Prisma.SortOrder;
  }): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        ...(filter.category && { category: filter.category }),
      },
      orderBy: { createdAt: filter.order ?? "desc" },
    });
  }

  async createProduct(data: ProductCreateInput): Promise<Product> {
    return this.prisma.$transaction(async (pr) => {
      const product = await pr.product.create({ data: data });

      await pr.auditLog.create({
        data: {
          entity: AuditEntity.PRODUCT,
          entityId: product.id,
          action: AuditAction.CREATE,
        },
      });

      return product;
    });
  }

  async updateProduct(id: number, body: UpdateProductDto): Promise<Product> {
    return this.prisma.$transaction(async (pr) => {
      const existing = await pr.product.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Product ${id} not found.`);
      }

      const product = await pr.product.update({
        where: { id },
        data: {
          ...body,
        },
      });

      const changedKeys = Object.keys(body) as (keyof UpdateProductDto)[];

      const old: Record<string, unknown> = {};
      const updated: Record<string, unknown> = {};

      for (const key of changedKeys) {
        old[key] = existing[key];
        updated[key] = product[key];
      }

      await pr.auditLog.create({
        data: {
          entity: AuditEntity.PRODUCT,
          entityId: id,
          action: AuditAction.UPDATE,
          changes: {
            old,
            new: updated,
          } as Prisma.InputJsonValue,
        },
      });

      return product;
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { genericName: { contains: query, mode: "insensitive" } },
              { category: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
    });
  }
}

export class UpdateProductDto {
  name?: string;
  genericName?: string;
  category?: string;
  price?: number;
}
