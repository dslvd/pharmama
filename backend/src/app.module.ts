import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransactionModule } from "./transaction/transaction.module";
import { TransactionItemModule } from "./transaction-item/transaction-item.module";
import { StockModule } from "./stock/stock.module";
import { ProductModule } from "./product/product.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    TransactionItemModule,
    StockModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
