import { PostProcessing } from '../../../../domain/post-processing';
import { PostProcessingEntity } from '../entities/post-processing.entity';

export class PostProcessingMapper {
  static toDomain(raw: PostProcessingEntity): PostProcessing {
    const domainEntity = new PostProcessing();
    domainEntity.id = raw.id;
    domainEntity.currentTransactionId = raw.currentTransactionId;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: PostProcessing): PostProcessingEntity {
    const persistenceEntity = new PostProcessingEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.currentTransactionId) {
      persistenceEntity.currentTransactionId =
        domainEntity.currentTransactionId;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
