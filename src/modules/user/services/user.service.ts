import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Express } from 'express';

import { IUserData } from '../../auth/models/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { TokenService } from '../../auth/services/token.service';
import { EFileType } from '../../aws/models/enums/file-type.enum';
import { AwsService } from '../../aws/services/aws.service';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserRequestDto } from '../models/dto/request/update-user.request.dto';
import { UpdateUserAccountRequestDto } from '../models/dto/request/update-user-account.request.dto';
import { UpdateUserRoleRequestDto } from '../models/dto/request/update-user-role.request.dto';
import { UserResponseDto } from '../models/dto/response/user.response.dto';
import { UserAccountResponseDto } from '../models/dto/response/user-account.response.dto';
import { UserUpdateRoleResponseDto } from '../models/dto/response/user-role.response.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly awsService: AwsService,
  ) {}
  public async findMe(userData: IUserData): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });

    return UserMapper.toResponseDto(userEntity);
  }

  public async updateMe(userData: IUserData, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.save({ ...userEntity, ...dto });

    return UserMapper.toResponseDto(userEntity);
  }

  public async uploadAvatar(file: Express.Multer.File, userData: IUserData): Promise<UserResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });
    const pathFile = await this.awsService.uploadFile(file, userData.userId, EFileType.USER);

    await this.userRepository.save({ ...userEntity, image: pathFile });

    return UserMapper.toResponseDto(userEntity);
  }

  public async updateMyRole(userData: IUserData, dto: UpdateUserRoleRequestDto): Promise<UserUpdateRoleResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.save({ ...userEntity, ...dto });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userEntity.id,
      userRole: userEntity.role,
      userAccount: userEntity.account,
    });

    await Promise.all([
      this.refreshTokenRepository.saveToken(userEntity.id, tokens.refreshToken),
      this.authCacheService.saveToken(userEntity.id, tokens.accessToken),
    ]);

    return UserMapper.toUpdateUserRoleResponseDto(userEntity, tokens);
  }

  public async updateMyAccount(userData: IUserData, dto: UpdateUserAccountRequestDto): Promise<UserAccountResponseDto> {
    const userEntity = await this.userRepository.findOneBy({ id: userData.userId });
    await this.userRepository.save({ ...userEntity, ...dto });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: userEntity.id,
      userRole: userEntity.role,
      userAccount: userEntity.account,
    });

    await Promise.all([
      this.refreshTokenRepository.saveToken(userEntity.id, tokens.refreshToken),
      this.authCacheService.saveToken(userEntity.id, tokens.accessToken),
    ]);

    return UserMapper.toUpdateUserAccountResponseDto(userEntity);
  }

  public async getPublicUser(userId: string): Promise<UserResponseDto> {
    const publicUserEntity = await this.userRepository.findOneBy({ id: userId });
    if (!publicUserEntity) {
      throw new UnprocessableEntityException('User not found');
    }

    return UserMapper.toPublicUserResponseDto(publicUserEntity);
  }

  public async isEmailExistORThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      throw new ConflictException('Email is exist!');
    }
  }
}
