import { Prisma } from "src/generated/prisma/client";

// user fields that are safe to send to the client (never hashedPassword)
export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;
