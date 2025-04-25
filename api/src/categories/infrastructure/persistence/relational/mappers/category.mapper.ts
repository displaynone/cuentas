import { Category } from '../../../../domain/category';

import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(raw: CategoryEntity): Category {
    const domainEntity = new Category();
    domainEntity.description = raw.description;

    domainEntity.name = raw.name;
    domainEntity.match = raw.match;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Category): CategoryEntity {
    const persistenceEntity = new CategoryEntity();
    persistenceEntity.description = domainEntity.description;

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.match = domainEntity.match;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
