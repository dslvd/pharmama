import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import { AuditLog, Role } from "src/generated/prisma/client";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/decorator/auth.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller("audit-log")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AuditLogController {
  constructor(private alService: AuditLogService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  async getAuditList(): Promise<AuditLog[]> {
    return this.alService.getAuditList();
  }
}
