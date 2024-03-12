import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';
import { UserResponseDto } from '../models/dto/response/user.response.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  public async findMe(userData: IUserData): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });

    return UserMapper.toResponseDto(userEntity);
  }

  public async updateMe(userData: IUserData, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.save(this.userRepository.merge(userEntity, dto));

    return UserMapper.toResponseDto(userEntity);
  }

  public async getPublicUser(userId: string): Promise<UserResponseDto> {
    const publicUserEntity = await this.userRepository.findOneBy({ id: userId });
    if (!publicUserEntity) {
      throw new UnprocessableEntityException('User not found');
    }

    return UserMapper.toPublicUserResponseDto(publicUserEntity);
  }

  // public async remove(id: number): Promise<string> {
  //   return `This action removes a #${id} user`;
  // }

  public async isEmailExist(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('Email is exist!');
    }
  }
}
