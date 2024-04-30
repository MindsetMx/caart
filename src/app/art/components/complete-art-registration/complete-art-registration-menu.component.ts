import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompleteArtRegistrationService } from '@app/art/services/complete-art-registration.service';

@Component({
  selector: 'complete-art-registration-menu',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './complete-art-registration-menu.component.html',
  styleUrl: './complete-art-registration-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteArtRegistrationMenuComponent {
  #completeArtRegistrationService = inject(CompleteArtRegistrationService);
  #activatedRoute = inject(ActivatedRoute);

  publicationId: string = this.#activatedRoute.snapshot.params['id'];

  get indexCurrentStep(): WritableSignal<number> {
    return this.#completeArtRegistrationService.indexCurrentStep;
  }

  set indexCurrentStep(step: number) {
    this.#completeArtRegistrationService.indexCurrentStep.set(step);
  }

  get indexTargetStep(): WritableSignal<number> {
    return this.#completeArtRegistrationService.indexTargetStep;
  }

  set indexTargetStep(step: number) {
    this.#completeArtRegistrationService.indexTargetStep.set(step);
  }

  get originalAuctionArtId(): WritableSignal<string> {
    return this.#completeArtRegistrationService.originalAuctionArtId;
  }

  set originalAuctionArtId(originalAuctionArtId: string) {
    this.#completeArtRegistrationService.originalAuctionArtId.set(originalAuctionArtId);
  }

  constructor() {
    this.indexCurrentStep = 0;
    this.indexTargetStep = 0;
    this.originalAuctionArtId = '';
    this.getWizardSteps();
  }

  getWizardSteps(): void {
    this.#completeArtRegistrationService.wizardSteps$(this.publicationId).subscribe((wizardSteps) => {
      this.indexCurrentStep = wizardSteps.data.attributes.currentStep;
      this.indexTargetStep = wizardSteps.data.attributes.currentStep;
      this.originalAuctionArtId = wizardSteps.data.id;
    });
  }

  changeStep(step: number) {
    if (step > this.indexCurrentStep() || step === 0)
      return;

    this.#completeArtRegistrationService.changeStep(step);

    window.scrollTo(0, 0);
  }

  isCurrentStep(step: number) {
    return this.#completeArtRegistrationService.indexTargetStep() === step;
  }

  isStepCompleted(step: number) {
    return step < this.indexCurrentStep() || this.indexCurrentStep() === 4;
  }

}
