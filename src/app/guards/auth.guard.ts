import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  if (currentUserService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page if not authenticated
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

