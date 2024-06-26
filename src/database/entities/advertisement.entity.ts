import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ECurrency } from '../../common/enums/currency.enum';
import { EAdStatus } from '../../modules/advertisement/models/enums/ads-status.enum';
import { ERegion } from '../../modules/advertisement/models/enums/region.enum';
import { ImageEntity } from './image.entity';
import { BaseEntity } from './models/base.entity';
import { UserEntity } from './user.entity';
import { ViewEntity } from './view.entity';

@Entity('advertisement')
export class AdvertisementEntity extends BaseEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  brand: string;

  @Column({ type: 'text' })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text' })
  color: string;

  @Column({ type: 'int' })
  price: number;

  @Column({
    type: 'enum',
    enum: ECurrency,
    default: ECurrency.UAH,
  })
  currency: string;

  @Column({
    type: 'enum',
    enum: ERegion,
  })
  region: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: EAdStatus,
    default: EAdStatus.NOT_ACTIVE,
  })
  status: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.cars)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => ViewEntity, (entity) => entity.advertisement)
  views?: ViewEntity[];

  @OneToMany(() => ImageEntity, (entity) => entity.advertisement)
  images?: ImageEntity[];
}
