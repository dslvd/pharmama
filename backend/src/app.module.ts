import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionItemController } from './transaction-item/transaction-item.controller';
import { TransactionItemModule } from './transaction-item/transaction-item.module';
import { BatchService } from './batch/batch.service';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [TransactionModule, TransactionItemModule, BatchModule],
  controllers: [AppController, TransactionItemController],
  providers: [AppService, TransactionService, BatchService],
})
export class AppModule {}
