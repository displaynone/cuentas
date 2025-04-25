// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePostProcessingDto } from './create-post-processing.dto';

export class UpdatePostProcessingDto extends PartialType(
  CreatePostProcessingDto,
) {}
