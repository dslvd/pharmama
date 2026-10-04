// Errors the domain returns as values. Pure: no Nest or Prisma imports.
export type DomainError =
  | { readonly kind: "NotFound"; readonly message: string }
  | { readonly kind: "Invalid"; readonly message: string }
  | { readonly kind: "Conflict"; readonly message: string }
  | { readonly kind: "Unauthorized"; readonly message: string };

export const notFound = (message: string): DomainError => ({
  kind: "NotFound",
  message,
});
export const invalid = (message: string): DomainError => ({
  kind: "Invalid",
  message,
});
export const conflict = (message: string): DomainError => ({
  kind: "Conflict",
  message,
});
export const unauthorized = (message: string): DomainError => ({
  kind: "Unauthorized",
  message,
});

// Throw this inside prisma.$transaction to roll it back. The service catches
// it and returns err(e.error).
export class DomainException extends Error {
  constructor(readonly error: DomainError) {
    super(error.message);
  }
}
