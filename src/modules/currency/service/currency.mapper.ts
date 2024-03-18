import { AxiosResponse } from 'axios';

import { CurrencyRequestDto } from '../models/dto/request/currency.request.dto';
import { CurrencyResponseDto } from '../models/dto/response/currency.response.dto';

export class CurrencyMapper {
  public static toResponseDto(currencyEntity: AxiosResponse<CurrencyRequestDto[]>): CurrencyResponseDto[] {
    const responseData = currencyEntity.data;

    const mappedData: CurrencyResponseDto[] = responseData.map((item: CurrencyResponseDto) => ({
      id: item.id,
      ccy: item.ccy,
      base_ccy: item.base_ccy,
      buy: item.buy,
      sale: item.sale,
    }));

    return mappedData;
  }
}
