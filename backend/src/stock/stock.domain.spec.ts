import {
  ensureBatchIsNew,
  ensureCanAdjustQuantity,
  ensureDeletable,
  parseExpiryDate,
  toStockData,
  toStockPatch,
} from "./stock.domain";

const now = new Date("2026-09-28T00:00:00Z");

describe("stock.domain", () => {
  describe("parseExpiryDate", () => {
    it("accepts a future date", () => {
      expect(parseExpiryDate(now)("2027-01-01")).toEqual({
        ok: true,
        value: new Date("2027-01-01"),
      });
    });

    it("rejects a past date and garbage", () => {
      const past = parseExpiryDate(now)("2026-01-01");
      const junk = parseExpiryDate(now)("not a date");
      expect(!past.ok && past.error.message).toBe(
        "Expiry date must be in the future.",
      );
      expect(!junk.ok && junk.error.message).toBe("Invalid expiry date.");
    });
  });

  it("toStockData converts the expiry date", () => {
    const r = toStockData(now)({
      productId: 1,
      batchNumber: "B1",
      quantity: 5,
      expiryDate: "2027-01-01",
    });
    expect(r.ok && r.value.expiryDate).toEqual(new Date("2027-01-01"));
  });

  it("toStockPatch leaves the expiry date alone when not changing it", () => {
    expect(toStockPatch(now)({ quantity: 3 })).toEqual({
      ok: true,
      value: { quantity: 3 },
    });
  });

  describe("ensureBatchIsNew", () => {
    it("allows a new batch or the batch being edited", () => {
      expect(ensureBatchIsNew("B1", undefined).ok).toBe(true);
      expect(ensureBatchIsNew("B1", 4, 4).ok).toBe(true);
    });

    it("rejects a batch number another stock already uses", () => {
      const r = ensureBatchIsNew("B1", 4, 7);
      expect(!r.ok && r.error).toEqual({
        kind: "Conflict",
        message: "Batch B1 already exists for this product.",
      });
    });
  });

  it("ensureDeletable blocks batches with sales", () => {
    expect(ensureDeletable(0).ok).toBe(true);
    expect(ensureDeletable(2).ok).toBe(false);
  });

  describe("ensureCanAdjustQuantity", () => {
    it("lets staff resend the same quantity or leave it out", () => {
      expect(ensureCanAdjustQuantity(10, 10, false).ok).toBe(true);
      expect(ensureCanAdjustQuantity(10, undefined, false).ok).toBe(true);
    });

    it("stops staff from changing the quantity", () => {
      expect(ensureCanAdjustQuantity(10, 7, false)).toEqual({
        ok: false,
        error: {
          kind: "Forbidden",
          message: "Only an owner can change stock quantity.",
        },
      });
    });

    it("lets owners and admins change the quantity", () => {
      expect(ensureCanAdjustQuantity(10, 7, true).ok).toBe(true);
    });
  });
});
