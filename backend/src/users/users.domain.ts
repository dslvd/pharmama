// user rules, no database access
import { conflict, DomainError } from "src/util/domain-error";
import { err, ok, Result } from "src/util/results.util";

export const ensureEmailFree = (
  existing: unknown | null,
): Result<true, DomainError> =>
  existing ? err(conflict("Email already in use.")) : ok(true);

// removes the password hash before a user is sent out
export const toSafeUser = <T extends { hashedPassword: string }>({
  hashedPassword: _,
  ...safe
}: T): Omit<T, "hashedPassword"> => safe;
