import { Column, Entity, OneToMany } from 'typeorm';

import { EAccount } from '../../common/enums/account.enum';
import { ERole } from '../../common/enums/role.enum';
import { AdvertisementEntity } from './advertisement.entity';
import { BaseEntity } from './models/base.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
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

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => AdvertisementEntity, (entity) => entity.user)
  cars?: AdvertisementEntity[];
}
