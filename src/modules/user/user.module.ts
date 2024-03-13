import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthCacheService } from '../auth/services/auth-cache.service';
import { TokenService } from '../auth/services/token.service';
import { RedisModule } from '../redis/redis.module';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [JwtModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, TokenService, AuthCacheService],
  exports: [UserService],
})
export class UserModule {}
