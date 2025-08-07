import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin, tap } from 'rxjs';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Carousel, Fancybox } from '@fancyapps/ui';

import { AuctionCarExteriorDetailsComponent } from '@dashboard/components/auction-car-exterior-details/auction-car-exterior-details.component';
import { AuctionCarExtraDetailsComponent } from '@dashboard/components/auction-car-extra-details/auction-car-extra-details.component';
import { AuctionCarInteriorDetailsComponent } from '@dashboard/components/auction-car-interior-details/auction-car-interior-details.component';
import { AuctionCarMechanicalDetailsComponent } from '@dashboard/components/auction-car-mechanical-details/auction-car-mechanical-details.component';
import { AuctionCarRegisterDetailsComponent } from '@dashboard/components/auction-car-register-details/auction-car-register-details.component';
import { AuctionCarUserDetailsComponent } from '@dashboard/components/auction-car-user-details/auction-car-user-details.component';
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
    AuctionCarUserDetailsComponent,
  ],
  templateUrl: './auction-car-details-modal.component.html',
  styleUrl: './auction-car-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarDetailsModalComponent {
  idPhoto = viewChild<ElementRef>('idPhoto');

  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  wizardData = signal<WizardData>({} as WizardData);
  userDetails = signal<UserDetails>({} as UserDetails);
  selectedTabIndex = signal<number>(0);
  showUserInfo = signal<boolean>(false);

  #wizardDataService = inject(WizardDataService);

  constructor() {
    Fancybox.bind("[data-fancybox='idPhotoGallery']", { Hash: false });
  }

  auctionCarIdAndIsOpenEffect = effect(() => {
    if (this.auctionCarId()) {
      untracked(() => {
        // Start with "Registro" tab (index 0 in new order)
        this.selectedTabIndex.set(0);
        this.wizardData.set({} as WizardData);
        this.userDetails.set({} as UserDetails);
      });

      forkJoin({
        wizardData: this.#wizardDataService.getWizardData$(this.auctionCarId()),
        userDetails: this.#wizardDataService.getUserDetails$(this.auctionCarId())
      }).subscribe({
        next: ({ wizardData, userDetails }) => {
          this.wizardData.set(wizardData);
          this.userDetails.set(userDetails);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  });

  // onTabChange(event: MatTabChangeEvent) {
  //   if (event.index === 5) {
  //     Fancybox.bind("[data-fancybox='idPhotoGallery']", { Hash: false });
  //   }
  // }

  changeTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

  toggleUserInfo(): void {
    this.showUserInfo.set(!this.showUserInfo());
  }

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
