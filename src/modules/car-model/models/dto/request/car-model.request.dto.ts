import { IsString } from 'class-validator';

export class CarModelRequestDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;
}
