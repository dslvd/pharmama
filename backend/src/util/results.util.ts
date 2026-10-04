export type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export type AsyncResult<T, E = string> = Promise<Result<T, E>>;

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// list of results -> result of list, stopping at the first error
export const sequence = <T, E>(
  results: readonly Result<T, E>[],
): Result<readonly T[], E> =>
  results.reduce<Result<readonly T[], E>>(
    (acc, r) => (acc.ok ? (r.ok ? ok([...acc.value, r.value]) : r) : acc),
    ok([]),
  );
