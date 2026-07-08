import { Module } from '@nestjs/common';
import { TransactionItemService } from './transaction-item.service';

@Module({
  providers: [TransactionItemService]
})
export class TransactionItemModule {}
