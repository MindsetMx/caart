import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal, untracked } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Fancybox } from '@fancyapps/ui';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { forkJoin, tap } from 'rxjs';

import { AuctionArtDetails, UserDetails } from '@dashboard/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@dashboard/services/requests-details.service';

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
  isOpen = model.required<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionArtDetails>({} as AuctionArtDetails);
  userDetails = signal<UserDetails>({} as UserDetails);
  selectedTabIndex = signal<number>(0);

  #requestsDetailsService = inject(RequestsDetailsService);
  #sanitizer = inject(DomSanitizer);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      untracked(() => {
        this.selectedTabIndex.set(0);
        this.auction.set({} as AuctionArtDetails);
        this.userDetails.set({} as UserDetails);
      });

      forkJoin({
        auction: this.#requestsDetailsService.getAuctionArtById$(this.publicationId()),
        userDetails: this.#requestsDetailsService.getUserDetails$(this.publicationId())
      }).subscribe({
        next: ({ auction, userDetails }) => {
          this.auction.set(auction);
          this.userDetails.set(userDetails);
          Fancybox.bind("[data-fancybox='photoGallery']", { Hash: false });
          Fancybox.bind("[data-fancybox='idPhotoGallery']", { Hash: false });
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  });

  // onTabChange(event: MatTabChangeEvent) {
  //   if (event.index === 1) {
  //     Fancybox.bind("[data-fancybox='idPhotoGallery']", { Hash: false });
  //   }
  // }

  changeTab(index: number): void {
    this.selectedTabIndex.set(index);
  }

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
