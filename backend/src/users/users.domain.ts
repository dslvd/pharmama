// Pure user rules: no database, no Nest, no hashing.
import { conflict, DomainError } from "src/util/domain-error";
import { err, ok, Result } from "src/util/results.util";

export const ensureEmailFree = (
  existing: unknown | null,
): Result<true, DomainError> =>
  existing ? err(conflict("Email already in use.")) : ok(true);

// drop the password hash before a user leaves the service
export const toSafeUser = <T extends { hashedPassword: string }>({
  hashedPassword: _,
  ...safe
}: T): Omit<T, "hashedPassword"> => safe;
