import { Module } from '@nestjs/common';
import { TransactionRepository } from '../transaction.repository';
import { TransactionRelationalRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), CategoriesModule],
  providers: [
    {
      provide: TransactionRepository,
      useClass: TransactionRelationalRepository,
    },
  ],
  exports: [TransactionRepository],
})
export class RelationalTransactionPersistenceModule {}
