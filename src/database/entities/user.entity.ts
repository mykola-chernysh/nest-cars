import { Column, Entity, OneToMany } from 'typeorm';

import { CarEntity } from './car.entity';
import { EAccount } from './enums/account.enum';
import { ERole } from './enums/role.enum';
import { BaseEntity } from './models/base.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ERole,
    default: ERole.BUYER,
  })
  role: ERole;

  @Column({
    type: 'enum',
    enum: EAccount,
    default: EAccount.BASE,
  })
  account?: EAccount;

  @Column('text', { nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CarEntity, (entity) => entity.user)
  cars?: CarEntity[];
}
