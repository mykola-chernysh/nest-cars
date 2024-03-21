import { CarModelResponseDto } from '../../../../car-model/models/dto/response/car-model.response.dto';

export class CarBrandResponseDto {
  id?: string;
  brand: string;
  models?: CarModelResponseDto[];
}
