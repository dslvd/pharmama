import { Test, TestingModule } from "@nestjs/testing";
import { AuditLogService } from "./audit-log.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("AuditLogService", () => {
  let service: AuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
