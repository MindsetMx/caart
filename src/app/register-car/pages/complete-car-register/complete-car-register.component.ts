import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteCarRegistrationService } from '../../complete-car-registration.service';
import { CompleteCartRegistrationMenuComponent } from '@app/register-car/components/complete-cart-registration-menu/complete-cart-registration-menu.component';

@Component({
  selector: 'complete-car-register',
  standalone: true,
  imports: [
    CommonModule,
    CompleteCartRegistrationMenuComponent
  ],
  templateUrl: './complete-car-register.component.html',
  styleUrl: './complete-car-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteCarRegisterComponent {
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  get steps() {
    return this.#completeCarRegistrationService.steps;
  }

  get indexCurrentStep(): WritableSignal<number> {
    return this.#completeCarRegistrationService.indexCurrentStep;
  }
}
