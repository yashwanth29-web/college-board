import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Error Interceptor
 * Handles HTTP errors globally
 * Implements automatic token refresh on 401 errors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors with automatic token refresh
      if (error.status === 401 && !req.url.includes('/auth/token/refresh')) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap(response => {
            // Retry the original request with new token
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.access}`
              }
            });
            return next(clonedRequest);
          }),
          catchError(refreshError => {
            // Refresh failed, logout user
            console.error('Token refresh failed:', refreshError);
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // Handle other HTTP errors
      let errorMessage = 'An error occurred';

      switch (error.status) {
        case 0:
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = error.error?.message || 'Unauthorized. Please login again.';
          break;
        case 403:
          errorMessage = error.error?.message || 'Access forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = error.error?.message || 'Resource not found.';
          break;
        case 429:
          errorMessage = error.error?.message || 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error: ${error.status}`;
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error.error
      });

      // Return error with user-friendly message
      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error
      }));
    })
  );
};
