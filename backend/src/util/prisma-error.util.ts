import { Prisma } from "src/generated/prisma/client";

// P2002: a unique constraint failed, e.g. two requests saving the same batch at once
export const isUniqueViolation = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
