import { Router, type CanActivateFn } from '@angular/router';
import { GeneralInfoService } from '../services/general-info.service';
import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { saveCurrentUrlInLocalStorage } from '@shared/common/saveCurrentUrlInLocalStorage';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';

export const CompleteAccountGuard: CanActivateFn = (route, state) => {
  const generalInfoService = inject(GeneralInfoService);
  const router = inject(Router);

  const authService = inject(AuthService);

  console.log({ authStatus: authService.authStatus() });

  // return generalInfoService.getGeneralInfo$().pipe(
  //   map((response) => {
  //     if (response.data.attributes.hasGeneralInfo) {
  //       return true;
  //     }

  //     saveCurrentUrlInLocalStorage(state);
  //     router.navigate(['/completar-registro']);
  //     return false;
  //   })
  // );

  return authService.checkAuthStatus$().pipe(
    switchMap(() => {
      if (authService.authStatus() === AuthStatus.notAuthenticated) {
        saveCurrentUrlInLocalStorage(state);
        router.navigate(['/completar-registro']);
        return of(false);
      }

      return generalInfoService.getGeneralInfo$().pipe(
        map((response) => {
          if (response.data.attributes.hasGeneralInfo) {
            return true;
          }

          saveCurrentUrlInLocalStorage(state);
          router.navigate(['/completar-registro']);
          return false;
        })
      );
    })
  );
};
