import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { TransactionEntity } from 'src/transactions/infrastructure/persistence/relational/entities/transaction.entity';

@Entity({
  name: 'category',
})
export class CategoryEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: 'text',
  })
  match: string;

  @PrimaryGeneratedColumn('increment')
  id: string;

  @ManyToMany(() => TransactionEntity, (transaction) => transaction.categories)
  transactions: TransactionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
