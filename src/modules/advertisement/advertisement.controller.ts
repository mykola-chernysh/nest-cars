import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../common/decorators/role.decorator';
import { ERole } from '../../common/enums/role.enum';
import { BadWordsGuard } from '../../common/guards/bad-words.guard';
import { BrandAndModelGuard } from '../../common/guards/brandAndModel.guard';
import { LimitAccountGuard } from '../../common/guards/limit-account.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/models/interfaces/user-data.interface';
import { FilesUploadDto } from '../aws/models/dto/request/files-upload.dto';
import { FilesValidationPipe } from '../aws/models/pipes/files-validation.pipe';
import { AdvertisementListRequestDto } from './models/dto/request/advertisement-list.request.dto';
import { CreateAdvertisementRequestDto } from './models/dto/request/create-advertisement.request.dto';
import { UpdateAdvertisementRequestDto } from './models/dto/request/update-advertisement.request.dto';
import { AdvertisementResponseDto } from './models/dto/response/advertisement.response.dto';
import { AdvertisementListResponseDto } from './models/dto/response/advertisement-list.response.dto';
import { AdvertisementService } from './services/advertisement.service';

@ApiTags('Advertisement')
@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Get all advertisements' })
  @Get('get-all')
  public async getAll(@Query() query: AdvertisementListRequestDto): Promise<AdvertisementListResponseDto> {
    return await this.advertisementService.getAll(query);
  }

  @SkipAuth()
  @ApiOperation({ summary: 'Get one advertisement' })
  @Get(':adId')
  public async getById(@Param('adId', ParseUUIDPipe) adId: string): Promise<AdvertisementResponseDto> {
    return await this.advertisementService.getById(adId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Creating an advertisements' })
  @Post('create')
  @Roles(ERole.SELLER, ERole.MANAGER, ERole.ADMIN)
  @UseGuards(BrandAndModelGuard, LimitAccountGuard, BadWordsGuard)
  public async createAd(
    @Body() dto: CreateAdvertisementRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<AdvertisementResponseDto> {
    return await this.advertisementService.createAd(dto, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload advertisement images' })
  @Post('images/:adId')
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(ERole.SELLER, ERole.MANAGER, ERole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Upload advert images', type: FilesUploadDto })
  public async uploadImages(
    @Param('adId', ParseUUIDPipe) adId: string,
    @CurrentUser() userData: IUserData,
    @UploadedFiles(new FilesValidationPipe()) files: Array<Express.Multer.File>,
  ): Promise<AdvertisementResponseDto> {
    return await this.advertisementService.uploadImages(files, adId, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all my advertisements' })
  @Get('my/get-all')
  public async getMyAllAd(
    @Query() query: AdvertisementListRequestDto,
    @CurrentUser() userData: IUserData,
  ): Promise<AdvertisementListResponseDto> {
    return await this.advertisementService.getMyAllAd(query, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one of my advertisements' })
  @Get('my/:myAdId')
  public async getMyAd(
    @Param('myAdId', ParseUUIDPipe) myAdId: string,
    @CurrentUser() userData: IUserData,
  ): Promise<AdvertisementResponseDto> {
    return await this.advertisementService.getMyAd(myAdId, userData);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update advertisement' })
  @Put(':adId')
  @Roles(ERole.SELLER, ERole.MANAGER, ERole.ADMIN)
  public async updateAd(
    @Param('adId', ParseUUIDPipe) adId: string,
    @CurrentUser() userData: IUserData,
    @Body() dto: UpdateAdvertisementRequestDto,
  ): Promise<AdvertisementResponseDto> {
    return await this.advertisementService.updateAd(adId, userData, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete advertisement' })
  @Delete(':adId')
  @Roles(ERole.SELLER, ERole.MANAGER, ERole.ADMIN)
  public async deleteAd(@Param('adId', ParseUUIDPipe) adId: string, @CurrentUser() userData: IUserData): Promise<void> {
    return await this.advertisementService.deleteAd(adId, userData);
  }
}
