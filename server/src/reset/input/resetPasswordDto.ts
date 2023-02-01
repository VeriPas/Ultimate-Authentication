import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../../user/inputs/user.dto';

export class ResetPasswordDto extends PartialType(UserDto) {
  @IsString()
  @IsNotEmpty()
  token: string;
}
