import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';

export const GuestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const authStatus = authService.authStatus();

  console.log({ authStatus });

  //Si NO está autenticado, puede acceder a la ruta
  if (authStatus === AuthStatus.notAuthenticated) {
    return true;
  }

  const router = inject(Router);
  router.navigate(['/']);

  return false;
}
