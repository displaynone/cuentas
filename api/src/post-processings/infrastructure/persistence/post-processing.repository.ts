import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { PostProcessing } from '../../domain/post-processing';

export abstract class PostProcessingRepository {
  abstract create(
    data: Omit<PostProcessing, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PostProcessing>;

  abstract findLast(): Promise<NullableType<PostProcessing>>;

  abstract update(
    id: PostProcessing['id'],
    payload: DeepPartial<PostProcessing>,
  ): Promise<PostProcessing | null>;

  abstract remove(id: PostProcessing['id']): Promise<void>;
}
