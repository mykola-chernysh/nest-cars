import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { CarModelRequestDto } from './models/dto/request/car-model.request.dto';
import { CarModelUpdateRequestDto } from './models/dto/request/car-model-update.request.dto';
import { CarModelResponseDto } from './models/dto/response/car-model.response.dto';
import { CarModelService } from './services/car-model.service';

@ApiTags('Car model')
@Controller('car-model')
export class CarModelController {
  constructor(private readonly carModelService: CarModelService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all models' })
  @Get('get-all')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async getAll(): Promise<CarModelResponseDto[]> {
    return await this.carModelService.getAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one model' })
  @Get(':modelId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async getById(@Param('modelId', ParseUUIDPipe) modelId: string): Promise<CarModelResponseDto> {
    return await this.carModelService.getById(modelId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creating a model' })
  @Post('create')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async create(@Body() dto: CarModelRequestDto): Promise<CarModelResponseDto> {
    return await this.carModelService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update model' })
  @Put(':modelId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async update(
    @Param('modelId', ParseUUIDPipe) modelId: string,
    @Body() dto: CarModelUpdateRequestDto,
  ): Promise<CarModelResponseDto> {
    return await this.carModelService.update(modelId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete model' })
  @Delete(':modelId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async delete(@Param('modelId', ParseUUIDPipe) modelId: string): Promise<void> {
    return await this.carModelService.delete(modelId);
  }
}
