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
  notFound,
  runInTransaction,
} from "src/util/domain-error.util";
import {
  andThenAsync,
  AsyncResult,
  fromNullable,
  map,
  ok,
  tapAsync,
} from "src/util/results.util";

type Tx = Prisma.TransactionClient;

// ---- effects ---------------------------------------------------------------

const loadProduct = (tx: Tx, id: number) =>
  tx.product
    .findUnique({ where: { id } })
    .then(fromNullable(notFound("Product not found.")));

const loadUsage = async (tx: Tx, id: number) => ({
  soldCount: await tx.transactionItem.count({ where: { productId: id } }),
  stockCount: await tx.stock.count({ where: { productId: id } }),
});

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

// ---- service ---------------------------------------------------------------

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  getProductList(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  createProduct(
    data: CreateProductDto,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      tx.product
        .create({ data })
        .then(
          tapAsync((product) =>
            audit(tx, handledBy, product.id, AuditAction.CREATE),
          ),
        ),
    );
  }

  updateProduct(
    id: number,
    body: UpdateProductDto,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadProduct(tx, id).then(
        andThenAsync((existing) =>
          tx.product
            .update({ where: { id }, data: body })
            .then(
              tapAsync((updated) =>
                audit(
                  tx,
                  handledBy,
                  id,
                  AuditAction.UPDATE,
                  diffFields(Object.keys(body) as (keyof UpdateProductDto)[])(
                    existing,
                    updated,
                  ),
                ),
              ),
            ),
        ),
      ),
    );
  }

  deleteProduct(
    id: number,
    handledBy: number,
  ): AsyncResult<Product, DomainError> {
    return runInTransaction(this.prisma, (tx) =>
      loadProduct(tx, id)
        .then(
          andThenAsync((existing) =>
            loadUsage(tx, id)
              .then(ensureDeletable)
              .then(map(() => existing)),
          ),
        )
        .then(
          andThenAsync(
            tapAsync(() => audit(tx, handledBy, id, AuditAction.DELETE)),
          ),
        )
        .then(
          andThenAsync(() => tx.product.delete({ where: { id } }).then(ok)),
        ),
    );
  }
}
