import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';

import { ERole } from '../../../common/enums/role.enum';
import { AdvertisementEntity } from '../../../database/entities/advertisement.entity';
import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { EFileType } from '../../aws/models/enums/file-type.enum';
import { AwsService } from '../../aws/services/aws.service';
import { AdvertisementRepository } from '../../repository/services/advertisement.repository';
import { CurrencyRepository } from '../../repository/services/currency.repository';
import { ImageRepository } from '../../repository/services/image.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ViewRepository } from '../../repository/services/view.repository';
import { AdvertisementListRequestDto } from '../models/dto/request/advertisement-list.request.dto';
import { CreateAdvertisementRequestDto } from '../models/dto/request/create-advertisement.request.dto';
import { UpdateAdvertisementRequestDto } from '../models/dto/request/update-advertisement.request.dto';
import { AdvertisementResponseDto } from '../models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from '../models/dto/response/advertisement-list.response.dto';
import { EAdStatus } from '../models/enums/ads-status.enum';
import { IConverter } from '../models/interface/currency-converter.interface';
import { AdvertisementMapper } from './advertisement.mapper';

@Injectable()
export class AdvertisementService {
  constructor(
    private readonly awsService: AwsService,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly currencyRepository: CurrencyRepository,
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
    private readonly viewRepository: ViewRepository,
  ) {}

  public async getAll(query: AdvertisementListRequestDto): Promise<AdvertisementListResponseDto> {
    const [cars, total] = await this.advertisementRepository.getAll(query);

    return AdvertisementMapper.toListResponseDto(cars, total, query);
  }

  public async getById(adId: string): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.findOne({
      where: { id: adId },
      relations: { user: true, images: true },
    });

    const convertedCurrency = await this.currencyConverter(+adEntity.price, adEntity.currency);

    await this.viewRepository.save(
      this.viewRepository.create({
        advertisement_id: adId,
      }),
    );

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
        status: EAdStatus.ACTIVE,
      }),
    );

    return AdvertisementMapper.toResponseDto(adEntity);
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

  public async getMyAd(myAdId: string, userDada: IUserData): Promise<AdvertisementResponseDto> {
    const adEntity = await this.advertisementRepository.getMyAd(myAdId, userDada);

    if (!adEntity) {
      throw new BadRequestException('Advertisement not found');
    }

    const convertedCurrency = await this.currencyConverter(+adEntity.price, adEntity.currency);

    const viewsPerDay = await this.viewRepository.getViewsPerDay(myAdId);
    const viewsPerWeek = await this.viewRepository.getViewsPerWeek(myAdId);
    const viewsPerMonth = await this.viewRepository.getViewsPerMonth(myAdId);

    return AdvertisementMapper.toGetOnePremiumResponseDto(
      {
        ...adEntity,
      },
      {
        UAH: convertedCurrency.UAH,
        USD: convertedCurrency.USD,
        EUR: convertedCurrency.EUR,
      },
      {
        viewsPerDay,
        viewsPerWeek,
        viewsPerMonth,
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

  public async uploadImages(
    files: Express.Multer.File[],
    adId: string,
    userData: IUserData,
  ): Promise<AdvertisementResponseDto> {
    const adEntity = await this.findByIdOrThrow(adId, userData.userId);

    for (const file of files) {
      const path = await this.awsService.uploadFile(file, adId, EFileType.ADVERTISEMENT);

      await this.imageRepository.save(
        this.imageRepository.create({
          image: path,
          advertisement_id: adId,
        }),
      );
    }

    return AdvertisementMapper.toResponseDto(adEntity);
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
