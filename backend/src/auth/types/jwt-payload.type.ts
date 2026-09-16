import { Role } from "src/generated/prisma/enums";

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: Role;
}
