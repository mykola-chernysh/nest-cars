import { Column, Entity, OneToMany } from 'typeorm';

import { CarEntity } from './car.entity';
import { BaseEntity } from './models/base.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column('text')
  firsName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  role: string;

  @Column('text')
  account: string;

  @Column('text', { nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];
}
