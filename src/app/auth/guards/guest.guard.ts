import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { map } from 'rxjs';

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      //Si NO está autenticado, puede acceder a la ruta
      if (authService.authStatus() === AuthStatus.notAuthenticated) {
        return true;
      }

      router.navigate(['/home']);

      return false;
    })
  );
}
