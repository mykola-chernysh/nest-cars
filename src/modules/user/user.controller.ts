import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { UpdateUserRequestDto } from './models/dto/request/update-user.request.dto';
import { UserResponseDto } from './models/dto/response/user.response.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  public async findMe(@CurrentUser() userData: IUserData): Promise<UserResponseDto> {
    return await this.userService.findMe(userData);
  }

  @ApiBearerAuth()
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @SkipAuth()
  @Get(':id')
  public async getPublicUser(@Param('id', ParseUUIDPipe) userId: string): Promise<UserResponseDto> {
    return await this.userService.getPublicUser(userId);
  }

  // @ApiBearerAuth()
  // @Delete('me')
  // public async remove(): Promise<string> {
  //   return await this.userService.remove(1);
  // }

  // @Post()
  // public async create(@Body() createUserDto: BaseUserRequestDto): Promise<string> {
  //   return await this.userService.create(createUserDto);
  // }
  //
  // @Get()
  // public async findAll(): Promise<string> {
  //   return await this.userService.findAll();
  // }
}
