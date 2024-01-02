import { Injectable, WritableSignal, signal } from '@angular/core';
import { GeneralInformationComponent } from './components/general-information/general-information.component';

import { GeneralDetailsAndExteriorOfTheCarComponent } from './components/general-details-and-exterior-of-the-car/general-details-and-exterior-of-the-car.component';
import { InteriorOfTheCarComponent } from './components/interior-of-the-car/interior-of-the-car.component';
import { MechanicsComponent } from './components/mechanics/mechanics.component';
import { CarExtrasComponent } from './components/car-extras/car-extras.component';
import { CarRegistrationConfirmationComponent } from './components/car-registration-confirmation/car-registration-confirmation.component';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  steps = [
    GeneralInformationComponent,
    GeneralDetailsAndExteriorOfTheCarComponent,
    InteriorOfTheCarComponent,
    MechanicsComponent,
    CarExtrasComponent,
    CarRegistrationConfirmationComponent
  ];

  indexCurrentStep: WritableSignal<number> = signal(0);

  changeStep(step: number) {
    if (step < 0 || step >= this.steps.length) return;

    this.indexCurrentStep.set(step);
  }
}
