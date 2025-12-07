import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CurrentUserService } from '../services/current-user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const currentUserService = inject(CurrentUserService);
  const token = currentUserService.getToken();

  // Skip adding token for login endpoint
  if (req.url.includes('/auth/login') || req.url.includes('/login')) {
    return next(req);
  }

  // Add Authorization header if token exists
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

