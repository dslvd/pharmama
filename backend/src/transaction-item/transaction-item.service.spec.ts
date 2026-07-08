import { Test, TestingModule } from '@nestjs/testing';
import { TransactionItemService } from './transaction-item.service';

describe('TransactionItemService', () => {
  let service: TransactionItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionItemService],
    }).compile();

    service = module.get<TransactionItemService>(TransactionItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
