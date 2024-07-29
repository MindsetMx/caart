import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

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
  idPhoto = viewChild<ElementRef>('idPhoto');

  isOpen = model.required<boolean>();
  auctionCarId = input.required<string>();

  wizardData = signal<WizardData>({} as WizardData);
  userDetails = signal<UserDetails>({} as UserDetails);

  #wizardDataService = inject(WizardDataService);

  imagesPublishEffect = effect(() => {
    if (this.userDetails().data && this.idPhoto()) {
      new Carousel(
        this.idPhoto()?.nativeElement,
        {
          infinite: false,
          Dots: false,
          Thumbs: {
            type: 'classic',
            Carousel: {
              slidesPerPage: 1,
              Navigation: true,
              center: true,
              fill: true,
              dragFree: true,
              Autoplay: {
                autoStart: true,
                timeout: 5000,
              },
            },
          },
        },
        { Thumbs }
      );

      Fancybox.bind('[data-fancybox="gallery"]', {
        Hash: false,
        idle: false,
        compact: false,
        dragToClose: false,

        animated: false,
        showClass: 'f-fadeSlowIn',
        hideClass: false,

        Carousel: {
          infinite: false,
        },

        Images: {
          zoom: false,
          Panzoom: {
            maxScale: 1.5,
          },
        },

        Toolbar: {
          absolute: true,
          display: {
            left: [],
            middle: [],
            right: ['close'],
          },
        },

        Thumbs: {
          type: 'classic',
          Carousel: {
            axis: 'x',

            slidesPerPage: 1,
            Navigation: true,
            center: true,
            fill: true,
            dragFree: true,

            breakpoints: {
              '(min-width: 640px)': {
                axis: 'y',
              },
            },
          },
        },
      });

      Fancybox.bind("[data-fancybox='gallery2']", { Hash: false });
    }
  });

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
