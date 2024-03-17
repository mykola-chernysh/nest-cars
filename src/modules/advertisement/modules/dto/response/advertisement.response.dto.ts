import { UserResponseDto } from '../../../../user/models/dto/response/user.response.dto';

export class AdvertisementResponseDto {
  id?: string;
  brand: string;
  model: string;
  color: string;
  price: string;
  currency: string;
  image?: string;
  created: Date;
  updated: Date;
  user?: UserResponseDto;
}
