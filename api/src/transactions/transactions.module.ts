import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { RelationalTransactionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    CategoriesModule,

    // import modules, etc.
    RelationalTransactionPersistenceModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService, RelationalTransactionPersistenceModule],
})
export class TransactionsModule {}
