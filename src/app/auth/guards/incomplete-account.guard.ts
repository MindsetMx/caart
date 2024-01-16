import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { map } from 'rxjs';

export const IncompleteAccountGuard: CanActivateFn = (route, state) => {
  const generalInfoService = inject(GeneralInfoService);
  const router = inject(Router);

  return generalInfoService.getGeneralInfo$().pipe(
    map((response) => {
      if (!response.data.attributes.hasGeneralInfo) {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};
