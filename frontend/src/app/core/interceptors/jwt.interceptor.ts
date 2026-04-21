import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * JWT Interceptor
 * Attaches JWT access token to all outgoing HTTP requests
 * Skips authentication endpoints (login, register, refresh)
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip token attachment for auth endpoints
  const isAuthEndpoint = 
    req.url.includes('/auth/login') || 
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/token/refresh');

  if (isAuthEndpoint) {
    return next(req);
  }

  // Get access token
  const token = authService.getAccessToken();

  // Clone request and add Authorization header if token exists
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // No token, proceed with original request
  return next(req);
};
