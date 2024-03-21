import { Module } from '@nestjs/common';

import { CarBrandController } from './car-brand.controller';
import { CarBrandService } from './services/car-brand.service';

@Module({
  imports: [],
  controllers: [CarBrandController],
  providers: [CarBrandService],
  exports: [],
})
export class CarBrandModule {}
