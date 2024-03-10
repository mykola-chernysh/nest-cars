import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 30)
  @Transform(({ value }) => value.trim())
  firsName: string;

  @IsString()
  @Length(3, 30)
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
