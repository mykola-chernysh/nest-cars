import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarBrandRequestDto } from '../models/dto/request/car-brand.request.dto';
import { CarBrandResponseDto } from '../models/dto/response/car-brand.response.dto';
import { CarBrandListResponseDto } from '../models/dto/response/car-brand-list.response.dto';
import { CarBrandMapper } from './car-brand.mapper';

@Injectable()
export class CarBrandService {
  constructor(private readonly carBrandRepository: CarBrandRepository) {}

  public async getAll(): Promise<CarBrandListResponseDto> {
    const carBrandEntity = await this.carBrandRepository.find();

    return CarBrandMapper.toListResponseDto(carBrandEntity);
  }

  public async getById(carId: string): Promise<CarBrandResponseDto> {
    const carBrandEntity = await this.carBrandRepository.findOne({
      where: { id: carId },
      relations: { models: true },
    });

    if (!carBrandEntity) {
      throw new NotFoundException('The car was not found');
    }

    return CarBrandMapper.toOneResponseDto(carBrandEntity);
  }

  public async create(dto: CarBrandRequestDto): Promise<CarBrandResponseDto> {
    const brandName = dto.brand.toLowerCase();

    const brandInDataBase = await this.carBrandRepository.findOneBy({ brand: brandName });
    if (brandInDataBase) {
      throw new ConflictException('Brand is already exist!');
    }
    const carBrandEntity = await this.carBrandRepository.save(this.carBrandRepository.create({ brand: brandName }));

    return CarBrandMapper.toResponseDto(carBrandEntity);
  }

  public async update(carId: string, dto: CarBrandResponseDto): Promise<CarBrandResponseDto> {
    const carBrandEntity = await this.carBrandRepository.findOneBy({ id: carId });
    const updateBrandCar = await this.carBrandRepository.save({
      ...carBrandEntity,
      brand: dto.brand.toLowerCase(),
    });

    return CarBrandMapper.toResponseDto(updateBrandCar);
  }

  public async delete(carId: string): Promise<void> {
    const carBrandEntity = await this.carBrandRepository.findOneBy({ id: carId });

    if (!carBrandEntity) {
      throw new NotFoundException('The car was not found');
    }

    await this.carBrandRepository.remove(carBrandEntity);
  }
}
