// Pure: before/after values of the given keys, for audit log `changes`.
export const diffFields =
  <K extends string>(keys: readonly K[]) =>
  <T extends Record<K, unknown>>(
    before: T,
    after: T,
  ): { old: Record<string, unknown>; new: Record<string, unknown> } => ({
    old: Object.fromEntries(keys.map((key) => [key, before[key]])),
    new: Object.fromEntries(keys.map((key) => [key, after[key]])),
  });
