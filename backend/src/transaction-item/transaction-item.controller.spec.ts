import { Test, TestingModule } from '@nestjs/testing';
import { TransactionItemController } from './transaction-item.controller';

describe('TransactionItemController', () => {
  let controller: TransactionItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionItemController],
    }).compile();

    controller = module.get<TransactionItemController>(TransactionItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
