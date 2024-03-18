import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BaseAdvertisementRequestDto {
  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  brand: string;

  @IsString()
  @Length(1, 30)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  model: string;

  @IsInt()
  @Min(1980)
  @Max(new Date().getFullYear())
  year: number;

  @IsString()
  @Length(2, 10)
  color: string;

  @IsInt()
  @Min(0)
  @Max(99999999)
  price: number;

  @IsString()
  @Length(1, 10)
  currency: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;
}
