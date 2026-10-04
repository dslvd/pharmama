// Pure stock rules: no database, no Nest, no clock.
import {
  conflict,
  DomainError,
  forbidden,
  invalid,
} from "src/util/domain-error";
import { err, ok, Result } from "src/util/results.util";

export interface StockInput {
  readonly productId: number;
  readonly batchNumber: string;
  readonly quantity: number;
  readonly expiryDate: string;
}

export interface StockData {
  readonly productId: number;
  readonly batchNumber: string;
  readonly quantity: number;
  readonly expiryDate: Date;
}

export const parseExpiryDate =
  (now: Date) =>
  (value: string): Result<Date, DomainError> => {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      return err(invalid("Invalid expiry date."));
    }
    if (parsed <= now) {
      return err(invalid("Expiry date must be in the future."));
    }
    return ok(parsed);
  };

export const toStockData =
  (now: Date) =>
  (input: StockInput): Result<StockData, DomainError> => {
    const expiry = parseExpiryDate(now)(input.expiryDate);
    if (!expiry.ok) return expiry;
    return ok({ ...input, expiryDate: expiry.value });
  };

// an update only re-validates the expiry date when it's being changed
export const toStockPatch =
  (now: Date) =>
  (input: Partial<StockInput>): Result<Partial<StockData>, DomainError> => {
    const { expiryDate, ...rest } = input;
    if (expiryDate === undefined) return ok(rest);

    const expiry = parseExpiryDate(now)(expiryDate);
    if (!expiry.ok) return expiry;
    return ok({ ...rest, expiryDate: expiry.value });
  };

export const ensureBatchIsNew = (
  batchNumber: string,
  existingId: number | undefined,
  selfId?: number,
): Result<true, DomainError> =>
  existingId === undefined || existingId === selfId
    ? ok(true)
    : err(conflict(`Batch ${batchNumber} already exists for this product.`));

export const ensureDeletable = (
  soldCount: number,
): Result<true, DomainError> =>
  soldCount > 0
    ? err(conflict("This stock batch has sales records and can't be deleted."))
    : ok(true);

// only owners/admins can change how many units a batch has
export const ensureCanAdjustQuantity = (
  currentQty: number,
  newQty: number | undefined,
  isManager: boolean,
): Result<true, DomainError> =>
  newQty === undefined || newQty === currentQty || isManager
    ? ok(true)
    : err(forbidden("Only an owner can change stock quantity."));
