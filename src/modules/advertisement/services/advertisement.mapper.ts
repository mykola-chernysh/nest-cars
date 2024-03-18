import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AdvertisementListRequestDto } from '../models/dto/request/advertisement-list.request.dto';
import { AdvertisementResponseDto } from '../models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../models/dto/response/advertisement-list.response.dto';

export class AdvertisementMapper {
  public static toResponseDto(advertisementEntity: AdvertisementEntity): AdvertisementResponseDto {
    return {
      id: advertisementEntity.id,
      brand: advertisementEntity.brand,
      model: advertisementEntity.model,
      year: advertisementEntity.year,
      color: advertisementEntity.color,
      price: advertisementEntity.price,
      currency: advertisementEntity.currency,
      image: advertisementEntity.image,
      created: advertisementEntity.created,
      updated: advertisementEntity.updated,
      user: advertisementEntity.user ? UserMapper.toResponseDto(advertisementEntity.user) : null,
    };
  }

  public static toListResponseDto(
    entities: AdvertisementEntity[],
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
