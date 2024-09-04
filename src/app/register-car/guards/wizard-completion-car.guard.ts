import { Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { map } from 'rxjs';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';

export const WizardCompletionCarGuard: CanActivateFn = (route, state) => {
  const completeCarRegistrationService = inject(CompleteCarRegistrationService);
  const router = inject(Router);

  // publicationId: string = this.#activatedRoute.snapshot.params['id'];

  return completeCarRegistrationService.wizardSteps$(route.params['id']).pipe(
    map((wizardSteps) => {
      if (wizardSteps.data.attributes.completed) {
        router.navigate(['/mis-subastas']);
        return false;
      }

      return true;
    })
  );
};
