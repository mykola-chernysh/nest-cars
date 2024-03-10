import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';

@Entity('cars')
export class CarEntity extends BaseEntity {
  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  color: string;

  @Column('text', { select: false })
  price: string;

  @Column('text')
  currency: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
