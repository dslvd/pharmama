// auth/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";

// Check the roles and will only allow this role.
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
