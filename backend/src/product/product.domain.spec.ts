import { ensureDeletable } from "./product.domain";

describe("product.domain", () => {
  it("allows deleting an unused product", () => {
    expect(ensureDeletable({ soldCount: 0, stockCount: 0 }).ok).toBe(true);
  });

  it("blocks deleting a product with sales, before checking stock", () => {
    const r = ensureDeletable({ soldCount: 1, stockCount: 3 });
    expect(!r.ok && r.error.message).toBe(
      "This product has sales records and can't be deleted.",
    );
  });

  it("blocks deleting a product that still has stock", () => {
    const r = ensureDeletable({ soldCount: 0, stockCount: 2 });
    expect(!r.ok && r.error.kind).toBe("Conflict");
  });
});
