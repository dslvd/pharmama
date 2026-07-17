import { Controller, Get, Query } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import {
  AuditAction,
  AuditEntity,
  AuditLog,
  Prisma,
} from "src/generated/prisma/client";

@Controller("audit-log")
export class AuditLogController {
  constructor(private alService: AuditLogService) {}

  @Get()
  async getAuditList(
    @Query("entity") entity?: AuditEntity,
    @Query("action") action?: AuditAction,
    @Query("order") order?: Prisma.SortOrder,
  ): Promise<AuditLog[]> {
    return this.alService.getAuditList({ entity, action, order });
  }
}
