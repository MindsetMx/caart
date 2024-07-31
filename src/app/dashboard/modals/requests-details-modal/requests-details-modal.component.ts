import { Carousel, Fancybox } from '@fancyapps/ui';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { tap } from 'rxjs';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';

import { AuctionDetails, UserDetails } from '@dashboard/interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@dashboard/services/requests-details.service';

@Component({
  selector: 'requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './requests-details-modal.component.html',
  styleUrl: './requests-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsDetailsModalComponent {
  idPhoto = viewChild<ElementRef>('idPhoto');

  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionDetails>({} as AuctionDetails);
  userDetails = signal<UserDetails>({} as UserDetails);

  #requestsDetailsService = inject(RequestsDetailsService);
  #sanitizer = inject(DomSanitizer);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionCarById$(this.publicationId()).pipe(
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

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
