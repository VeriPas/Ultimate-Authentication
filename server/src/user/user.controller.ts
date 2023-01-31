import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './inputs/user.dto';
import * as bcryptjs from 'bcryptjs';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { HttpCode, UseInterceptors } from '@nestjs/common/decorators';
import { TokenService } from './token.service';
import { MoreThanOrEqual } from 'typeorm';

@Controller()
@SerializeOptions({ strategy: 'excludeAll' })
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

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
      password: await this.userService.hashpassword(password),
    });
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // 1) Check if email and password exist

    if (!email || !password) {
      return new BadRequestException('Password and email are required');
    }
    // 2) Check if user exists && password is correct

    const user = await this.userService.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const accessToken = await this.userService.getAccessTokenForUser(user);

    const refreshToken = await this.userService.getRefreshTokenForUser(user);

    //expiration date
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 7);

    await this.tokenService.save({
      user_id: user.id,
      token: refreshToken,
      expiredAt,
    });

    // 3) If everything ok, send token to client
    //response.status(200);
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
    });
    return {
      token: accessToken,
    };
  }

  @Get('user')
  @UseInterceptors(ClassSerializerInterceptor)
  async currentUser(@Req() request: Request) {
    try {
      const accessToken = request.headers.authorization.replace('Bearer ', '');
      const { id } = await this.jwtService.verifyAsync(accessToken);

      return this.userService.findOne({ id });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() request: Request) {
    try {
      const refreshToken = request.cookies['refresh_token'];

      const user = await this.jwtService.verifyAsync(refreshToken);

      const tokenEntity = await this.tokenService.findOne({
        user_id: user.id,
        expiredAt: MoreThanOrEqual(new Date()),
      });

      if (!tokenEntity) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.userService.getAccessTokenForUser(user);

      return {
        token: accessToken,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.tokenService.delete({ token: request.cookies['refresh_token'] });

    response.clearCookie('refresh_token');

    return {
      message: 'success',
    };
  }
}
