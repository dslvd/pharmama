import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransactionService } from "./transaction/transaction.service";
import { TransactionModule } from "./transaction/transaction.module";
import { TransactionItemController } from "./transaction-item/transaction-item.controller";
import { TransactionItemModule } from "./transaction-item/transaction-item.module";
import { PrismaModule } from "./prisma/prisma.module";
import { StockModule } from './stock/stock.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TransactionModule,
    TransactionItemModule,
    PrismaModule,
    StockModule,
    ProductModule,
  ],
  controllers: [AppController, TransactionItemController],
  providers: [AppService, TransactionService],
})
export class AppModule {}
