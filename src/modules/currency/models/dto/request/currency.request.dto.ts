import { IsString } from 'class-validator';

export class CurrencyRequestDto {
  @IsString()
  ccy: string;

  @IsString()
  base_ccy: string;

  @IsString()
  buy: string;

  @IsString()
  sale: string;
}
