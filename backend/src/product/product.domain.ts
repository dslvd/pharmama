// Pure product rules: no database, no Nest.
import { conflict, DomainError } from "src/util/domain-error";
import { err, ok, Result } from "src/util/results.util";

// a product can only be deleted once nothing refers to it
export const ensureDeletable = (usage: {
  readonly soldCount: number;
  readonly stockCount: number;
}): Result<true, DomainError> => {
  if (usage.soldCount > 0) {
    return err(
      conflict("This product has sales records and can't be deleted."),
    );
  }
  if (usage.stockCount > 0) {
    return err(
      conflict("This product still has stock batches. Delete them first."),
    );
  }
  return ok(true);
};
