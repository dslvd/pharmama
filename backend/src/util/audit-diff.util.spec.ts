import { diffFields } from "./audit-diff.util";

describe("diffFields", () => {
  it("picks the given keys from before and after", () => {
    const before = { name: "A", price: 1, category: "X" };
    const after = { name: "B", price: 1, category: "X" };

    expect(diffFields(["name", "price"] as const)(before, after)).toEqual({
      old: { name: "A", price: 1 },
      new: { name: "B", price: 1 },
    });
  });
});
