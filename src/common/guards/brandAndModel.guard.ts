import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { CarBrandRepository } from '../../modules/repository/services/car-brand.repository';
import { CarModelRepository } from '../../modules/repository/services/car-model.repository';

@Injectable()
export class BrandAndModelGuard implements CanActivate {
  constructor(
    private carBrandRepository: CarBrandRepository,
    private carModelRepository: CarModelRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const brand = request.body.brand.toLowerCase();
    const model = request.body.model.toLowerCase();

    const brandInDataBase = await this.carBrandRepository.findOneBy({ brand });
    const modelInDataBase = await this.carModelRepository.findOneBy({ model });

    if (!brandInDataBase) {
      throw new BadRequestException('Brand not found');
    }

    if (!modelInDataBase) {
      throw new BadRequestException('Model not found');
    }

    return true;
  }
}
