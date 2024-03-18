import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AdvertisementListRequestDto } from '../models/dto/request/advertisement-list.request.dto';
import { AdvertisementResponseDto } from '../models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../models/dto/response/advertisement-list.response.dto';

export class AdvertisementMapper {
  public static toResponseDto(carEntity: AdvertisementEntity): AdvertisementResponseDto {
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
