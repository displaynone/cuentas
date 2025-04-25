import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CategoriesModule } from 'src/categories/categories.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { RelationalPostProcessingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { PostProcessingsService } from './post-processings.service';

@Module({
  imports: [
    // import modules, etc.
    RelationalPostProcessingPersistenceModule,
    ScheduleModule.forRoot(),
    TransactionsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [PostProcessingsService],
  exports: [PostProcessingsService, RelationalPostProcessingPersistenceModule],
})
export class PostProcessingsModule {}
