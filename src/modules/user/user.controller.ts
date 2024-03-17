import { Body, Controller, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { UpdateUserRequestDto } from './models/dto/request/update-user.request.dto';
import { UpdateUserAccountRequestDto } from './models/dto/request/update-user-account.request.dto';
import { UpdateUserRoleRequestDto } from './models/dto/request/update-user-role.request.dto';
import { UserResponseDto } from './models/dto/response/user.response.dto';
import { UserAccountResponseDto } from './models/dto/response/user-account.response.dto';
import { UserUpdateRoleResponseDto } from './models/dto/response/user-role.response.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my info' })
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my info' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my role' })
  @Put('me/change-role')
  public async updateMyRole(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRoleRequestDto,
  ): Promise<UserUpdateRoleResponseDto> {
    return await this.userService.updateMyRole(userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my account type' })
  @Put('me/change-type-account')
  public async updateMyAccount(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserAccountRequestDto,
  ): Promise<UserAccountResponseDto> {
    return await this.userService.updateMyAccount(userData, dto);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get a public user' })
  @Get(':id')
  public async getPublicUser(@Param('id', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return await this.userService.getPublicUser(userId);
  }
}
