// Pure transaction rules: no database, no Nest, no clock.
// The service loads data, passes it through these functions, then writes.
import { Prisma } from "src/generated/prisma/client";
import { AuditAction, TransactionStatus } from "src/generated/prisma/enums";
import { conflict, DomainError, invalid } from "src/util/domain-error";
import { err, ok, Result, sequence } from "src/util/results.util";

export interface ItemInput {
  readonly stockId: number;
  readonly quantity: number;
}

export interface StockRow {
  readonly id: number;
  readonly quantity: number;
  readonly expiryDate: Date;
  readonly batchNumber: string;
  readonly productId: number;
  readonly product: { readonly name: string; readonly price: Prisma.Decimal };
}

export interface LineItem {
  readonly productId: number;
  readonly stockId: number;
  readonly quantity: number;
  readonly unitPrice: Prisma.Decimal;
  readonly subtotal: Prisma.Decimal;
}

// combine repeated stockIds so each batch is checked and reserved once
export const mergeItems = (items: readonly ItemInput[]): readonly ItemInput[] =>
  items.reduce<readonly ItemInput[]>(
    (merged, item) =>
      merged.some((m) => m.stockId === item.stockId)
        ? merged.map((m) =>
            m.stockId === item.stockId
              ? { ...m, quantity: m.quantity + item.quantity }
              : m,
          )
        : [...merged, item],
    [],
  );

const batchLabel = (stock: StockRow) =>
  `${stock.product.name} (batch ${stock.batchNumber})`;

// one item against its batch; price always comes from the product
export const priceItem =
  (now: Date) =>
  (
    stock: StockRow | undefined,
    item: ItemInput,
  ): Result<LineItem, DomainError> => {
    if (!stock) {
      return err(invalid(`Stock batch ${item.stockId} not found.`));
    }
    if (stock.expiryDate <= now) {
      return err(invalid(`${batchLabel(stock)} is expired and can't be sold.`));
    }
    if (stock.quantity < item.quantity) {
      return err(
        invalid(
          `Not enough stock for ${batchLabel(stock)}: requested ${item.quantity}, only ${stock.quantity} left.`,
        ),
      );
    }
    return ok({
      productId: stock.productId,
      stockId: stock.id,
      quantity: item.quantity,
      unitPrice: stock.product.price,
      subtotal: stock.product.price.mul(item.quantity),
    });
  };

export const priceItems =
  (now: Date) =>
  (
    stocks: readonly StockRow[],
    items: readonly ItemInput[],
  ): Result<readonly LineItem[], DomainError> =>
    sequence(
      mergeItems(items).map((item) =>
        priceItem(now)(
          stocks.find((s) => s.id === item.stockId),
          item,
        ),
      ),
    );

export const totalOf = (lines: readonly LineItem[]): Prisma.Decimal =>
  lines.reduce((sum, line) => sum.add(line.subtotal), new Prisma.Decimal(0));

// only a completed sale can be cancelled or refunded, and only once
export const transitionStatus = (
  from: TransactionStatus,
  to: TransactionStatus,
): Result<TransactionStatus, DomainError> => {
  if (from !== TransactionStatus.COMPLETED) {
    return err(
      conflict(
        `Cannot change the status of a ${from.toLowerCase()} transaction.`,
      ),
    );
  }
  if (to === TransactionStatus.COMPLETED) {
    return err(invalid("Transaction is already completed."));
  }
  return ok(to);
};

export const auditActionFor = (to: TransactionStatus): AuditAction =>
  to === TransactionStatus.CANCELLED ? AuditAction.CANCEL : AuditAction.UPDATE;

// stock to put back when a sale is cancelled or refunded
export const restockPlan = (
  items: readonly ItemInput[],
): readonly ItemInput[] => mergeItems(items);
