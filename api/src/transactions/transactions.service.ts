import { User } from '../users/domain/user';
import { UsersService } from '../users/users.service';

import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Transaction } from './domain/transaction';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { GetTimelyTotalsDto } from './dto/get-timely-totals.dto';
import { CategoryRepository } from 'src/categories/infrastructure/persistence/category.repository';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly transactionRepository: TransactionRepository,
    private readonly categoriesRepository: CategoryRepository,
  ) {}

  async upsert(createTransactionDto: CreateTransactionDto) {
    const existing = await this.transactionRepository.findUnique({
      reference: createTransactionDto.reference,
      date: new Date(createTransactionDto.date),
      amount: createTransactionDto.amount,
    });
    if (existing) {
      return await this.update(existing.id, createTransactionDto);
    }
    return await this.create(createTransactionDto);
  }

  async create(createTransactionDto: CreateTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    let user: User | undefined = undefined;

    if (createTransactionDto.userId) {
      const userIdObject = await this.userService.findById(
        createTransactionDto.userId,
      );
      if (!userIdObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            userId: 'notExists',
          },
        });
      }
      user = userIdObject;
    }

    return this.transactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      user,

      balance: createTransactionDto.balance,

      amount: createTransactionDto.amount,

      reference: createTransactionDto.reference,

      description: createTransactionDto.description,

      concept: createTransactionDto.concept,

      date: new Date(createTransactionDto.date),
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Transaction['id']) {
    return this.transactionRepository.findById(id);
  }

  findByIds(ids: Transaction['id'][]) {
    return this.transactionRepository.findByIds(ids);
  }

  async update(
    id: Transaction['id'],
    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let user: User | undefined = undefined;

    if (updateTransactionDto.userId) {
      const userObject = await this.userService.findById(
        updateTransactionDto.userId,
      );
      if (!userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            userId: 'notExists',
          },
        });
      }
      user = userObject;
    }

    const getCategories = async () => {
      if (updateTransactionDto.categories) {
        return this.categoriesRepository.findByIds(
          updateTransactionDto.categories.map((c) => `${c}`),
        );
      }
      return undefined;
    };

    return this.transactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      user,

      balance: updateTransactionDto.balance,

      amount: updateTransactionDto.amount,

      reference: updateTransactionDto.reference,

      description: updateTransactionDto.description,

      concept: updateTransactionDto.concept,

      date: updateTransactionDto.date
        ? new Date(updateTransactionDto.date)
        : undefined,

      categories: await getCategories(),
    });
  }

  remove(id: Transaction['id']) {
    return this.transactionRepository.remove(id);
  }

  getDailyTotals(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getDailyTotals({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }

  getMonthlyTotals(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getMonthlyTotals({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }

  getYearlyTotals(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getYearlyTotals({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }

  getDailyByCategory(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getDailyByCategory({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }

  getMonthlyByCategory(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getMonthlyByCategory({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }

  getYearlyByCategory(getTimelyTotalsDto: GetTimelyTotalsDto) {
    return this.transactionRepository.getYearlyByCategory({
      from: getTimelyTotalsDto.from
        ? new Date(getTimelyTotalsDto.from)
        : undefined,
      to: getTimelyTotalsDto.to ? new Date(getTimelyTotalsDto.to) : undefined,
    });
  }
}
