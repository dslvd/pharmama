import { Prisma, AuditAction, AuditEntity } from "src/generated/prisma/client";

interface CreateAuditLogParams {
  entity: AuditEntity;
  entityId: number;
  action: AuditAction;
  changes?: { old: unknown; new: unknown };
}

export async function createAuditLog(
  tx: Prisma.TransactionClient,
  params: CreateAuditLogParams,
): Promise<void> {
  await tx.auditLog.create({
    data: {
      entity: params.entity,
      entityId: params.entityId,
      action: params.action,
      ...(params.changes && {
        changes: params.changes as Prisma.InputJsonValue,
      }),
    },
  });
}
