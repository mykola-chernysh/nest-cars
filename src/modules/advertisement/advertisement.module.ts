import { Module } from '@nestjs/common';

import { AwsService } from '../aws/services/aws.service';
import { RedisModule } from '../redis/redis.module';
import { AdvertisementController } from './advertisement.controller';
import { AdvertisementService } from './services/advertisement.service';

@Module({
  imports: [RedisModule],
  controllers: [AdvertisementController],
  providers: [AdvertisementService, AwsService],
  exports: [],
})
export class AdvertisementModule {}
