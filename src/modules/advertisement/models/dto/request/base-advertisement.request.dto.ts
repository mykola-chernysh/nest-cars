import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BaseAdvertisementRequestDto {
  @IsString()
  @Length(0, 1500)
  @Transform(TransformHelper.trim)
  title: string;

  @IsString()
  @Length(1, 30)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  brand: string;

  @IsString()
  @Length(1, 30)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
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
  @Max(999999999999)
  price: number;

  @IsString()
  @Length(1, 10)
  currency: string;

  @IsString()
  @Length(0, 50)
  region: string;

  @IsString()
  @Length(0, 10000)
  description: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  status?: string;
}
