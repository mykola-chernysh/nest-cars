import { BadGatewayException, ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { ERole } from '../../../common/enums/role.enum';
import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { CurrencyRepository } from '../../repository/services/currency.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { AdvertisementListRequestDto } from '../models/dto/request/advertisement-list.request.dto';
import { CreateAdvertisementRequestDto } from '../models/dto/request/create-advertisement.request.dto';
import { UpdateAdvertisementRequestDto } from '../models/dto/request/update-advertisement.request.dto';
import { AdvertisementResponseDto } from '../models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../models/dto/response/advertisement-list.response.dto';
import { IConverter } from '../models/interface/currency-converter.interface';
import { AdvertisementMapper } from './advertisement.mapper';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
    private readonly currencyRepository: CurrencyRepository,
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

    const convertedCurrency = await this.currencyConverter(+adEntity.price, adEntity.currency);

    return AdvertisementMapper.toGetOneResponseDto(
      {
        ...adEntity,
      },
      {
        UAH: convertedCurrency.UAH,
        USD: convertedCurrency.USD,
        EUR: convertedCurrency.EUR,
      },
    );
  }

  public async createAd(dto: CreateAdvertisementRequestDto, userData: IUserData): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.save(
      this.advertisementRepository.create({
        ...dto,
        user_id: userData.userId,
      }),
    );

    return AdvertisementMapper.toResponseDto(adEntity);
  }

  public async getMyAd(myAdId: string, userDada: IUserData): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.getMyAd(myAdId, userDada);

    const convertedCurrency = await this.currencyConverter(+adEntity.price, adEntity.currency);

    return AdvertisementMapper.toGetOneResponseDto(
      {
        ...adEntity,
      },
      {
        UAH: convertedCurrency.UAH,
        USD: convertedCurrency.USD,
        EUR: convertedCurrency.EUR,
      },
    );
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

    const newAdEntity = await this.advertisementRepository.save({
      ...adEntity,
      ...dto,
    });

    return AdvertisementMapper.toResponseDto(newAdEntity);
  }

  public async deleteAd(adId: string, userData: IUserData): Promise<void> {
    const adEntity = await this.findByIdOrThrow(adId, userData.userId);

    await this.advertisementRepository.remove(adEntity);
  }

  private async findByIdOrThrow(myAdId: string, userId: string): Promise<AdvertisementEntity> {
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

  private async currencyConverter(price: number, currency: string): Promise<IConverter> {
    const USD = await this.currencyRepository.findOneBy({ ccy: 'USD' });
    const EUR = await this.currencyRepository.findOneBy({ ccy: 'EUR' });

    let uah: number, eur: number, usd: number;

    switch (currency) {
      case 'UAH':
        uah = price;
        usd = +(price / +USD.sale).toFixed(2);
        eur = +(price / +EUR.sale).toFixed(2);
        break;
      case 'USD':
        usd = price;
        uah = +(price * +USD.buy).toFixed(2);
        eur = +((price * +USD.buy) / +EUR.sale).toFixed(2);
        break;
      case 'EUR':
        eur = price;
        uah = +(price * +EUR.buy).toFixed(2);
        usd = +((price * +USD.buy) / +EUR.sale).toFixed(2);
        break;
      default:
        throw new BadGatewayException('Uncorrected currency');
    }

    return {
      UAH: uah,
      USD: usd,
      EUR: eur,
    };
  }
}
