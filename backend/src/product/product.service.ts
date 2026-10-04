import { Injectable } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  Prisma,
  Product,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductDto, UpdateProductDto } from "./product.validation";
import { ensureDeletable } from "./product.domain";
import { createAuditLog } from "src/util/audit-log.util";
import { diffFields } from "src/util/audit-diff.util";
import {
  DomainError,
  DomainException,
  notFound,
} from "src/util/domain-error.util";
import { AsyncResult, err, ok } from "src/util/results.util";

type Tx = Prisma.TransactionClient;

const audit = (
  tx: Tx,
  user: number,
  entityId: number,
  action: AuditAction,
  changes?: { old: unknown; new: unknown },
) =>
  createAuditLog(tx, {
    user,
    entity: AuditEntity.PRODUCT,
    entityId,
    action,
    changes,
  });

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  getProductList(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async createProduct(
    data: CreateProductDto,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    const product = await this.prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data });
      await audit(tx, handledBy, created.id, AuditAction.CREATE);
      return created;
    });
    return ok(product);
  }

  async updateProduct(
    id: number,
    body: UpdateProductDto,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    try {
      const product = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.product.findUnique({ where: { id } });
        if (!existing) {
          throw new DomainException(notFound("Product not found."));
        }

        const updated = await tx.product.update({ where: { id }, data: body });
        const changedKeys = Object.keys(body) as (keyof UpdateProductDto)[];
        await audit(
          tx,
          handledBy,
          id,
          AuditAction.UPDATE,
          diffFields(changedKeys)(existing, updated),
        );
        return updated;
      });
      return ok(product);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }

  async deleteProduct(
    id: number,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    try {
      const product = await this.prisma.$transaction(async (tx) => {
        const existing = await tx.product.findUnique({ where: { id } });
        if (!existing) {
          throw new DomainException(notFound("Product not found."));
        }

        const deletable = ensureDeletable({
          soldCount: await tx.transactionItem.count({
            where: { productId: id },
          }),
          stockCount: await tx.stock.count({ where: { productId: id } }),
        });
        if (!deletable.ok) throw new DomainException(deletable.error);

        await audit(tx, handledBy, id, AuditAction.DELETE);
        return tx.product.delete({ where: { id } });
      });
      return ok(product);
    } catch (e) {
      if (e instanceof DomainException) return err(e.error);
      throw e;
    }
  }
}
