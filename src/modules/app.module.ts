import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { RolesGuard } from '../common/guards/roles.guard';
import configuration from '../configs/configs';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { AuthModule } from './auth/auth.module';
import { CarBrandModule } from './car-brand/car-brand.module';
import { CarModelModule } from './car-model/car-model.module';
import { CurrencyModule } from './currency/currency.module';
import { HealthModule } from './health/health.module';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CurrencyModule,
    AuthModule,
    UserModule,
    AdvertisementModule,
    CarBrandModule,
    CarModelModule,
    HealthModule,
    RepositoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
