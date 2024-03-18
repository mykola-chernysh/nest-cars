import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CurrencyRepository } from '../repository/services/currency.repository';
import { BankService } from './service/bank.service';
import { CurrencyService } from './service/currency.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [CurrencyService, CurrencyRepository, BankService],
  exports: [],
})
export class CurrencyModule {}
