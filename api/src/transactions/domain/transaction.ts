import { User } from '../../users/domain/user';
import { Category } from '../../categories/domain/category';
import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user?: User;

  @ApiProperty({
    type: () => [Category],
    nullable: true,
  })
  categories?: Category[];

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  balance?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  reference: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  concept: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  date: Date;

  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
