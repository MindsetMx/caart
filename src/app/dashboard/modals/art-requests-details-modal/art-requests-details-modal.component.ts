import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, signal, viewChild } from '@angular/core';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@app/dashboard/services/requests-details.service';
import { AuctionArtDetails, UserDetails } from '@app/dashboard/interfaces';
import { MatTabsModule } from '@angular/material/tabs';
import { tap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'art-requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CurrencyPipe
  ],
  templateUrl: './art-requests-details-modal.component.html',
  styleUrl: './art-requests-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRequestsDetailsModalComponent {
  idPhoto = viewChild<ElementRef>('idPhoto');

  isOpen = model.required<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionArtDetails>({} as AuctionArtDetails);
  userDetails = signal<UserDetails>({} as UserDetails);

  #requestsDetailsService = inject(RequestsDetailsService);
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

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionArtById$(this.publicationId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

  getSafeUrl(video: string): SafeResourceUrl {
    return this.#sanitizer.bypassSecurityTrustResourceUrl(video);
  }

  getUserDetails(): void {
    this.#requestsDetailsService.getUserDetails$(this.publicationId()).subscribe({
      next: (response) => {
        this.userDetails.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
