import {
  // decorators here
  IsNumber,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetTimelyTotalsDto {
  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  from: number | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  to: number | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
