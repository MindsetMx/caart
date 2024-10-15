import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

import { AuctionDetailsService } from '@auctions/services/auction-details.service';
import { catchError, map, of } from 'rxjs';

export const liveCarGuard: CanActivateFn = (route, state) => {
  const auctionDetailsService = inject(AuctionDetailsService);
  const router = inject(Router);

  return auctionDetailsService.canEnterAuction$('car', route.params['id']).pipe(
    map(() => {
      // Si la llamada es exitosa, permitir la activación
      return true;
    }),
    catchError(error => {
      router.navigate(['/subasta-no-iniciada']);

      return of(false);
    })
  );
};
