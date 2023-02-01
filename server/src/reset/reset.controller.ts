import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordDto } from './input/forgotPasswordDto';
import { ResetService } from './reset.service';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from './input/resetPasswordDto';
import * as bcryptjs from 'bcryptjs';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@Controller()
export class ResetController {
  constructor(
    private resetService: ResetService,
    private userService: UserService,
    private mailerService: MailerService,
  ) {}

  @Post('forgot')
  async forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    const { email } = forgotPassword;

    const user = await this.userService.findOne({ email });
    //generation of random string
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = Math.random().toString(20).substring(2, 12);

    await this.resetService.save({
      email,
      token,
    });
    const url = `http://localhost:8080/reset/${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> to reset your password`,
    });

    return {
      message: 'Email sent to mail',
    };
  }

  @Post('reset')
  async resetPassword(@Body() resetPassword: ResetPasswordDto) {
    const { token, password, confirmPassword } = resetPassword;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const resetToken = await this.resetService.findOne({ token });

    if (!resetToken) {
      throw new BadRequestException('Invalid Token');
    }

    const user = await this.userService.findOne({ email: resetToken.email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.update(user.id, {
      password: await bcryptjs.hash(password, 12),
    });
    return {
      message: 'success',
    };
  }
}
