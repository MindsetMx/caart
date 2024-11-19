import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { map } from "rxjs";

import { AuthService } from "@auth/services/auth.service";
import { AuthStatus } from "@auth/enums";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      //Si está autenticado, puede acceder a la ruta
      if (authService.authStatus() === AuthStatus.authenticated) {
        return true;
      }

      //Redireccionamos a la página de login
      if (authService.authStatus() === AuthStatus.notAuthenticated) {
        router.navigate(['/iniciar-sesion'], {
          queryParams: {
            returnUrl: state.url
          },
          replaceUrl: true,
        });
      }

      return false;
    })
  );

};
