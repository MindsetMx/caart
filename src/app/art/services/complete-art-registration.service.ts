import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompleteArtRegistrationService {
  numberOfSteps = signal(2);
  indexCurrentStep = signal(0);
  indexTargetStep = signal(0);

  changeStep(step: number) {
    if (step < 0 || step >= this.numberOfSteps()) return;

    this.indexTargetStep.set(step);
  }
}
