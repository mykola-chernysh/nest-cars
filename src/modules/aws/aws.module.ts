import { Module } from '@nestjs/common';

import { AwsService } from './services/aws.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
