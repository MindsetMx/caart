import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { map } from 'rxjs';

export const AdminDashboardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      const authStatus = authService.authStatus();
      const user = authService.currentUser();

      // 1. Verificar si está autenticado
      if (authStatus !== AuthStatus.authenticated) {
        router.navigate(['/iniciar-sesion'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true,
        });
        return false;
      }

      // 2. Verificar si la cuenta está verificada
      if (!user?.attributes?.accountVerified) {
        router.navigate(['/confirmacion'], {
          queryParams: { returnUrl: state.url },
          replaceUrl: true
        });
        return false;
      }

      // 3. Verificar si es admin
      if (!user?.attributes?.admin) {
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
};