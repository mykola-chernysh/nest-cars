import { AdvertisementResponseDto } from './advertisement.response.dto';

export class AdvertisementListResponseDto {
  data: AdvertisementResponseDto[];
  info: {
    total: number;
    limit: number;
    offset: number;
  };
}
