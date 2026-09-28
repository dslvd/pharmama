import { bucketFor, toSalesPoints } from "./sales.domain";

describe("sales.domain", () => {
  it("maps each period to its chart bucket", () => {
    expect(bucketFor).toEqual({
      Today: "hour",
      Week: "day",
      Month: "week",
      Year: "month",
    });
  });

  it("converts totals to numbers and numbers weeks in order", () => {
    const rows = [
      { bucket: new Date(2026, 8, 7), total: "150.50" },
      { bucket: new Date(2026, 8, 14), total: "20" },
    ];
    expect(toSalesPoints("Month")(rows)).toEqual([
      { label: "Wk 1", value: 150.5 },
      { label: "Wk 2", value: 20 },
    ]);
  });

  it("labels months by short name", () => {
    const [point] = toSalesPoints("Year")([
      { bucket: new Date(2026, 0, 1), total: 5 },
    ]);
    expect(point).toEqual({ label: "Jan", value: 5 });
  });
});
