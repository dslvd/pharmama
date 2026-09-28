import {
  andThen,
  andThenAsync,
  err,
  fold,
  fromNullable,
  map,
  mapErr,
  ok,
  Result,
  sequence,
  traverseAsync,
} from "./results.util";

const half = (n: number): Result<number> =>
  n % 2 === 0 ? ok(n / 2) : err(`${n} is odd`);

describe("results.util", () => {
  it("map transforms ok values and passes errors through", () => {
    expect(map((n: number) => n + 1)(ok(1))).toEqual(ok(2));
    expect(map((n: number) => n + 1)(err("boom"))).toEqual(err("boom"));
  });

  it("mapErr transforms errors and passes values through", () => {
    expect(mapErr((e: string) => e.length)(err("boom"))).toEqual(err(4));
    expect(mapErr((e: string) => e.length)(ok(1))).toEqual(ok(1));
  });

  it("andThen chains steps that can fail", () => {
    expect(andThen(half)(ok(8))).toEqual(ok(4));
    expect(andThen(half)(ok(3))).toEqual(err("3 is odd"));
    expect(andThen(half)(err("earlier"))).toEqual(err("earlier"));
  });

  it("andThenAsync chains async steps", async () => {
    const asyncHalf = (n: number) => Promise.resolve(half(n));
    await expect(andThenAsync(asyncHalf)(ok(8))).resolves.toEqual(ok(4));
    await expect(andThenAsync(asyncHalf)(err("earlier"))).resolves.toEqual(
      err("earlier"),
    );
  });

  it("fromNullable turns missing values into errors", () => {
    expect(fromNullable("missing")(0)).toEqual(ok(0));
    expect(fromNullable("missing")(null)).toEqual(err("missing"));
    expect(fromNullable("missing")(undefined)).toEqual(err("missing"));
  });

  it("sequence collects values or returns the first error", () => {
    expect(sequence([ok(1), ok(2)])).toEqual(ok([1, 2]));
    expect(sequence([ok(1), err("a"), err("b")])).toEqual(err("a"));
    expect(sequence([])).toEqual(ok([]));
  });

  it("traverseAsync runs steps in order and stops at the first error", async () => {
    const seen: number[] = [];
    const step = (n: number) => {
      seen.push(n);
      return Promise.resolve(half(n));
    };

    await expect(traverseAsync(step)([2, 4])).resolves.toEqual(ok([1, 2]));
    seen.length = 0;
    await expect(traverseAsync(step)([2, 3, 4])).resolves.toEqual(
      err("3 is odd"),
    );
    expect(seen).toEqual([2, 3]);
  });

  it("fold collapses a result into one value", () => {
    const show = fold(
      (n: number) => `ok ${n}`,
      (e: string) => `err ${e}`,
    );
    expect(show(ok(1))).toBe("ok 1");
    expect(show(err("x"))).toBe("err x");
  });
});
