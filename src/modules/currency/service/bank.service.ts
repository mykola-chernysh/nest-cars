import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BankConfig, Config } from '../../../configs/config.type';
import { CurrencyRepository } from '../../repository/services/currency.repository';
import { CurrencyMapper } from './currency.mapper';

@Injectable()
export class BankService {
  private bankConfig: BankConfig;
  constructor(
    private readonly httpService: HttpService,
    private readonly currencyRepository: CurrencyRepository,
    private readonly configService: ConfigService<Config>,
  ) {
    this.bankConfig = this.configService.get<BankConfig>('bank');
  }
  public async getAndSave(): Promise<any> {
    const axiosResponse = await this.httpService.axiosRef.get(this.bankConfig.bankURL);
    const currencies = CurrencyMapper.toResponseDto(axiosResponse);

    for (const currency of currencies) {
      const entity = await this.currencyRepository.findOneBy({
        ccy: currency.ccy,
      });
      if (!entity) {
        await this.currencyRepository.save(currency);
      } else {
        entity.base_ccy = currency.base_ccy;
        entity.buy = currency.buy;
        entity.sale = currency.sale;
        entity.updated = new Date();
        await this.currencyRepository.save(entity);
      }
    }
  }
}
