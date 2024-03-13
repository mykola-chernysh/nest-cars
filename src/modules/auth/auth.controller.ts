import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { BaseUserRequestDto } from '../user/models/dto/request/base-user.request.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { SignInRequestDto } from './models/dto/request/sign-in.request.dto';
import { SignUpRequestDto } from './models/dto/request/sign-up.request.dto';
import { AuthUserResponseDto } from './models/dto/response/auth-user.response.dto';
import { TokenResponseDto } from './models/dto/response/token.response.dto';
import { IUserData } from './models/interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Registration' })
  @Post('sign-up')
  public async signUp(@Body() dto: SignUpRequestDto): Promise<AuthUserResponseDto> {
    return await this.authService.signUp(dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Login' })
  @Post('sign-in')
  public async signIn(@Body() dto: SignInRequestDto): Promise<AuthUserResponseDto> {
    return await this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Update token pair' })
  @Post('refresh')
  public async updateRefreshToken(@CurrentUser() userData: IUserData): Promise<TokenResponseDto> {
    return await this.authService.refreshToken(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create any user' })
  @Post('create-user')
  @Roles(ERole.ADMIN)
  public async createUserByAdmin(@Body() dto: SignUpRequestDto): Promise<BaseUserRequestDto> {
    return await this.authService.createUserByAdmin(dto);
  }
}
