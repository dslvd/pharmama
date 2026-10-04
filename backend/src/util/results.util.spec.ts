import { err, ok, sequence } from "./results.util";

describe("results.util", () => {
  it("ok wraps a value", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
  });

  it("err wraps an error", () => {
    expect(err("boom")).toEqual({ ok: false, error: "boom" });
  });

  it("sequence collects values or returns the first error", () => {
    expect(sequence([ok(1), ok(2)])).toEqual(ok([1, 2]));
    expect(sequence([ok(1), err("a"), err("b")])).toEqual(err("a"));
    expect(sequence([])).toEqual(ok([]));
  });
});
