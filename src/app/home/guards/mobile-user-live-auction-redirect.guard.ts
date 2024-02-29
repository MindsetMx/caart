import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const MobileUserLiveAuctionRedirectGuard: CanActivateFn = () => {
  const isMobile = window.innerWidth < 768;

  const router = inject(Router);

  if (isMobile) {
    router.navigate(['/subastas-en-vivo']);

    return false;
  }

  return true;
};
