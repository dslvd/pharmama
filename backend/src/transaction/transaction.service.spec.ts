import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("TransactionService", () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
