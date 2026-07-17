import { Injectable } from "@nestjs/common";
import {
  AuditAction,
  AuditEntity,
  AuditLog,
  Prisma,
} from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async getAuditList(filter: {
    entity?: AuditEntity;
    action?: AuditAction;
    order?: Prisma.SortOrder;
  }): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filter.entity && { entity: filter.entity }),
        ...(filter.action && { action: filter.action }),
      },
      orderBy: { createdAt: filter.order ?? "desc" },
    });
  }
}
