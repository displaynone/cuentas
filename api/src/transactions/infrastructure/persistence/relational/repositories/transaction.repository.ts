import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { Transaction } from '../../../../domain/transaction';
import {
  GetNextsByIdOptions,
  GetTotalsOptions,
  TransactionFindUniqueOptions,
  TransactionGraphByCategoryData,
  TransactionGraphData,
  TransactionRepository,
} from '../../transaction.repository';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionMapper } from '../mappers/transaction.mapper';

@Injectable()
export class TransactionRelationalRepository implements TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(data: Transaction): Promise<Transaction> {
    const persistenceModel = TransactionMapper.toPersistence(data);
    const newEntity = await this.transactionRepository.save(
      this.transactionRepository.create(persistenceModel),
    );
    return TransactionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: {
        date: 'DESC',
      },
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async getNextsById({
    lastId,
    limit,
  }: GetNextsByIdOptions): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      take: limit,
      order: {
        id: 'ASC',
      },
      where: {
        id: MoreThan(lastId),
      },
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async findById(id: Transaction['id']): Promise<NullableType<Transaction>> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
    });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findUnique(
    options: TransactionFindUniqueOptions,
  ): Promise<NullableType<Transaction>> {
    const startOfDay = new Date(options.date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const entity = await this.transactionRepository.findOne({
      where: {
        ...options,
        amount: Raw((alias) => `ROUND(${alias}, 2) = :amount`, {
          amount: options.amount,
        }),
        date: Between(startOfDay, endOfDay),
      },
    });

    return entity ? TransactionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Transaction['id'][]): Promise<Transaction[]> {
    const entities = await this.transactionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => TransactionMapper.toDomain(entity));
  }

  async update(
    id: Transaction['id'],
    payload: Partial<Transaction>,
  ): Promise<Transaction> {
    const entity = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const transaction = this.transactionRepository.create(
      TransactionMapper.toPersistence({
        ...TransactionMapper.toDomain(entity),
        ...payload,
        date: payload.date || entity.date,
      }),
    );
    const updatedEntity = await this.transactionRepository.save(transaction);

    return TransactionMapper.toDomain(updatedEntity);
  }

  async remove(id: Transaction['id']): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async getYearlyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('12', 'month')
      .addSelect('1', 'day')
      .addSelect('AVG(transaction.balance)', 'balance');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .orderBy('YEAR(transaction.date)', 'ASC');

    const result = await query.getRawMany<TransactionGraphData>();

    return result;
  }

  async getMonthlyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('1', 'day')
      .addSelect('MONTH(transaction.date)', 'month')
      .addSelect('AVG(transaction.balance)', 'balance');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .addGroupBy('MONTH(transaction.date)')
      .orderBy('YEAR(transaction.date)', 'ASC')
      .addOrderBy('MONTH(transaction.date)', 'ASC');
    const result = await query.getRawMany<TransactionGraphData>();

    return result;
  }

  async getDailyTotals(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('DAY(transaction.date)', 'day')
      .addSelect('MONTH(transaction.date)', 'month')
      .addSelect('AVG(transaction.balance)', 'balance');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .addGroupBy('MONTH(transaction.date)')
      .addGroupBy('DAY(transaction.date)')
      .orderBy('YEAR(transaction.date)', 'ASC')
      .addOrderBy('MONTH(transaction.date)', 'ASC')
      .addOrderBy('DAY(transaction.date)', 'ASC');

    const result = await query.getRawMany<TransactionGraphData>();

    return result;
  }

  async getYearlyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('12', 'month')
      .addSelect('1', 'day')
      .addSelect('SUM(transaction.amount)', 'amount')
      .leftJoin('transaction.categories', 'category')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.id', 'categoryId');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .addGroupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('YEAR(transaction.date)', 'ASC');

    const result = await query.getRawMany<TransactionGraphByCategoryData>();

    return result;
  }

  async getMonthlyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('1', 'day')
      .addSelect('MONTH(transaction.date)', 'month')
      .addSelect('SUM(transaction.amount)', 'amount')
      .leftJoin('transaction.categories', 'category')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.id', 'categoryId');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .addGroupBy('MONTH(transaction.date)')
      .addGroupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('YEAR(transaction.date)', 'ASC')
      .addOrderBy('MONTH(transaction.date)', 'ASC');
    const result = await query.getRawMany<TransactionGraphByCategoryData>();

    return result;
  }

  async getDailyByCategory(
    options: GetTotalsOptions,
  ): Promise<TransactionGraphByCategoryData[]> {
    const query = this.transactionRepository
      .createQueryBuilder('transaction')
      .select('YEAR(transaction.date)', 'year')
      .addSelect('DAY(transaction.date)', 'day')
      .addSelect('MONTH(transaction.date)', 'month')
      .addSelect('SUM(transaction.amount)', 'amount')
      .leftJoin('transaction.categories', 'category')
      .addSelect('category.name', 'categoryName')
      .addSelect('category.id', 'categoryId');

    if (options.from && options.to) {
      query.where({ date: Between(options.from, options.to) });
    } else if (options.from) {
      query.where({ date: MoreThanOrEqual(options.from) });
    } else if (options.to) {
      query.where({ date: LessThanOrEqual(options.to) });
    }
    query
      .groupBy('YEAR(transaction.date)')
      .addGroupBy('MONTH(transaction.date)')
      .addGroupBy('DAY(transaction.date)')
      .addGroupBy('category.id')
      .addGroupBy('category.name')
      .orderBy('YEAR(transaction.date)', 'ASC')
      .addOrderBy('MONTH(transaction.date)', 'ASC')
      .addOrderBy('DAY(transaction.date)', 'ASC');

    const result = await query.getRawMany<TransactionGraphByCategoryData>();

    return result;
  }
}
