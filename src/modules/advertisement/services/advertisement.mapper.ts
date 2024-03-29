import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { ImageEntity } from '../../../database/entities/image.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AdvertisementListRequestDto } from '../models/dto/request/advertisement-list.request.dto';
import { AdvertisementResponseDto } from '../models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../models/dto/response/advertisement-list.response.dto';
import { ImageResponseDto } from '../models/dto/response/image.response.dto';
import { IConverter } from '../models/interface/currency-converter.interface';
import { IView } from '../models/interface/view.interface';

export class AdvertisementMapper {
  public static toResponseDto(advertisementEntity: AdvertisementEntity): AdvertisementResponseDto {
    return {
      id: advertisementEntity.id,
      title: advertisementEntity.title,
      brand: advertisementEntity.brand,
      model: advertisementEntity.model,
      year: advertisementEntity.year,
      color: advertisementEntity.color,
      price: advertisementEntity.price,
      currency: advertisementEntity.currency,
      region: advertisementEntity.region,
      description: advertisementEntity.description,
      status: advertisementEntity.status,
      created: advertisementEntity.created,
      updated: advertisementEntity.updated,
      user: advertisementEntity.user ? UserMapper.toResponseDto(advertisementEntity.user) : null,
      images: advertisementEntity.images
        ? advertisementEntity.images.map(AdvertisementMapper.toImageResponseDto)
        : null,
    };
  }

  public static toGetOneResponseDto(
    advertisementEntity: AdvertisementEntity,
    converter: IConverter,
  ): AdvertisementResponseDto {
    return {
      id: advertisementEntity.id,
      title: advertisementEntity.title,
      brand: advertisementEntity.brand,
      model: advertisementEntity.model,
      year: advertisementEntity.year,
      color: advertisementEntity.color,
      price: advertisementEntity.price,
      currency: advertisementEntity.currency,
      UAH: converter.UAH,
      USD: converter.USD,
      EUR: converter.EUR,
      region: advertisementEntity.region,
      description: advertisementEntity.description,
      status: advertisementEntity.status,
      created: advertisementEntity.created,
      updated: advertisementEntity.updated,
      user: advertisementEntity.user ? UserMapper.toResponseDto(advertisementEntity.user) : null,
      images: advertisementEntity.images
        ? advertisementEntity.images.map(AdvertisementMapper.toImageResponseDto)
        : null,
    };
  }

  public static toGetOnePremiumResponseDto(
    advertisementEntity: AdvertisementEntity,
    converter: IConverter,
    views: IView,
  ): AdvertisementResponseDto {
    return {
      id: advertisementEntity.id,
      title: advertisementEntity.title,
      brand: advertisementEntity.brand,
      model: advertisementEntity.model,
      year: advertisementEntity.year,
      color: advertisementEntity.color,
      price: advertisementEntity.price,
      currency: advertisementEntity.currency,
      UAH: converter.UAH,
      USD: converter.USD,
      EUR: converter.EUR,
      viewsPerDay: views.viewsPerDay,
      viewsPerWeek: views.viewsPerWeek,
      viewsPerMonth: views.viewsPerMonth,
      region: advertisementEntity.region,
      description: advertisementEntity.description,
      status: advertisementEntity.status,
      created: advertisementEntity.created,
      updated: advertisementEntity.updated,
      user: advertisementEntity.user ? UserMapper.toResponseDto(advertisementEntity.user) : null,
      images: advertisementEntity.images
        ? advertisementEntity.images.map(AdvertisementMapper.toImageResponseDto)
        : null,
    };
  }

  public static toImageResponseDto(imageEntities: ImageEntity): ImageResponseDto {
    return {
      id: imageEntities.id,
      image: imageEntities.image,
      created: imageEntities.created,
      updated: imageEntities.updated,
      advertisement_id: imageEntities.advertisement_id,
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
