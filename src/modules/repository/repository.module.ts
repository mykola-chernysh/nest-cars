import { Global, Module } from '@nestjs/common';

import { AdvertisementRepository } from './services/advertisement.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [UserRepository, AdvertisementRepository, RefreshTokenRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
