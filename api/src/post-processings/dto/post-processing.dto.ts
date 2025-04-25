import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostProcessingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
