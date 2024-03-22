import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { EAdStatus } from '../../modules/advertisement/models/enums/ads-status.enum';
import { AdvertisementRepository } from '../../modules/repository/services/advertisement.repository';
import { badWords } from '../constants/bad-words';

@Injectable()
export class BadWordsGuard implements CanActivate {
  private countEdit = 1;
  private maxEdit = 3;
  private isAdSaved = false;
  private prevToken: string;

  constructor(private readonly advertisementRepository: AdvertisementRepository) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const title = request.body.title.toLowerCase();
    const description = request.body.description.toLowerCase();
    const currentToken = request.get('Authorization')?.split('Bearer ')[1];

    if (this.prevToken !== currentToken) {
      this.countEdit = 1;
      this.prevToken = currentToken;
      this.isAdSaved = false;
    }

    if (this.isAdSaved) {
      throw new BadRequestException('Maximum editing attempts');
    }

    // to do mail to manager

    if (this.countEdit >= this.maxEdit) {
      const currency = request.body.currency.toUpperCase();

      await this.advertisementRepository.save(
        this.advertisementRepository.create({
          ...request.body,
          currency,
          user_id: request.user.userId,
          status: EAdStatus.ACTIVE,
        }),
      );
      this.isAdSaved = true;
      throw new BadRequestException('Maximum editing attempts');
    }

    const isBadWordsExist = this.isBadWords(title, description, badWords);

    if (isBadWordsExist) {
      this.countEdit++;
      throw new BadRequestException('The ad contains obscene words');
    }

    return true;
  }

  private isBadWords(title: string, description: string, badWords: string[]): boolean {
    if (!title) {
      throw new BadRequestException('Title is empty');
    }

    if (!description) {
      throw new BadRequestException('Description is empty');
    }

    for (const word of badWords) {
      if (title.includes(word) || description.includes(word)) {
        return true;
      }
    }

    return false;
  }
}
