import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { PostProcessing } from '../../../../domain/post-processing';
import { PostProcessingRepository } from '../../post-processing.repository';
import { PostProcessingEntity } from '../entities/post-processing.entity';
import { PostProcessingMapper } from '../mappers/post-processing.mapper';

@Injectable()
export class PostProcessingRelationalRepository
  implements PostProcessingRepository
{
  constructor(
    @InjectRepository(PostProcessingEntity)
    private readonly postProcessingRepository: Repository<PostProcessingEntity>,
  ) {}

  async create(data: PostProcessing): Promise<PostProcessing> {
    const persistenceModel = PostProcessingMapper.toPersistence(data);
    const newEntity = await this.postProcessingRepository.save(
      this.postProcessingRepository.create(persistenceModel),
    );
    return PostProcessingMapper.toDomain(newEntity);
  }

  async findLast(): Promise<NullableType<PostProcessing>> {
    const entity = await this.postProcessingRepository.find({
      take: 1,
      order: {
        id: 'DESC',
      },
    });

    return entity.length ? PostProcessingMapper.toDomain(entity[0]) : null;
  }

  async getNextsById(): Promise<NullableType<PostProcessing>> {
    const entity = await this.postProcessingRepository.findOne({
      order: {
        id: 'DESC',
      },
    });

    return entity ? PostProcessingMapper.toDomain(entity) : null;
  }

  async update(
    id: PostProcessing['id'],
    payload: Partial<PostProcessing>,
  ): Promise<PostProcessing> {
    const entity = await this.postProcessingRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.postProcessingRepository.save(
      this.postProcessingRepository.create(
        PostProcessingMapper.toPersistence({
          ...PostProcessingMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PostProcessingMapper.toDomain(updatedEntity);
  }

  async remove(id: PostProcessing['id']): Promise<void> {
    await this.postProcessingRepository.delete(id);
  }
}
