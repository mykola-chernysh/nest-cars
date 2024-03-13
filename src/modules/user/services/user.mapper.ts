import { UserEntity } from '../../../database/entities/user.entity';
import { TokenResponseDto } from '../../auth/models/dto/response/token.response.dto';
import { UpdateUserAccountRequestDto } from '../models/dto/request/update-user-account.request.dto';
import { UserResponseDto } from '../models/dto/response/user.response.dto';
import { UserUpdateRoleResponseDto } from '../models/dto/response/user-role.response.dto';

export class UserMapper {
  public static toResponseDto(userEntity: UserEntity): UserResponseDto {
    return {
      id: userEntity.id,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      email: userEntity.email,
      role: userEntity.role,
      account: userEntity.account,
      image: userEntity.image,
    };
  }

  public static toPublicUserResponseDto(userEntity: UserEntity): UserResponseDto {
    return {
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      email: userEntity.email,
    };
  }

  public static toUpdateUserRoleResponseDto(
    userEntity: UserEntity,
    tokens: TokenResponseDto,
  ): UserUpdateRoleResponseDto {
    return {
      role: userEntity.role,
      tokens,
    };
  }

  public static toUpdateUserAccountResponseDto(userEntity: UserEntity): UpdateUserAccountRequestDto {
    return {
      account: userEntity.account,
    };
  }
}
