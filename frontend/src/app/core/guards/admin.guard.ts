import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard
 * Protects routes that require admin privileges
 * Checks if user is authenticated AND has admin/staff role
 * Redirects to dashboard if user is not admin
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Get current user
  const user = authService.getCurrentUser();

  // Check if user has admin privileges (isStaff)
  if (user && user.isStaff) {
    return true;
  }

  // User is not admin, redirect to dashboard
  console.log('User is not admin, redirecting to dashboard');
  router.navigate(['/dashboard']);
  
  return false;
};
