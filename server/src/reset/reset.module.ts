import { Module } from '@nestjs/common';
import { ResetController } from './reset.controller';
import { ResetService } from './reset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reset } from './reset.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reset]),
    MailerModule.forRoot({
      transport: {
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'veripass@example.com',
      },
    }),
    UserModule,
  ],
  controllers: [ResetController],
  providers: [ResetService],
})
export class ResetModule {}
