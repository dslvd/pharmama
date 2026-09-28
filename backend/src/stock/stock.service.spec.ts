import { Test, TestingModule } from "@nestjs/testing";
import { StockService } from "./stock.service";
import { PrismaService } from "src/prisma/prisma.service";

describe("StockService", () => {
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
