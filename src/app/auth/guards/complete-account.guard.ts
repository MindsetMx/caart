import { Router, type CanActivateFn } from '@angular/router';
import { GeneralInfoService } from '../services/general-info.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { saveCurrentUrlInLocalStorage } from '@shared/common/saveCurrentUrlInLocalStorage';

export const CompleteAccountGuard: CanActivateFn = (route, state) => {
  console.log('CompleteAccountGuard');

  const generalInfoService = inject(GeneralInfoService);
  const router = inject(Router);

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
};
