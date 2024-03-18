import { Global, Module } from '@nestjs/common';

import { AdvertisementRepository } from './services/advertisement.repository';
import { CurrencyRepository } from './services/currency.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [UserRepository, AdvertisementRepository, RefreshTokenRepository, CurrencyRepository];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
