import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { ActivatedRoute } from '@angular/router';
import { WizardSteps } from '@app/register-car/interfaces';

@Component({
  selector: 'complete-cart-registration-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './complete-cart-registration-menu.component.html',
  styleUrl: './complete-cart-registration-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteCartRegistrationMenuComponent implements OnInit {
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #route = inject(ActivatedRoute);

  publicationId: string = this.#route.snapshot.params['id'];

  get currentStep(): WritableSignal<number> {
    return this.#completeCarRegistrationService.indexCurrentStep;
  }

  set currentStep(step: number) {
    this.#completeCarRegistrationService.indexCurrentStep.set(step);
  }

  ngOnInit(): void {
    this.getWizardSteps();
  }

  getWizardSteps(): void {
    this.#completeCarRegistrationService.wizardSteps$(this.publicationId!).subscribe((wizardSteps) => {
      this.currentStep = wizardSteps.data.attributes.currentStep;
    });
  }

  changeStep(step: number) {
    this.#completeCarRegistrationService.changeStep(step);
  }

  isCurrentStep(step: number) {
    return this.#completeCarRegistrationService.indexCurrentStep() === step;
  }
}

