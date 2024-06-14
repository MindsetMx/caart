import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AppService } from '@app/app.service';
import { AcceptLastChanceBidModalComponent } from '@auctions/modals/accept-last-chance-bid-modal/accept-last-chance-bid-modal.component';
import { RejectLastChanceBidModalComponent } from '@auctions/modals/reject-last-chance-bid-modal/reject-last-chance-bid-modal.component';
import { LastChanceArtAuctionsService } from '@auctions/services/last-chance-art-auctions.service';
import { ArtAuctions } from '@auth/interfaces';

@Component({
  selector: 'art-auctions',
  standalone: true,
  imports: [
    CommonModule,
    AcceptLastChanceBidModalComponent,
    RejectLastChanceBidModalComponent,
  ],
  templateUrl: './art-auctions.component.html',
  styleUrl: './art-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionsComponent {
  #lastChanceArtAuctionsService = inject(LastChanceArtAuctionsService);
  #appService = inject(AppService);

  auctions = signal<ArtAuctions>({} as ArtAuctions);
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
    this.#lastChanceArtAuctionsService.getMyAuctions$().subscribe((response) => {
      this.auctions.set(response);
    });
  }

  acceptOffer(): void {
    this.#lastChanceArtAuctionsService.acceptOffer$(this.auctionId(), this.bidId()).subscribe({
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
    this.#lastChanceArtAuctionsService.rejectBid$(this.auctionId(), this.bidId()).subscribe({
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
