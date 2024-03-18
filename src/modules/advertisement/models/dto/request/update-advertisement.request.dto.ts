import { PickType } from '@nestjs/swagger';

import { BaseAdvertisementRequestDto } from './base-advertisement.request.dto';

export class UpdateAdvertisementRequestDto extends PickType(BaseAdvertisementRequestDto, [
  'brand',
  'model',
  'year',
  'color',
  'price',
  'currency',
  'image',
]) {}
