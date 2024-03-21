import { Module } from '@nestjs/common';

import { CarModelController } from './car-model.controller';
import { CarModelService } from './services/car-model.service';

@Module({
  imports: [],
  controllers: [CarModelController],
  providers: [CarModelService],
  exports: [],
})
export class CarModelModule {}
