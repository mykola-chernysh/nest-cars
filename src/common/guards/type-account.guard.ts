import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';

import { AdvertisementRepository } from '../../modules/repository/services/advertisement.repository';
import { UserRepository } from '../../modules/repository/services/user.repository';

@Injectable()
export class TypeAccountGuard implements CanActivate {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException();
    }

    const userAd = await this.advertisementRepository.findBy({ user_id: user.id });

    if (userAd.length >= 1 && user.account === 'base') {
      throw new BadRequestException('Your account type does not allow you to create more than one ad');
    }

    return true;
  }
}
