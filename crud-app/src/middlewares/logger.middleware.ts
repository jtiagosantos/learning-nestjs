import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const SECRET_TOKEN = 'B9ACE951F5243CE5E6BAB8A6E343C';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const { headers } = request;

    if (headers['authorization'] !== SECRET_TOKEN) {
      throw new UnauthorizedException();
    }

    next();
  }
}
