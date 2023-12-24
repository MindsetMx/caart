import { Injectable, WritableSignal, signal } from '@angular/core';
import { GeneralInformationComponent } from './components/general-information/general-information.component';
import { FormGroup } from '@angular/forms';
import { GeneralDetailsAndExteriorOfTheCarComponent } from './components/general-details-and-exterior-of-the-car/general-details-and-exterior-of-the-car.component';

@Injectable({
  providedIn: 'root'
})
export class CompleteCarRegistrationService {
  steps = [GeneralInformationComponent, GeneralDetailsAndExteriorOfTheCarComponent];

  indexCurrentStep: WritableSignal<number> = signal(1);

  changeStep(step: number) {
    if (step < 0 || step >= this.steps.length) return;

    this.indexCurrentStep.set(step);
  }
}
