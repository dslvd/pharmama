import { Injectable } from "@nestjs/common";
import { AuditLog } from "src/generated/prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { safeUserSelect } from "src/users/users.select";

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async getAuditList(): Promise<AuditLog[]> {
    return await this.prisma.auditLog.findMany({
      include: { user: { select: safeUserSelect } },
    });
  }
}
