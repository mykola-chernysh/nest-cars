import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';
import { EAccount } from '../../../../../database/entities/enums/account.enum';
import { ERole } from '../../../../../database/entities/enums/role.enum';

export class BaseUserRequestDto {
  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
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

  @ApiProperty({ enum: ERole, default: ERole.BUYER })
  @IsString()
  role: ERole;

  @IsOptional()
  @ApiProperty({ enum: EAccount, default: EAccount.BASE })
  @IsString()
  account?: EAccount;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;
}
