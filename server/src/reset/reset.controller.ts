import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordDto } from './input/forgotPasswordDto';
import { ResetService } from './reset.service';
import { UserService } from '../user/user.service';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private userService: UserService,
  ) {}

  @Post('forgot')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword;

    const user = await this.userService.findOne({ email });
    //generation of random string
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const token = Math.random().toString(20).substring(2, 12);

    await this.resetService.save({
      email,
      token,
    });

    return {
      message: 'success',
    };
  }
}
