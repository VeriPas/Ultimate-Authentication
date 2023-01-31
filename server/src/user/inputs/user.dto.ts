import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  //@Matches(/password/, { message: 'Passwords do not match' })
  @ApiProperty()
  confirmPassword: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
