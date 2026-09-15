// auth/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
