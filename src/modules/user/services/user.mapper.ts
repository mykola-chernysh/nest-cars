import { UserEntity } from '../../../database/entities/user.entity';
import { UserResponseDto } from '../models/dto/response/user.response.dto';

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
}
