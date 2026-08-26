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
    const list = await this.prisma.auditLog.findMany();

    const filtered = list.filter(
      (log) =>
        (!filter.entity || log.entity === filter.entity) &&
        (!filter.action || log.action === filter.action),
    );

    return [...filtered].sort((a, b) =>
      (filter.order ?? "desc") === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  async searchAuditLogs(query: string): Promise<AuditLog[]> {
    const list = await this.prisma.auditLog.findMany();

    if (!query) return list;

    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q),
    );
  }
}
