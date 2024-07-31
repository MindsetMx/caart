import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@app/dashboard/services/requests-details.service';
import { AuctionArtDetails, UserDetails } from '@app/dashboard/interfaces';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
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
  isOpen = model.required<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionArtDetails>({} as AuctionArtDetails);
  userDetails = signal<UserDetails>({} as UserDetails);

  #requestsDetailsService = inject(RequestsDetailsService);
  #sanitizer = inject(DomSanitizer);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionArtById$(this.publicationId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 1) {
      Fancybox.bind("[data-fancybox='idPhotoGallery']", { Hash: false });
    }
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
