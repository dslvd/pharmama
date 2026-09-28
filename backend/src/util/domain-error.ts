// Errors the domain returns as values. Pure: no Nest or Prisma imports.
export type DomainError =
  | { readonly kind: "NotFound"; readonly message: string }
  | { readonly kind: "Invalid"; readonly message: string }
  | { readonly kind: "Conflict"; readonly message: string };

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
