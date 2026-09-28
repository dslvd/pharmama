import { Product } from "../types/product";
import { Stock } from "../types/stock";
import { Transaction } from "../types/transaction";
import { Result } from "./errorHandling";

// Prisma sends Decimal columns as strings in JSON; convert them to numbers
// so the frontend types (and toLocaleString formatting) hold.

export const mapResult = <T, U>(r: Result<T>, fn: (v: T) => U): Result<U> =>
  r.ok ? { ok: true, value: fn(r.value) } : r;

export const toProduct = (p: Product): Product => ({
  ...p,
  price: Number(p.price),
});

export const toStock = (s: Stock): Stock => ({
  ...s,
  product: s.product && toProduct(s.product),
});

export const toTransaction = (t: Transaction): Transaction => ({
  ...t,
  totalAmount: Number(t.totalAmount),
  transactionItems: t.transactionItems?.map((item) => ({
    ...item,
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal),
    product: item.product && toProduct(item.product),
  })),
});
