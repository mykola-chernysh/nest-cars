import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AdvertisementEntity } from './advertisement.entity';
import { BaseEntity } from './models/base.entity';

@Entity('images')
export class ImageEntity extends BaseEntity {
  @Column()
  image: string;

  @Column()
  advertisement_id: string;
  @ManyToOne(() => AdvertisementEntity, (entity) => entity.image)
  @JoinColumn({ name: 'advertisement_id' })
  advertisement?: AdvertisementEntity;
}
