import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Transaction } from '../../domain/transaction';

export type GetNextsByIdOptions = {
  lastId: number;
  limit: number;
};

export type TransactionFindUniqueOptions = {
  reference: Transaction['reference'];
  date: Transaction['date'];
  amount: Transaction['amount'];
};

export type TransactionGraphData = {
  year: number;
  month: number;
  balance: number;
};

export type TransactionGraphByCategoryData = {
  year: number;
  month: number;
  day: number;
  amount: number;
  categoryId: number;
  categoryName: string;
};

export type GetTotalsOptions = {
  from?: Date;
  to?: Date;
};

export abstract class TransactionRepository {
  abstract create(
    data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Transaction>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transaction[]>;

  abstract getNextsById(options: GetNextsByIdOptions): Promise<Transaction[]>;

  abstract findById(id: Transaction['id']): Promise<NullableType<Transaction>>;

  abstract findUnique(
    options: TransactionFindUniqueOptions,
  ): Promise<NullableType<Transaction>>;

  abstract findByIds(ids: Transaction['id'][]): Promise<Transaction[]>;

  abstract update(
    id: Transaction['id'],
    payload: DeepPartial<Transaction>,
  ): Promise<Transaction | null>;

  abstract remove(id: Transaction['id']): Promise<void>;

  abstract getMonthlyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]>;
  abstract getYearlyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]>;
  abstract getDailyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]>;

  abstract getMonthlyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]>;
  abstract getYearlyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]>;
  abstract getDailyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]>;
}
