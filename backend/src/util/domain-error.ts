// expected errors, returned instead of thrown
export type DomainError =
  | { readonly kind: "NotFound"; readonly message: string }
  | { readonly kind: "Invalid"; readonly message: string }
  | { readonly kind: "Conflict"; readonly message: string }
  | { readonly kind: "Unauthorized"; readonly message: string }
  | { readonly kind: "Forbidden"; readonly message: string };

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
export const forbidden = (message: string): DomainError => ({
  kind: "Forbidden",
  message,
});

// throw inside prisma.$transaction to roll it back; the service catches it
export class DomainException extends Error {
  constructor(readonly error: DomainError) {
    super(error.message);
  }
}
