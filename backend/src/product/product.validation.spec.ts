import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { CreateProductDto } from "./product.validation";

const priceErrors = (price: unknown) =>
  validateSync(
    plainToInstance(CreateProductDto, {
      name: "Biogesic",
      genericName: "Paracetamol",
      category: "ANALGESICS",
      price,
    }),
  ).filter((e) => e.property === "price");

describe("CreateProductDto price", () => {
  it("accepts a normal price and the column's max", () => {
    expect(priceErrors(12.5)).toHaveLength(0);
    expect(priceErrors(99999999.99)).toHaveLength(0);
  });

  it("rejects a price over the column's max", () => {
    expect(priceErrors(100000000)).not.toHaveLength(0);
  });

  it("rejects more than 2 decimal places", () => {
    expect(priceErrors(1.999)).not.toHaveLength(0);
  });
});
