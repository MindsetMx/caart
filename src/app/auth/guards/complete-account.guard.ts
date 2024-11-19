import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { Router, type CanActivateFn } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { GeneralInfoService } from '@auth/services/general-info.service';

export const CompleteAccountGuard: CanActivateFn = (route, state) => {
  const generalInfoService = inject(GeneralInfoService);
  const router = inject(Router);

  const authService = inject(AuthService);

  return authService.checkAuthStatus$().pipe(
    switchMap(() => {
      if (authService.authStatus() === AuthStatus.notAuthenticated) {
        router.navigate(['/completar-registro'], {
          queryParams: {
            returnUrl: state.url
          },
          replaceUrl: true
        });
        return of(false);
      }

      return generalInfoService.getGeneralInfo$().pipe(
        map((response) => {
          if (response.data.attributes.hasGeneralInfo) {
            return true;
          }

          router.navigate(['/completar-registro'], {
            queryParams: {
              returnUrl: state.url
            },
            replaceUrl: true
          });
          return false;
        })
      );
    })
  );
};
