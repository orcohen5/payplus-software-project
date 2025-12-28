import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers['authorization']; 

    if (!authHeader) {
      throw new UnauthorizedException('No user ID provided');
    }

    request.user = { 
      userId: Number(authHeader)
    };

    return true;
  }
}