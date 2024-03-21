import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { CarBrandRequestDto } from './models/dto/request/car-brand.request.dto';
import { CarBrandResponseDto } from './models/dto/response/car-brand.response.dto';
import { CarBrandListResponseDto } from './models/dto/response/car-brand-list.response.dto';
import { CarBrandService } from './services/car-brand.service';

@ApiTags('Car brand')
@Controller('car-brand')
export class CarBrandController {
  constructor(private readonly carBrandService: CarBrandService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all cars' })
  @Get('get-all')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async getAll(): Promise<CarBrandListResponseDto> {
    return await this.carBrandService.getAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one car' })
  @Get(':carId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async getById(@Param('carId', ParseUUIDPipe) carId: string): Promise<CarBrandResponseDto> {
    return await this.carBrandService.getById(carId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creating a car' })
  @Post('create')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async create(@Body() dto: CarBrandRequestDto): Promise<CarBrandResponseDto> {
    return await this.carBrandService.create(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update car' })
  @Put(':carId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async update(
    @Param('carId', ParseUUIDPipe) carId: string,
    @Body() dto: CarBrandRequestDto,
  ): Promise<CarBrandResponseDto> {
    return await this.carBrandService.update(carId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete car' })
  @Delete(':carId')
  @Roles(ERole.MANAGER, ERole.ADMIN)
  public async delete(@Param('carId', ParseUUIDPipe) adId: string): Promise<void> {
    return await this.carBrandService.delete(adId);
  }
}
