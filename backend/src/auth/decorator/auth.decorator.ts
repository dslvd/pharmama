import { SetMetadata } from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";

// @Roles(...): the roles allowed to call a route
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
