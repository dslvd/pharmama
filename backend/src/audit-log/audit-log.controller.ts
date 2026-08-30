import { Controller, Get } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import { AuditLog } from "src/generated/prisma/client";

@Controller("audit-log")
export class AuditLogController {
  constructor(private alService: AuditLogService) {}

  @Get()
  async getAuditList(): Promise<AuditLog[]> {
    return this.alService.getAuditList();
  }
}