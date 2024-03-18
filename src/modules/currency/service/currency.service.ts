import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BankService } from './bank.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly bankService: BankService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron(): Promise<any> {
    await this.bankService.getAndSave();
  }
}
