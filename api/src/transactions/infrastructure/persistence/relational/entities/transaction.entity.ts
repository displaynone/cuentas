import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Index(['reference', 'date', 'balance'])
@Entity({
  name: 'transaction',
})
export class TransactionEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user?: UserEntity;

  @ManyToMany(() => CategoryEntity, { eager: true, nullable: false })
  @JoinTable()
  categories: CategoryEntity[];

  @Column({
    nullable: true,
    type: 'float',
  })
  balance?: number | null;

  @Column({
    nullable: false,
    type: 'float',
  })
  amount: number;

  @Column({
    nullable: false,
    type: String,
  })
  reference: string;

  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  concept: string;

  @Index()
  @Column({
    nullable: false,
    type: Date,
  })
  date: Date;

  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
