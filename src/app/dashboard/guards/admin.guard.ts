import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '@auth/enums';

import { AuthService } from '@auth/services/auth.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      if (authService.authStatus() === AuthStatus.authenticated && !authService.currentUser()?.attributes?.admin) {
        router.navigate(['/']);

        return false;
      }

      return true;
    })
  );
};
