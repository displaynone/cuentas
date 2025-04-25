import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PostProcessingRepository } from './infrastructure/persistence/post-processing.repository';
import { CategoryRepository } from 'src/categories/infrastructure/persistence/category.repository';
import { TransactionRepository } from 'src/transactions/infrastructure/persistence/transaction.repository';

@Injectable()
export class PostProcessingsService {
  private readonly logger = new Logger(PostProcessingsService.name);

  constructor(
    // Dependencies here
    private readonly postProcessingRepository: PostProcessingRepository,
    private readonly categoriesRepository: CategoryRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  @Cron('0 */10 * * * *')
  async handleCron() {
    this.logger.log('Post processing started');
    const postProcessing = await this.postProcessingRepository.findLast();

    const lastId = postProcessing?.currentTransactionId || -1;

    const categories = await this.categoriesRepository.findAll();

    const transactions = await this.transactionRepository.getNextsById({
      lastId,
      limit: 1000,
    });
    this.logger.log('TRANSACTIONS = ' + transactions.length);
    for (const transaction of transactions) {
      const categoriesFound = categories.filter((category) => {
        return category.match.split('\n').find((match) => {
          const regexp = new RegExp(match, 'i');
          return (
            transaction.description?.match(regexp) ||
            transaction.concept?.match(regexp)
          );
        });
      });
      await this.transactionRepository.update(transaction.id, {
        categories: [...(transaction.categories || []), ...categoriesFound],
      });
    }
    if (transactions.length) {
      await this.postProcessingRepository.create({
        currentTransactionId: transactions[transactions.length - 1].id,
      });
    } else {
      await this.postProcessingRepository.create({
        currentTransactionId: -1,
      });
    }
    this.logger.log(
      '  Post processing categories finished',
      '    Transactions handled; ' + transactions.length,
      '    Last ID; ' + lastId,
    );
  }
}
