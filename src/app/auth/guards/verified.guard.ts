import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { saveCurrentUrlInLocalStorage } from '@shared/common/saveCurrentUrlInLocalStorage';

export const verifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      console.log({ authStatus: authService.authStatus() });
      console.log({ currentUser: authService.currentUser() });

      if (authService.authStatus() === AuthStatus.authenticated && !authService.currentUser()?.attributes?.accountVerified) {
        saveCurrentUrlInLocalStorage(state);

        router.navigate(['/confirmacion']);

        return false;
      }

      return true;
    })
  );
};
