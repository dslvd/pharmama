import { Prisma } from "src/generated/prisma/client";
import { AuditAction, TransactionStatus } from "src/generated/prisma/enums";
import {
  auditActionFor,
  mergeItems,
  priceItems,
  StockRow,
  totalOf,
  transitionStatus,
} from "./transaction.domain";

const now = new Date("2026-09-28T00:00:00Z");

const stock = (overrides: Partial<StockRow> = {}): StockRow => ({
  id: 1,
  quantity: 10,
  expiryDate: new Date("2027-01-01T00:00:00Z"),
  batchNumber: "B1",
  productId: 100,
  product: { name: "Biogesic", price: new Prisma.Decimal("12.50") },
  ...overrides,
});

describe("transaction.domain", () => {
  describe("mergeItems", () => {
    it("combines quantities for the same batch", () => {
      expect(
        mergeItems([
          { stockId: 1, quantity: 2 },
          { stockId: 2, quantity: 1 },
          { stockId: 1, quantity: 3 },
        ]),
      ).toEqual([
        { stockId: 1, quantity: 5 },
        { stockId: 2, quantity: 1 },
      ]);
    });
  });

  describe("priceItems", () => {
    it("prices lines from the product, not the request", () => {
      const r = priceItems(now)([stock()], [{ stockId: 1, quantity: 2 }]);

      expect(r.ok).toBe(true);
      if (!r.ok) return;
      expect(r.value).toHaveLength(1);
      expect(r.value[0]).toMatchObject({
        productId: 100,
        stockId: 1,
        quantity: 2,
      });
      expect(r.value[0].unitPrice.toString()).toBe("12.5");
      expect(r.value[0].subtotal.toString()).toBe("25");
    });

    it("rejects a missing batch", () => {
      const r = priceItems(now)([], [{ stockId: 9, quantity: 1 }]);
      expect(r).toEqual({
        ok: false,
        error: { kind: "Invalid", message: "Stock batch 9 not found." },
      });
    });

    it("rejects an expired batch", () => {
      const r = priceItems(now)(
        [stock({ expiryDate: new Date("2026-09-01T00:00:00Z") })],
        [{ stockId: 1, quantity: 1 }],
      );
      expect(!r.ok && r.error.message).toBe(
        "Biogesic (batch B1) is expired and can't be sold.",
      );
    });

    it("checks the merged quantity when a batch appears twice", () => {
      const r = priceItems(now)(
        [stock({ quantity: 4 })],
        [
          { stockId: 1, quantity: 3 },
          { stockId: 1, quantity: 2 },
        ],
      );
      expect(!r.ok && r.error.message).toBe(
        "Not enough stock for Biogesic (batch B1): requested 5, only 4 left.",
      );
    });
  });

  describe("totalOf", () => {
    it("adds subtotals without floating point drift", () => {
      const r = priceItems(now)(
        [
          stock({ product: { name: "A", price: new Prisma.Decimal("0.1") } }),
          stock({
            id: 2,
            product: { name: "B", price: new Prisma.Decimal("0.2") },
          }),
        ],
        [
          { stockId: 1, quantity: 1 },
          { stockId: 2, quantity: 1 },
        ],
      );
      expect(r.ok && totalOf(r.value).toString()).toBe("0.3");
    });
  });

  describe("transitionStatus", () => {
    it("allows cancelling or refunding a completed sale", () => {
      expect(
        transitionStatus(
          TransactionStatus.COMPLETED,
          TransactionStatus.CANCELLED,
        ),
      ).toEqual({ ok: true, value: TransactionStatus.CANCELLED });
      expect(
        transitionStatus(
          TransactionStatus.COMPLETED,
          TransactionStatus.REFUNDED,
        ),
      ).toEqual({ ok: true, value: TransactionStatus.REFUNDED });
    });

    it("refuses to change a refunded sale, so stock isn't restored twice", () => {
      const r = transitionStatus(
        TransactionStatus.REFUNDED,
        TransactionStatus.CANCELLED,
      );
      expect(!r.ok && r.error.kind).toBe("Conflict");
    });

    it("refuses completing an already completed sale", () => {
      const r = transitionStatus(
        TransactionStatus.COMPLETED,
        TransactionStatus.COMPLETED,
      );
      expect(!r.ok && r.error.kind).toBe("Invalid");
    });
  });

  it("audits cancels as CANCEL and refunds as UPDATE", () => {
    expect(auditActionFor(TransactionStatus.CANCELLED)).toBe(
      AuditAction.CANCEL,
    );
    expect(auditActionFor(TransactionStatus.REFUNDED)).toBe(AuditAction.UPDATE);
  });
});
