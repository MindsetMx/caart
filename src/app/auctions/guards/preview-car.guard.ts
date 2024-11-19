import { catchError, map, of } from 'rxjs';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';

export const PreviewCarGuard: CanActivateFn = (route, state) => {
  const auctionDetailsService = inject(AuctionDetailsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return auctionDetailsService.getAuctionDetails$(route.params['id']).pipe(
    map(() => {
      return true;
    }),
    catchError(error => {
      //si está en preview y no tiene token o el token no pertenece al dueño de la subasta
      if (error.error.statusCode === 401) {
        return authService.checkAuthStatus$().pipe(
          map(() => {
            console.log('authService.authStatus()', authService.authStatus());

            if (authService.authStatus() === AuthStatus.notAuthenticated) {
              router.navigate(['/iniciar-sesion'], {
                queryParams: {
                  returnUrl: state.url
                },
                replaceUrl: true
              });

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
