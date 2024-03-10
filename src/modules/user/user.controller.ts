import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './models/dto/request/create-user.dto';
import { UpdateUserDto } from './models/dto/request/update-user.dto';
import { UserService } from './services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<string> {
    return await this.userService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<string> {
    return await this.userService.findOne(+id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<string> {
    return await this.userService.remove(+id);
  }
}
