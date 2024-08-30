import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { saveCurrentUrlInLocalStorage } from '@shared/common/saveCurrentUrlInLocalStorage';
import { catchError, map, of } from 'rxjs';

export const PreviewCarGuard: CanActivateFn = (route, state) => {
  const auctionDetailsService = inject(AuctionDetailsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return auctionDetailsService.getAuctionDetails$(route.params['id']).pipe(
    map(() => {
      // Si la llamada es exitosa, permitir la activación
      return true;
    }),
    catchError(error => {
      if (error.error.statusCode === 401) {
        return authService.checkAuthStatus$().pipe(
          map(() => {
            console.log('authService.authStatus()', authService.authStatus());

            if (authService.authStatus() === AuthStatus.notAuthenticated) {
              //Si no está autenticado, guardamos la url a la que quería acceder en el localStorage
              saveCurrentUrlInLocalStorage(state);

              //Redireccionamos a la página de login
              router.navigate(['/iniciar-sesion'], { skipLocationChange: true });

              return false;
            }

            router.navigate(['/not-found']);
            return false;
          })
        );
      } else {
        router.navigate(['/not-found']);
        return of(false);
      }

    })
  );
};
