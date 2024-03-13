import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { BaseUserRequestDto } from '../../user/models/dto/request/base-user.request.dto';
import { UserService } from '../../user/services/user.service';
import { SignInRequestDto } from '../models/dto/request/sign-in.request.dto';
import { SignUpRequestDto } from '../models/dto/request/sign-up.request.dto';
import { AuthUserResponseDto } from '../models/dto/response/auth-user.response.dto';
import { TokenResponseDto } from '../models/dto/response/token.response.dto';
import { IUserData } from '../models/interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly refreshRepository: RefreshTokenRepository,
  ) {}

  public async isSuperAdminExist(email: string): Promise<BaseUserRequestDto> {
    return await this.userRepository.findOneBy({ email });
  }

  public async createSuperAdmin(dto: SignUpRequestDto): Promise<BaseUserRequestDto> {
    const password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.save(this.userRepository.create({ ...dto, password }));
  }

  public async createUserByAdmin(dto: SignUpRequestDto): Promise<BaseUserRequestDto> {
    await this.userService.isEmailExistORThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    return await this.userRepository.save(this.userRepository.create({ ...dto, password }));
  }

  public async signUp(dto: SignUpRequestDto): Promise<AuthUserResponseDto> {
    await this.userService.isEmailExistORThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepository.save(this.userRepository.create({ ...dto, password }));

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      userRole: user.role,
      userAccount: user.account,
    });

    await Promise.all([
      this.refreshRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(user.id, tokens.accessToken),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async signIn(dto: SignInRequestDto): Promise<AuthUserResponseDto> {
    const userEntity = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true },
    });
    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const isPasswordsMatch = await bcrypt.compare(dto.password, userEntity.password);

    if (!isPasswordsMatch) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: userEntity.id });

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      userRole: user.role,
      userAccount: user.account,
    });

    await Promise.all([
      this.refreshRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);

    await Promise.all([
      this.refreshRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(user.id, tokens.accessToken),
    ]);

    return AuthMapper.toResponseDto(user, tokens);
  }

  public async logout(userData: IUserData): Promise<void> {
    await Promise.all([
      this.refreshRepository.delete({
        user_id: userData.userId,
      }),
      this.authCacheService.removeToken(userData.userId),
    ]);
  }

  public async refreshToken(userData: IUserData): Promise<TokenResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userData.userId,
    });

    await Promise.all([
      this.refreshRepository.delete({
        user_id: user.id,
      }),
      this.authCacheService.removeToken(user.id),
    ]);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      userRole: user.role,
      userAccount: user.account,
    });

    await Promise.all([
      this.refreshRepository.saveToken(user.id, tokens.refreshToken),
      this.authCacheService.saveToken(user.id, tokens.accessToken),
    ]);
    return tokens;
  }
}
