import { PartialType } from '@nestjs/swagger';
import { UserDto } from '../../user/inputs/user.dto';

export class ForgotPasswordDto extends PartialType(UserDto) {}
