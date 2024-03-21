import { CarBrandEntity } from '../../../database/entities/car-brand.entity';
import { CarBrandResponseDto } from '../models/dto/response/car-brand.response.dto';
import { CarBrandListResponseDto } from '../models/dto/response/car-brand-list.response.dto';

export class CarBrandMapper {
  public static toOneResponseDto(brandEntity: CarBrandEntity): CarBrandResponseDto {
    return {
      id: brandEntity.id,
      brand: brandEntity.brand,
      models: brandEntity.models ? brandEntity.models : null,
    };
  }

  public static toResponseDto(brandEntity: CarBrandEntity): CarBrandResponseDto {
    return {
      id: brandEntity.id,
      brand: brandEntity.brand,
    };
  }

  public static toListResponseDto(entities: CarBrandEntity[]): CarBrandListResponseDto {
    return {
      data: entities.map(this.toResponseDto),
    };
  }
}
