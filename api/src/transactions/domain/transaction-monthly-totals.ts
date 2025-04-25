import { ApiProperty } from '@nestjs/swagger';

export class TransactionMonthlyTotals {
  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  year: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  month: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  balance: number;
}
