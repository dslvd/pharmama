export type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type AsyncResult<T, E = string> = Promise<Result<T, E>>;

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// transform the value, keep the error
export const map =
  <T, U>(fn: (value: T) => U) =>
  <E>(r: Result<T, E>): Result<U, E> =>
    r.ok ? ok(fn(r.value)) : r;

// transform the error, keep the value
export const mapErr =
  <E, F>(fn: (error: E) => F) =>
  <T>(r: Result<T, E>): Result<T, F> =>
    r.ok ? r : err(fn(r.error));

// chain a step that can fail (a.k.a. flatMap / bind)
export const andThen =
  <T, U, E>(fn: (value: T) => Result<U, E>) =>
  (r: Result<T, E>): Result<U, E> =>
    r.ok ? fn(r.value) : r;

// chain an async step that can fail; use inside `.then(...)`
export const andThenAsync =
  <T, U, E>(fn: (value: T) => AsyncResult<U, E>) =>
  async (r: Result<T, E>): AsyncResult<U, E> =>
    r.ok ? fn(r.value) : r;

// null/undefined becomes the given error
export const fromNullable =
  <E>(error: E) =>
  <T>(value: T | null | undefined): Result<T, E> =>
    value === null || value === undefined ? err(error) : ok(value);

// list of results -> result of list, stopping at the first error
export const sequence = <T, E>(
  results: readonly Result<T, E>[],
): Result<readonly T[], E> =>
  results.reduce<Result<readonly T[], E>>(
    (acc, r) => (acc.ok ? (r.ok ? ok([...acc.value, r.value]) : r) : acc),
    ok([]),
  );

// run async steps one after another over a list, stopping at the first error
export const traverseAsync =
  <T, U, E>(fn: (item: T) => AsyncResult<U, E>) =>
  (items: readonly T[]): AsyncResult<readonly U[], E> =>
    items.reduce<AsyncResult<readonly U[], E>>(
      (acc, item) =>
        acc.then(
          andThenAsync((done) => fn(item).then(map((u) => [...done, u]))),
        ),
      Promise.resolve(ok([])),
    );

// collapse a result into a single value
export const fold =
  <T, E, R>(onOk: (value: T) => R, onErr: (error: E) => R) =>
  (r: Result<T, E>): R =>
    r.ok ? onOk(r.value) : onErr(r.error);
