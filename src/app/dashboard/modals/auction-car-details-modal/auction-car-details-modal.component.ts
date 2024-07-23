import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

import { AuctionCarExteriorDetailsComponent } from '@dashboard/components/auction-car-exterior-details/auction-car-exterior-details.component';
import { AuctionCarExtraDetailsComponent } from '@dashboard/components/auction-car-extra-details/auction-car-extra-details.component';
import { AuctionCarInteriorDetailsComponent } from '@dashboard/components/auction-car-interior-details/auction-car-interior-details.component';
import { AuctionCarMechanicalDetailsComponent } from '@dashboard/components/auction-car-mechanical-details/auction-car-mechanical-details.component';
import { AuctionCarRegisterDetailsComponent } from '@dashboard/components/auction-car-register-details/auction-car-register-details.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { UserDetails } from '@dashboard/interfaces';
import { WizardData } from '@dashboard/interfaces/wizard-data';
import { WizardDataService } from '@dashboard/services/wizard-data.service';

@Component({
  selector: 'auction-car-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CommonModule,
    AuctionCarExteriorDetailsComponent,
    AuctionCarExtraDetailsComponent,
    AuctionCarInteriorDetailsComponent,
    AuctionCarMechanicalDetailsComponent,
    AuctionCarRegisterDetailsComponent,
  ],
  templateUrl: './auction-car-details-modal.component.html',
  styleUrl: './auction-car-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarDetailsModalComponent {
  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  wizardData = signal<WizardData>({} as WizardData);
  userDetails = signal<UserDetails>({} as UserDetails);

  #wizardDataService = inject(WizardDataService);

  auctionCarIdAndIsOpenEffect = effect(() => {
    if (this.auctionCarId() && this.isOpen()) {
      this.#wizardDataService.getWizardData$(this.auctionCarId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe({
        next: (response) => {
          this.wizardData.set(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  });

  getUserDetails(): void {
    this.#wizardDataService.getUserDetails$(this.auctionCarId()).subscribe({
      next: (response) => {
        this.userDetails.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
