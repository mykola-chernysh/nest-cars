import { IsString } from 'class-validator';

export class CarModelUpdateRequestDto {
  @IsString()
  model: string;
}
