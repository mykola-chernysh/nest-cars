import { IsString } from 'class-validator';

export class CarBrandRequestDto {
  @IsString()
  brand: string;
}
