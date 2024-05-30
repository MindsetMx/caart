import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { LastChanceCarAuctions } from '@auctions/interfaces';
import { LastChanceCarAuctionsService } from '@auctions/services/last-chance-car-auctions.service';
import { AcceptLastChanceBidModalComponent } from '@auctions/modals/accept-last-chance-bid-modal/accept-last-chance-bid-modal.component';
import { RejectLastChanceBidModalComponent } from '@auctions/modals/reject-last-chance-bid-modal/reject-last-chance-bid-modal.component';

@Component({
  selector: 'car-auctions',
  standalone: true,
  imports: [
    CommonModule,
    AcceptLastChanceBidModalComponent,
    RejectLastChanceBidModalComponent,
  ],
  templateUrl: './car-auctions.component.html',
  styleUrl: './car-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarAuctionsComponent {
  #lastChanceCarAuctionsService = inject(LastChanceCarAuctionsService);
  #appService = inject(AppService);

  auctions = signal<LastChanceCarAuctions>({} as LastChanceCarAuctions);
  isAcceptLastChanceBidModalOpen = signal<boolean>(false);
  isAcceptLastChanceBidButtonDisabled = signal<boolean>(false);
  auctionId = signal<string>('');
  bidId = signal<string>('');
  isRejectBidModalOpen = signal<boolean>(false);
  isRejectBidButtonDisabled = signal<boolean>(false);

  constructor() {
    this.getMyAuctions();
  }

  openAcceptLastChanceBidModal(auctionId: string, bidId: string): void {
    this.auctionId.set(auctionId);
    this.bidId.set(bidId);
    this.isAcceptLastChanceBidModalOpen.set(true);
  }

  openRejectBidModal(auctionId: string, bidId: string): void {
    this.auctionId.set(auctionId);
    this.bidId.set(bidId);
    this.isRejectBidModalOpen.set(true);
  }

  getMyAuctions(): void {
    this.#lastChanceCarAuctionsService.getMyAuctions$().subscribe((response) => {
      this.auctions.set(response);
    });
  }

  acceptOffer(): void {
    this.#lastChanceCarAuctionsService.acceptOffer$(this.auctionId(), this.bidId()).subscribe({
      next: () => {
        this.getMyAuctions();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isAcceptLastChanceBidModalOpen.set(false);
    });
  }

  rejectBid(): void {
    this.#lastChanceCarAuctionsService.rejectBid$(this.auctionId(), this.bidId()).subscribe({
      next: () => {
        this.getMyAuctions();
        this.toastSuccess('Solicitud rechazada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isRejectBidModalOpen.set(false);
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
