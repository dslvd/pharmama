// Pure stock rules: no database, no Nest, no clock.
import { conflict, DomainError, invalid } from "src/util/domain-error";
import { err, map, ok, Result } from "src/util/results.util";

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
  (input: StockInput): Result<StockData, DomainError> =>
    map((expiryDate: Date) => ({ ...input, expiryDate }))(
      parseExpiryDate(now)(input.expiryDate),
    );

// an update only re-validates the expiry date when it's being changed
export const toStockPatch =
  (now: Date) =>
  (input: Partial<StockInput>): Result<Partial<StockData>, DomainError> => {
    const { expiryDate, ...rest } = input;
    return expiryDate === undefined
      ? ok(rest)
      : map((parsed: Date) => ({ ...rest, expiryDate: parsed }))(
          parseExpiryDate(now)(expiryDate),
        );
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
