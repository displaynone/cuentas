import { Transaction } from '../../../../domain/transaction';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TransactionEntity } from '../entities/transaction.entity';
import { CategoryMapper } from 'src/categories/infrastructure/persistence/relational/mappers/category.mapper';

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    const domainEntity = new Transaction();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    if (raw.categories?.length) {
      domainEntity.categories = raw.categories.map((categories) =>
        CategoryMapper.toDomain(categories),
      );
    } else {
      domainEntity.categories = [];
    }

    domainEntity.balance = raw.balance;

    domainEntity.amount = raw.amount;

    domainEntity.reference = raw.reference;

    domainEntity.description = raw.description;

    domainEntity.concept = raw.concept;

    domainEntity.date = new Date(raw.date);

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Transaction): TransactionEntity {
    const persistenceEntity = new TransactionEntity();
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.categories) {
      persistenceEntity.categories = domainEntity.categories.map((category) =>
        CategoryMapper.toPersistence(category),
      );
    } else if (domainEntity.categories === null) {
      persistenceEntity.categories = [];
    }

    persistenceEntity.balance = domainEntity.balance;

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.reference = domainEntity.reference;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.concept = domainEntity.concept;

    persistenceEntity.date = new Date(domainEntity.date);

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
