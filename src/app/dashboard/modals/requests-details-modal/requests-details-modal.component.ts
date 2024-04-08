import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RequestsDetailsService } from '../../services/requests-details.service';
import { AuctionDetails } from '@app/dashboard/interfaces';

@Component({
  selector: 'requests-details-modal',
  standalone: true,
  imports: [
    ModalComponent
  ],
  templateUrl: './requests-details-modal.component.html',
  styleUrl: './requests-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsDetailsModalComponent {
  isOpen = input.required<boolean>();
  isOpenChange = output<boolean>();
  publicationId = input.required<string>();

  auction = signal<AuctionDetails>({} as AuctionDetails);

  #requestsDetailsService = inject(RequestsDetailsService);

  publicationIdEffect = effect(() => {
    if (this.publicationId()) {
      this.#requestsDetailsService.getAuctionCarById$(this.publicationId()).subscribe((response) => {
        this.auction.set(response);
      });
    }
  });

  emitIsOpenChange(isOpen: boolean): void {
    this.isOpenChange.emit(isOpen);
  }
}
