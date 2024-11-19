import { catchError, map, of } from 'rxjs';
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { ArtAuctionDetailsService } from '@auctions/services/art-auction-details.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';

export const PreviewArtGuard: CanActivateFn = (route, state) => {
  const artAuctionDetailsService = inject(ArtAuctionDetailsService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return artAuctionDetailsService.getAuctionDetails$(route.params['id']).pipe(
    map(() => {
      // Si la llamada es exitosa, permitir la activación
      return true;
    }),
    catchError(error => {
      if (error.error.statusCode === 401) {
        return authService.checkAuthStatus$().pipe(
          map(() => {
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
