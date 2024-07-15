import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@app/dashboard/services/requests-details.service';
import { AuctionArtDetails, UserDetails } from '@app/dashboard/interfaces';
import { MatTabsModule } from '@angular/material/tabs';
import { tap } from 'rxjs';

@Component({
  selector: 'art-requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent,
    MatTabsModule
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

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionArtById$(this.publicationId()).pipe(
        tap(() => this.getUserDetails())
      ).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

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
