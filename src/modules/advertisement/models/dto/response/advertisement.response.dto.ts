import { UserResponseDto } from '../../../../user/models/dto/response/user.response.dto';
import { ImageResponseDto } from './image.response.dto';

export class AdvertisementResponseDto {
  id?: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  currency: string;
  UAH?: number;
  USD?: number;
  EUR?: number;
  viewsPerDay?: number;
  viewsPerWeek?: number;
  viewsPerMonth?: number;
  region: string;
  description: string;
  image?: string;
  status: string;
  created: Date;
  updated: Date;
  user?: UserResponseDto;
  images?: ImageResponseDto[];
}
