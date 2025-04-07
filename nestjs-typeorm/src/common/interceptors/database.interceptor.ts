import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof QueryFailedError) {
          throw new UnprocessableEntityException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
