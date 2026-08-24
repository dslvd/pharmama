import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Category,
  Prisma,
  Product,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import {
  CreateProductDto,
  UpdateProductDto,
  validateProductExists,
} from "./validation";
import { createAuditLog } from "src/audit-log/audit-log.util";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProduct(id: number): Promise<Product> {
    const found = await this.prisma.product.findUnique({ where: { id } });

    const result = validateProductExists(found);
    if (!result.ok) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  async getProductList(filter: {
    category?: Category;
    order?: Prisma.SortOrder;
  }): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        ...(filter.category && { category: filter.category }),
      },
      orderBy: { createdAt: filter.order ?? "desc" },
    });
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return this.prisma.$transaction(async (pr) => {
      const product = await pr.product.create({ data });

      await createAuditLog(pr, {
        entity: AuditEntity.PRODUCT,
        entityId: product.id,
        action: AuditAction.CREATE,
      });

      return product;
    });
  }

  async updateProduct(id: number, body: UpdateProductDto): Promise<Product> {
    return this.prisma.$transaction(async (pr) => {
      const existing = await pr.product.findUnique({
        where: { id },
      });
      const result = validateProductExists(existing);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      const product = await pr.product.update({
        where: { id },
        data: {
          ...body,
        },
      });

      const changedKeys = Object.keys(body) as (keyof UpdateProductDto)[];
      const changes = getChangedFields(result.value, product, changedKeys);

      await createAuditLog(pr, {
        entity: AuditEntity.PRODUCT,
        entityId: id,
        action: AuditAction.UPDATE,
        changes: changes,
      });

      return product;
    });
  }

  async deleteProduct(id: number): Promise<Product> {
    return this.prisma.$transaction(async (pr) => {
      const existing = await pr.product.findUnique({
        where: { id },
      });
      const result = validateProductExists(existing);
      if (!result.ok) {
        throw new NotFoundException(result.error);
      }

      await createAuditLog(pr, {
        entity: AuditEntity.PRODUCT,
        entityId: id,
        action: AuditAction.DELETE,
      });
      return pr.product.delete({ where: { id } });
    });
  }

  async searchProducts(query: string): Promise<Product[]> {
    const categoryMatch = Object.values(Category).includes(query as Category)
      ? (query as Category)
      : undefined;

    return this.prisma.product.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { genericName: { contains: query, mode: "insensitive" } },
              ...(categoryMatch ? [{ category: categoryMatch }] : []),
            ],
          }
        : {},
    });
  }
}

function getChangedFields(
  existing: Product,
  updated: Product,
  changedKeys: (keyof UpdateProductDto)[],
): { old: Record<string, unknown>; new: Record<string, unknown> } {
  return {
    old: Object.fromEntries(changedKeys.map((key) => [key, existing[key]])),
    new: Object.fromEntries(changedKeys.map((key) => [key, updated[key]])),
  };
}
