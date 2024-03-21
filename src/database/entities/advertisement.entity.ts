import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ECurrency } from '../../common/enums/currency.enum';
import { IConverter } from '../../modules/advertisement/models/interface/currency-converter.interface';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';

@Entity('advertisement')
export class AdvertisementEntity extends BaseEntity {
  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  year: string;

  @Column('text')
  color: string;

  @Column('text')
  price: string;

  @Column({
    type: 'enum',
    enum: ECurrency,
    default: ECurrency.UAH,
  })
  currency: string;

  @Column('text', { nullable: true })
  UAH?: string;

  @Column('text', { nullable: true })
  USD?: string;

  @Column('text', { nullable: true })
  EUR?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
