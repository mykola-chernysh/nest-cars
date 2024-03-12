import { Body, Controller, Delete, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { UpdateUserRequestDto } from './models/dto/request/update-user.request.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @SkipAuth()
  // @Post()
  // public async create(@Body() createUserDto: BaseUserRequestDto): Promise<string> {
  //   return await this.userService.create(createUserDto);
  // }

  // @SkipAuth()
  // @Get()
  // public async findAll(): Promise<string> {
  //   return await this.userService.findAll();
  // }

  @SkipAuth()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<string> {
    return await this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @Get('me')
  public async findMy(): Promise<string> {
    return await this.userService.findOne(1);
  }

  @ApiBearerAuth()
  @Put('me')
  public async update(@Body() updateUserDto: UpdateUserRequestDto): Promise<string> {
    return await this.userService.update(1, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  public async remove(): Promise<string> {
    return await this.userService.remove(1);
  }
}
