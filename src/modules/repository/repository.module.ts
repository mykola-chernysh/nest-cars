import { Global, Module } from '@nestjs/common';

import { AdvertisementRepository } from './services/advertisement.repository';
import { CarBrandRepository } from './services/car-brand.repository';
import { CarModelRepository } from './services/car-model.repository';
import { CurrencyRepository } from './services/currency.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  UserRepository,
  AdvertisementRepository,
  RefreshTokenRepository,
  CurrencyRepository,
  CarBrandRepository,
  CarModelRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
