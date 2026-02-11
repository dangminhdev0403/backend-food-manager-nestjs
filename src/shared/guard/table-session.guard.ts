import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class TableSessionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext) {
    const req: Request = ctx.switchToHttp().getRequest<Request>();
    const path = req.path;
    const method = req.method;
    if (path === '/guest/orders' && method === 'POST') return true;
    const token = req.headers['x-table-session'] as string;

    if (!token) throw new UnauthorizedException();

    const session = await this.prisma.tableSession.findFirst({
      where: {
        token,
        endedAt: null,
      },
      omit: {
        endedAt: true,
        startedAt: true,
      },
    });

    if (!session) throw new UnauthorizedException();

    //@ts-ignore
    req.tableSession = session;
    return true;
  }
}
