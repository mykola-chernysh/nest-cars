import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './services/advertisement.service';

@Module({
  imports: [RedisModule],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [],
})
export class AdvertisementModule {}
