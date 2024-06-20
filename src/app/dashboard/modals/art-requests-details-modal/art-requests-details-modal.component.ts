import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';

import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '@app/dashboard/services/requests-details.service';

@Component({
  selector: 'art-requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent
  ],
  templateUrl: './art-requests-details-modal.component.html',
  styleUrl: './art-requests-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtRequestsDetailsModalComponent {
  isOpen = model.required<boolean>();
  publicationId = input.required<string>();

  auction = signal<any>({} as any);

  #requestsDetailsService = inject(RequestsDetailsService);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionArtById$(this.publicationId()).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

  closeModal(): void {
    this.isOpen.set(false);
  }
}
