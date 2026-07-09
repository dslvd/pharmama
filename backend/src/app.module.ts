import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransactionService } from "./transaction/transaction.service";
import { TransactionModule } from "./transaction/transaction.module";
import { TransactionItemController } from "./transaction-item/transaction-item.controller";
import { TransactionItemModule } from "./transaction-item/transaction-item.module";
import { PrismaModule } from "./prisma/prisma.module";
import { StockModule } from "./stock/stock.module";
import { StockService } from "./stock/stock.service";

@Module({
  imports: [
    TransactionModule,
    TransactionItemModule,
    StockModule,
    PrismaModule,
  ],
  controllers: [AppController, TransactionItemController],
  providers: [AppService, TransactionService, StockService],
})
export class AppModule {}
