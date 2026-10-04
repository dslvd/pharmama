import { toSalesPoints } from "./sales.domain";

describe("sales.domain", () => {
  it("keeps the labels and converts totals to numbers", () => {
    const rows = [
      { label: "Wk 1", total: "150.50" },
      { label: "Wk 2", total: 0 },
    ];
    expect(toSalesPoints(rows)).toEqual([
      { label: "Wk 1", value: 150.5 },
      { label: "Wk 2", value: 0 },
    ]);
  });
});
