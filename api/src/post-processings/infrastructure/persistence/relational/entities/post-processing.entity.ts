import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'post_processing',
})
export class PostProcessingEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: Number,
    nullable: false,
  })
  currentTransactionId: number;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
