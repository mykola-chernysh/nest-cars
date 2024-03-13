import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';
import { TokenType } from '../../modules/auth/models/enums/token-type.enum';
import { IUserData } from '../../modules/auth/models/interfaces/user-data.interface';
import { AuthCacheService } from '../../modules/auth/services/auth-cache.service';
import { TokenService } from '../../modules/auth/services/token.service';
import { UserRepository } from '../../modules/repository/services/user.repository';
import { ROLES_KEY } from '../decorators/role.decorator';
import { ERole } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private authCacheService: AuthCacheService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const accessToken = request.get('Authorization')?.split('Bearer ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.tokenService.verifyToken(accessToken, TokenType.ACCESS);
    if (!payload) {
      throw new UnauthorizedException();
    }

    const findTokenInRedis = await this.authCacheService.isAccessTokenExist(payload.userId, accessToken);
    if (!findTokenInRedis) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({
      id: payload.userId,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
