import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarModelRepository } from '../../repository/services/car-model.repository';
import { CarModelRequestDto } from '../models/dto/request/car-model.request.dto';
import { CarModelUpdateRequestDto } from '../models/dto/request/car-model-update.request.dto';
import { CarModelResponseDto } from '../models/dto/response/car-model.response.dto';

@Injectable()
export class CarModelService {
  constructor(
    private readonly carModelRepository: CarModelRepository,
    private readonly carBrandRepository: CarBrandRepository,
  ) {}

  public async getAll(): Promise<CarModelResponseDto[]> {
    const carBrandEntity = await this.carModelRepository.find();

    return carBrandEntity;
  }

  public async getById(modelId: string): Promise<CarModelResponseDto> {
    const carBrandEntity = await this.carModelRepository.findOneBy({ id: modelId });

    if (!carBrandEntity) {
      throw new NotFoundException('The model was not found');
    }

    return carBrandEntity;
  }

  public async create(dto: CarModelRequestDto): Promise<CarModelResponseDto> {
    const brandName = dto.brand.toLowerCase();
    const modelName = dto.model.toLowerCase();

    const brandInDataBase = await this.carBrandRepository.findOneBy({ brand: brandName });
    if (!brandInDataBase) {
      throw new ConflictException('Brand not found!');
    }

    const modelInDataBase = await this.carModelRepository.findOneBy({ model: modelName });
    if (modelInDataBase) {
      throw new ConflictException('Model is already exist!');
    }

    const carModelEntity = await this.carModelRepository.save(
      this.carModelRepository.create({ model: modelName, brand_id: brandInDataBase.id }),
    );

    return carModelEntity;
  }

  public async update(modelId: string, dto: CarModelUpdateRequestDto): Promise<CarModelResponseDto> {
    const carModelEntity = await this.carModelRepository.findOneBy({ id: modelId });
    const updateModeldCar = await this.carModelRepository.save({
      ...carModelEntity,
      model: dto.model.toLowerCase(),
    });

    return updateModeldCar;
  }

  public async delete(modelId: string): Promise<void> {
    const carModelEntity = await this.carModelRepository.findOneBy({ id: modelId });

    if (!carModelEntity) {
      throw new NotFoundException('The car was not found');
    }

    await this.carModelRepository.remove(carModelEntity);
  }
}
