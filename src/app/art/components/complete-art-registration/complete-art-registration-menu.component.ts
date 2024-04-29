import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
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

  get indexCurrentStep(): WritableSignal<number> {
    return this.#completeArtRegistrationService.indexCurrentStep;
  }

  set indexCurrentStep(step: number) {
    this.#completeArtRegistrationService.indexCurrentStep.set(step);
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
