import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './inputs/user.dto';
import * as bcryptjs from 'bcryptjs';
import { BadRequestException } from '@nestjs/common/exceptions';

@Controller('api/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUser: UserDto) {
    const { firstName, lastName, email, password, confirmPassword } =
      createUser;
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return this.userService.save({
      firstName,
      lastName,
      email,
      password: await bcryptjs.hash(password, 12),
    });
  }
}
