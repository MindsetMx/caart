import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { ActivatedRoute } from '@angular/router';
import { CarDetails, WizardSteps } from '@app/register-car/interfaces';

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
  carDetails: WritableSignal<CarDetails> = signal({} as CarDetails);

  get currentStep(): WritableSignal<number> {
    return this.#completeCarRegistrationService.indexCurrentStep;
  }

  set currentStep(step: number) {
    this.#completeCarRegistrationService.indexCurrentStep.set(step);
  }

  get originalAuctionCarId(): WritableSignal<string> {
    return this.#completeCarRegistrationService.originalAuctionCarId;
  }

  set originalAuctionCarId(originalAuctionCarId: string) {
    this.#completeCarRegistrationService.originalAuctionCarId.set(originalAuctionCarId);
  }

  ngOnInit(): void {
    this.getWizardSteps();
  }

  getWizardSteps(): void {
    this.#completeCarRegistrationService.wizardSteps$(this.publicationId).subscribe((wizardSteps) => {
      console.log({ wizardSteps });
      console.log({ carDetails: wizardSteps.data.attributes.carDetails });
      this.currentStep = wizardSteps.data.attributes.currentStep;
      this.originalAuctionCarId = wizardSteps.data.attributes.originalAuctionCarId;
      this.carDetails.set(wizardSteps.data.attributes.carDetails);
    });
  }

  changeStep(step: number) {
    if (step !== this.currentStep())
      return;

    this.#completeCarRegistrationService.changeStep(step);
  }

  isCurrentStep(step: number) {
    return this.#completeCarRegistrationService.indexCurrentStep() === step;
  }
}

