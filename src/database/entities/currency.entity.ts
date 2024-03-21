import { Column, Entity } from 'typeorm';

import { BaseEntity } from './models/base.entity';

@Entity('currency')
export class CurrencyEntity extends BaseEntity {
  @Column({ type: 'text' })
  ccy: string;

  @Column({ type: 'text' })
  base_ccy: string;

  @Column({ type: 'text' })
  buy: string;

  @Column({ type: 'text' })
  sale: string;
}
