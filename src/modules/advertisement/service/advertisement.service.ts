import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { ERole } from '../../../common/enums/role.enum';
import { CarEntity } from '../../../database/entities/car.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdvertisementListRequestDto } from '../modules/dto/request/advertisement-list.request.dto';
import { CreateAdvertisementRequestDto } from '../modules/dto/request/create-advertisement.request.dto';
import { UpdateAdvertisementRequestDto } from '../modules/dto/request/update-advertisement.request.dto';
import { AdvertisementResponseDto } from '../modules/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../modules/dto/response/advertisement-list.response.dto';
import { AdvertisementMapper } from './advertisement.mapper';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async getAll(query: AdvertisementListRequestDto): Promise<AdvertisementListResponseDto> {
    const [cars, total] = await this.advertisementRepository.getAll(query);

    return AdvertisementMapper.toListResponseDto(cars, total, query);
  }

  public async getById(adId: string): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.findOne({
      where: { id: adId },
      relations: { user: true },
    });

    return AdvertisementMapper.toResponseDto(adEntity);
  }

  public async createAd(dto: CreateAdvertisementRequestDto, userData: IUserData): Promise<AdvertisementResponseDto> {
    const priceToString = dto.price.toString();

    const adEntity = await this.advertisementRepository.save(
      this.advertisementRepository.create({
        ...dto,
        price: priceToString,
        user_id: userData.userId,
      }),
    );

    return AdvertisementMapper.toResponseDto(adEntity);
  }

  public async getMyAd(myAdId: string, userDada: IUserData): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.getMyAd(myAdId, userDada);

    return AdvertisementMapper.toResponseDto(adEntity);
  }

  public async getMyAllAd(
    query: AdvertisementListRequestDto,
    userData: IUserData,
  ): Promise<AdvertisementListResponseDto> {
    const [cars, total] = await this.advertisementRepository.getMyAllAd(query, userData);

    return AdvertisementMapper.toListResponseDto(cars, total, query);
  }

  public async updateAd(
    adId: string,
    userData: IUserData,
    dto: UpdateAdvertisementRequestDto,
  ): Promise<AdvertisementResponseDto> {
    const adEntity = await this.findByIdOrThrow(adId, userData.userId);
    const priceToString = dto.price.toString();
    const newAd = await this.advertisementRepository.save({ ...adEntity, ...dto, price: priceToString });

    return AdvertisementMapper.toResponseDto(newAd);
  }

  public async deleteAd(adId: string, userData: IUserData): Promise<void> {
    const adEntity = await this.findByIdOrThrow(adId, userData.userId);

    await this.advertisementRepository.remove(adEntity);
  }

  private async findByIdOrThrow(myAdId: string, userId: string): Promise<CarEntity> {
    const adEntity = await this.advertisementRepository.findOneBy({ id: myAdId });
    const userEntity = await this.userRepository.findOneBy({ id: userId });

    if (!adEntity) {
      throw new UnprocessableEntityException();
    }

    if (!userEntity) {
      throw new UnprocessableEntityException();
    }

    if (adEntity.user_id === userId || userEntity.role === ERole.MANAGER || userEntity.role === ERole.ADMIN) {
      return adEntity;
    }

    throw new ForbiddenException();
  }
}
