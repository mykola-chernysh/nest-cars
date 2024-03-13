import { TokenResponseDto } from '../../../../auth/models/dto/response/token.response.dto';

export class UserUpdateRoleResponseDto {
  role: string;
  tokens: TokenResponseDto;
}
