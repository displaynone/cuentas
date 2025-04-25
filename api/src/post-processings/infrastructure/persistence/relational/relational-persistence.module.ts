import { Module } from '@nestjs/common';
import { PostProcessingRepository } from '../post-processing.repository';
import { PostProcessingRelationalRepository } from './repositories/post-processing.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostProcessingEntity } from './entities/post-processing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostProcessingEntity])],
  providers: [
    {
      provide: PostProcessingRepository,
      useClass: PostProcessingRelationalRepository,
    },
  ],
  exports: [PostProcessingRepository],
})
export class RelationalPostProcessingPersistenceModule {}
