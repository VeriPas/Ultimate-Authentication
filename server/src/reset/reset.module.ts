import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reset } from './reset.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ResetController],
  providers: [ResetService, UserService, JwtService],
})
export class ResetModule {}
