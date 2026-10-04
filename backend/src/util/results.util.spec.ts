import { err, ok } from "./results.util";

describe("results.util", () => {
  it("ok wraps a value", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
  });

  it("err wraps an error", () => {
    expect(err("boom")).toEqual({ ok: false, error: "boom" });
  });
});
