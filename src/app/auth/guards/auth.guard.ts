import { inject } from "@angular/core";
import { CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

import { AuthStatus } from "@auth/enums";
import { AuthService } from "@auth/services/auth.service";
import { saveCurrentUrlInLocalStorage } from "@shared/common/saveCurrentUrlInLocalStorage";
import { map } from "rxjs";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus$().pipe(
    map(() => {
      const authStatus = authService.authStatus();

      //Si está autenticado, puede acceder a la ruta
      if (authStatus === AuthStatus.authenticated) {
        return true;
      }

      //Si no está autenticado, guardamos la url a la que quería acceder en el localStorage
      saveCurrentUrlInLocalStorage(state);

      //Redireccionamos a la página de login
      if (authStatus === AuthStatus.notAuthenticated) {
        router.navigate(['/login']);
      }

      return false;
    })
  );

};
