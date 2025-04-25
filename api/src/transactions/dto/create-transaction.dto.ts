import { UserDto } from '../../users/dto/user.dto';

import { CategoryDto } from '../../categories/dto/category.dto';

import {
  IsNotEmptyObject,
  // decorators here
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Number)
  @IsNotEmptyObject()
  userId?: number;

  @ApiProperty({
    required: false,
    type: () => CategoryDto,
  })
  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  balance?: number | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  reference: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  concept: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  date: number;

  @ApiProperty({
    required: true,
    type: () => [Number],
  })
  @IsNumber({}, { each: true })
  categories: number[];

  // Don't forget to use the class-validator decorators in the DTO properties.
}
