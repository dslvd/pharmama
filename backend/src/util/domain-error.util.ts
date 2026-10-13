import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Result } from "./results.util";
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
    case "Forbidden":
      return new ForbiddenException(e.message);
  }
};

// returns the value, or throws the matching HTTP error
export const unwrap = <T>(r: Result<T, DomainError>): T => {
  if (!r.ok) throw toHttpException(r.error);
  return r.value;
};
