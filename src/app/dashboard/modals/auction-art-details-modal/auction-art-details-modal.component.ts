import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { tap } from 'rxjs';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

import { ArtWizard, UserDetails } from '@dashboard/interfaces';
import { ArtWizardService } from '@dashboard/services/art-wizard.service';
import { AuctionArtDetailsComponent } from '@app/dashboard/components/auction-art-details/auction-art-details.component';
import { AuctionArtRegisterDetailsComponent } from '@dashboard/components/auction-art-register-details/auction-art-register-details.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'auction-art-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CommonModule,
    CurrencyPipe,
    AuctionArtRegisterDetailsComponent,
    AuctionArtDetailsComponent,
  ],
  templateUrl: './auction-art-details-modal.component.html',
  styleUrl: './auction-art-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtDetailsModalComponent {
  idPhoto = viewChild<ElementRef>('idPhoto');

  isOpen = model.required<boolean>();
  auctionArtId = input.required<string>();

  wizardData = signal<ArtWizard>({} as ArtWizard);
  userDetails = signal<UserDetails>({} as UserDetails);

  #artWizardService = inject(ArtWizardService);
  #sanitizer = inject(DomSanitizer);

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

  auctionCarIdEffect = effect(() => {
    if (this.auctionArtId() && this.isOpen()) {
      this.#artWizardService.getArtWizardData$(this.auctionArtId()).pipe(
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

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  getUserDetails(): void {
    this.#artWizardService.getUserDetails$(this.auctionArtId()).subscribe({
      next: (response) => {
        this.userDetails.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
