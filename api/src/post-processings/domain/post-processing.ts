import { ApiProperty } from '@nestjs/swagger';

export class PostProcessing {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  currentTransactionId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
