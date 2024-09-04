import { Router, type CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { CompleteArtRegistrationService } from '@art/services/complete-art-registration.service';
import { map } from 'rxjs';

export const WizardCompletionArtGuard: CanActivateFn = (route, state) => {
  const completeArtRegistrationService = inject(CompleteArtRegistrationService);
  const router = inject(Router);

  // publicationId: string = this.#activatedRoute.snapshot.params['id'];

  return completeArtRegistrationService.wizardSteps$(route.params['id']).pipe(
    map((wizardSteps) => {
      if (wizardSteps.data.attributes.completed) {
        router.navigate(['/mis-subastas']);
        return false;
      }

      return true;
    })
  );
};
