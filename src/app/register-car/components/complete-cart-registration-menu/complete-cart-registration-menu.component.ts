import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
import { CompleteCarRegistrationService } from '../../complete-car-registration.service';

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
export class CompleteCartRegistrationMenuComponent {
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  get currentStep(): WritableSignal<number> {
    return this.#completeCarRegistrationService.indexCurrentStep;
  }

  changeStep(step: number) {
    this.#completeCarRegistrationService.changeStep(step);
  }

  isCurrentStep(step: number) {
    return this.#completeCarRegistrationService.indexCurrentStep() === step;
  }
}

