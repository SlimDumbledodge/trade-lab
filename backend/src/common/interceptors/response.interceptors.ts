import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                const { data, message } = response ?? {};
                return {
                    success: true,
                    message: message ?? 'Requête traitée avec succès',
                    data: data ?? response,
                };
            }),
        );
    }
}
