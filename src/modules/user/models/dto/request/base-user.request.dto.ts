import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length, Matches } from 'class-validator';

import { EAccount } from '../../../../../common/enums/account.enum';
import { ERole } from '../../../../../common/enums/role.enum';
import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BaseUserRequestDto {
  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  firstName: string;

  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  lastName: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  // @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @IsOptional()
  @ApiProperty({ enum: ERole, default: ERole.BUYER })
  @IsString()
  role?: ERole;

  @IsOptional()
  @ApiProperty({ enum: EAccount, default: EAccount.BASE })
  @IsString()
  account?: EAccount;

  @IsOptional()
  @IsBoolean()
  blocked?: boolean;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;
}
