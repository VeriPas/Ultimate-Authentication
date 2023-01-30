import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Req } from '@nestjs/common/decorators';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) protected readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async save(body) {
    return this.userRepository.save(body);
  }

  async findOne(options) {
    return this.userRepository.findOne({
      where: options,
    });
  }

  public async getAccessTokenForUser(user: User): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: user.id,
      },
      { expiresIn: '60s' },
    );
  }

  public async getRefreshTokenForUser(user: User): Promise<string> {
    return await this.jwtService.signAsync({
      sub: user.id,
    });
  }

  public async hashpassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
