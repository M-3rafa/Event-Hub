import { HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { inject } from '@angular/core';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(req);
  }

  return next(req);
};
