import { Module } from '@nestjs/common';

import { RedisModule } from '../redis/redis.module';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './service/advertisement.service';

@Module({
  imports: [RedisModule],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
  exports: [],
})
export class AdvertisementModule {}
