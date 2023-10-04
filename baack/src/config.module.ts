import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { OAuth2Service } from './oauth2.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [OAuth2Service],
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class ConfigModule {}

