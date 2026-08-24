import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TransactionModule } from "./transaction/transaction.module";
import { TransactionItemModule } from "./transaction-item/transaction-item.module";
import { StockModule } from "./stock/stock.module";
import { ProductModule } from "./product/product.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuditLogModule } from "./audit-log/audit-log.module";
import { SalesModule } from "./sales/sales.module";

@Module({
  imports: [
    PrismaModule,
    TransactionModule,
    TransactionItemModule,
    StockModule,
    ProductModule,
    AuditLogModule,
    SalesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
