import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BankService } from './bank.service';

@Injectable()
export class CurrencyService {
  constructor(private readonly bankService: BankService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron(): Promise<void> {
    await this.bankService.getAndSave();
  }
}
