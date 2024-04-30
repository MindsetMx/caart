import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, WritableSignal, inject } from '@angular/core';
import { ArtRegistrationPaymentComponent } from '@app/art/components/art-registration-payment/art-registration-payment.component';
import { CompleteArtRegistrationMenuComponent } from '@app/art/components/complete-art-registration/complete-art-registration-menu.component';
import { CompleteArtRegistrationService } from '@app/art/services/complete-art-registration.service';

@Component({
  selector: 'app-complete-art-register',
  standalone: true,
  imports: [
    CommonModule,
    CompleteArtRegistrationMenuComponent,
    ArtRegistrationPaymentComponent
  ],
  templateUrl: './complete-art-register.component.html',
  styleUrl: './complete-art-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteArtRegisterComponent {
  #completeArtRegistrationService = inject(CompleteArtRegistrationService);

  get indexTargetStep(): WritableSignal<number> {
    return this.#completeArtRegistrationService.indexTargetStep;
  }
}
