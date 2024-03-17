import { CarEntity } from '../../../database/entities/car.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AdvertisementListRequestDto } from '../modules/dto/request/advertisement-list.request.dto';
import { AdvertisementResponseDto } from '../modules/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../modules/dto/response/advertisement-list.response.dto';

export class AdvertisementMapper {
  public static toResponseDto(carEntity: CarEntity): AdvertisementResponseDto {
    return {
      id: carEntity.id,
      brand: carEntity.brand,
      model: carEntity.model,
      color: carEntity.color,
      price: carEntity.price,
      currency: carEntity.currency,
      image: carEntity.image,
      created: carEntity.created,
      updated: carEntity.updated,
      user: carEntity.user ? UserMapper.toResponseDto(carEntity.user) : null,
    };
  }

  public static toListResponseDto(
    entities: CarEntity[],
    total: number,
    query: AdvertisementListRequestDto,
  ): AdvertisementListResponseDto {
    return {
      data: entities.map(this.toResponseDto),
      info: {
        limit: query.limit,
        total,
        offset: query.offset,
      },
    };
  }
}
