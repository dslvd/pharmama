import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { Role, TransactionStatus } from "src/generated/prisma/enums";
import { err, ok } from "src/util/results.util";
import { notFound } from "src/util/domain-error";

describe("TransactionController", () => {
  let controller: TransactionController;
  const service = {
    getTransactionList: jest.fn(),
    createTransaction: jest.fn(),
    updateTransactionStatus: jest.fn(),
  };
  const user = { id: 3, email: "staff@pharmama.com", role: Role.STAFF };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: service }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it("returns the value of an ok result", async () => {
    const created = { id: 1 };
    service.createTransaction.mockResolvedValue(ok(created));

    await expect(
      controller.createTr({ transactionItems: [] }, user),
    ).resolves.toBe(created);
    expect(service.createTransaction).toHaveBeenCalledWith(
      { transactionItems: [] },
      3,
    );
  });

  it("turns a NotFound result into a 404", async () => {
    service.updateTransactionStatus.mockResolvedValue(
      err(notFound("Transaction not found.")),
    );

    await expect(
      controller.updateTrStatus(
        9,
        { status: TransactionStatus.CANCELLED },
        user,
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
