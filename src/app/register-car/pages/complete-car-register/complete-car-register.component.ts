import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { CompleteCartRegistrationMenuComponent } from '@app/register-car/components/complete-cart-registration-menu/complete-cart-registration-menu.component';
import { GeneralInformationComponent } from '@app/register-car/components/general-information/general-information.component';
import { GeneralDetailsAndExteriorOfTheCarComponent } from '@app/register-car/components/general-details-and-exterior-of-the-car/general-details-and-exterior-of-the-car.component';
import { InteriorOfTheCarComponent } from '@app/register-car/components/interior-of-the-car/interior-of-the-car.component';
import { MechanicsComponent } from '@app/register-car/components/mechanics/mechanics.component';
import { CarExtrasComponent } from '@app/register-car/components/car-extras/car-extras.component';

@Component({
  selector: 'complete-car-register',
  standalone: true,
  imports: [
    CommonModule,
    CompleteCartRegistrationMenuComponent,
    GeneralInformationComponent,
    GeneralDetailsAndExteriorOfTheCarComponent,
    InteriorOfTheCarComponent,
    MechanicsComponent,
    CarExtrasComponent,
  ],
  templateUrl: './complete-car-register.component.html',
  styleUrl: './complete-car-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteCarRegisterComponent {
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  get indexTargetStep(): WritableSignal<number> {
    return this.#completeCarRegistrationService.indexTargetStep;
  }
}
