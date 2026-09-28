import {
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "src/generated/prisma/client";
import { AsyncResult, err, fold, Result } from "./results.util";
import { DomainError } from "./domain-error";

export * from "./domain-error";

const toHttpException = (e: DomainError): HttpException => {
  switch (e.kind) {
    case "NotFound":
      return new NotFoundException(e.message);
    case "Invalid":
      return new BadRequestException(e.message);
    case "Conflict":
      return new ConflictException(e.message);
    case "Unauthorized":
      return new UnauthorizedException(e.message);
  }
};

// the edge of the app: turn a Result into a value or an HTTP error
export const unwrap = <T>(r: Result<T, DomainError>): T =>
  fold<T, DomainError, T>(
    (value) => value,
    (e) => {
      throw toHttpException(e);
    },
  )(r);

class Rollback {
  constructor(readonly error: DomainError) {}
}

// Run steps in a DB transaction. An error result rolls the transaction back
// and is returned as a value (Prisma only rolls back on a thrown error).
export const runInTransaction = <T>(
  prisma: PrismaService,
  fn: (tx: Prisma.TransactionClient) => AsyncResult<T, DomainError>,
): AsyncResult<T, DomainError> =>
  prisma
    .$transaction(async (tx) => {
      const r = await fn(tx);
      if (!r.ok) throw new Rollback(r.error);
      return r;
    })
    .catch((e: unknown) => {
      if (e instanceof Rollback) return err(e.error);
      throw e;
    });
