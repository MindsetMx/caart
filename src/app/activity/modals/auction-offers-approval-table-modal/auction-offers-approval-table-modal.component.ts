import { ChangeDetectionStrategy, Component, effect, inject, input, model, output, signal } from '@angular/core';

import { AcceptLastChanceBidModalComponent } from '@auctions/modals/accept-last-chance-bid-modal/accept-last-chance-bid-modal.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RejectLastChanceBidModalComponent } from '@auctions/modals/reject-last-chance-bid-modal/reject-last-chance-bid-modal.component';
import { LastChanceCarAuctionsService } from '@auctions/services/last-chance-car-auctions.service';
import { AppService } from '@app/app.service';
import { LastChanceArtAuctionsService } from '@auctions/services/last-chance-art-auctions.service';
import { AuctionOffersApprovalService } from '@activity/services/auction-offers-approval.service';
import { ArtAuctionOffersApproval, CarAuctionOffersApproval } from '@activity/interfaces';
import { AuctionTypes } from '@activity/enums';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'auction-offers-approval-table-modal',
  standalone: true,
  imports: [
    ModalComponent,
    AcceptLastChanceBidModalComponent,
    RejectLastChanceBidModalComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './auction-offers-approval-table-modal.component.html',
  styleUrl: './auction-offers-approval-table-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionOffersApprovalTableModalComponent {
  isOpen = model.required<boolean>();

  auctionId = input.required<string>();
  auctionType = input.required<AuctionTypes>();

  offerAccepted = output<void>();

  bidId = signal<string>('');
  isAcceptLastChanceBidModalOpen = signal<boolean>(false);
  isAcceptLastChanceBidButtonDisabled = signal<boolean>(false);
  carAuctionOffers = signal<CarAuctionOffersApproval>({} as CarAuctionOffersApproval);
  artAuctionOffers = signal<ArtAuctionOffersApproval>({} as ArtAuctionOffersApproval);
  lastChanceAuctionId = signal<string>('');

  isRejectBidModalOpen = signal<boolean>(false);
  isRejectBidButtonDisabled = signal<boolean>(false);

  #lastChanceCarAuctionsService = inject(LastChanceCarAuctionsService);
  #lastChanceArtAuctionsService = inject(LastChanceArtAuctionsService);
  #auctionOffersApprovalService = inject(AuctionOffersApprovalService);
  #appService = inject(AppService);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  isOpenEffect = effect(() => {
    if (!this.isOpen()) {
      this.carAuctionOffers.set({} as CarAuctionOffersApproval);
      this.artAuctionOffers.set({} as ArtAuctionOffersApproval);
    }
  }, { allowSignalWrites: true });

  auctionTypeEffect = effect(() => {
    if (this.auctionId() && this.auctionType() && this.isOpen()) {
      switch (this.auctionType()) {
        case AuctionTypes.auto:
          this.getCarAuctionOffersApproval();
          break;

        case AuctionTypes.arte:
          this.getArtAuctionOffersApproval();
          break;
      }
    }
  });

  getCarAuctionOffersApproval(): void {
    this.#auctionOffersApprovalService.getCarAuctionOffersApproval$(this.auctionId()).subscribe({
      next: (response) => {
        this.carAuctionOffers.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getArtAuctionOffersApproval(): void {
    this.#auctionOffersApprovalService.getArtAuctionOffersApproval$(this.auctionId()).subscribe({
      next: (response) => {
        this.artAuctionOffers.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  isAcceptLastChanceBidModalOpenChange(isOpen: boolean): void {
    if (!isOpen) {
      this.isOpen.set(true);
    }
  }

  isRejectBidModalOpenChange(isOpen: boolean): void {
    if (!isOpen) {
      this.isOpen.set(true);
    }
  }

  openAcceptLastChanceBidModal(bidId: string, lastChanceAuctionId: string): void {
    this.lastChanceAuctionId.set(lastChanceAuctionId);
    this.bidId.set(bidId);
    this.isOpen.set(false);
    this.isAcceptLastChanceBidModalOpen.set(true);
  }

  openRejectBidModal(bidId: string, lastChanceAuctionId: string): void {
    this.lastChanceAuctionId.set(lastChanceAuctionId);
    this.bidId.set(bidId);
    this.isOpen.set(false);
    this.isRejectBidModalOpen.set(true);
  }

  acceptOffer(): void {
    switch (this.auctionType()) {
      case AuctionTypes.auto:
        this.acceptCarOffer();
        break;
      case AuctionTypes.arte:
        this.acceptArtOffer();
        break;
    }
  }

  rejectBid(): void {
    switch (this.auctionType()) {
      case AuctionTypes.auto:
        this.rejectCarBid();
        break;
      case AuctionTypes.arte:
        this.rejectArtBid();
        break;
    }
  }

  acceptCarOffer(): void {
    this.isAcceptLastChanceBidButtonDisabled.set(true);

    this.#lastChanceCarAuctionsService.acceptOffer$(this.lastChanceAuctionId(), this.bidId()).subscribe({
      next: () => {
        // this.getMyAuctions();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isAcceptLastChanceBidModalOpen.set(false);
      this.offerAccepted.emit();
    });
  }

  rejectCarBid(): void {
    this.isRejectBidButtonDisabled.set(true);

    this.#lastChanceCarAuctionsService.rejectBid$(this.lastChanceAuctionId(), this.bidId()).subscribe({
      next: () => {
        // this.getMyAuctions();
        this.toastSuccess('Solicitud rechazada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isRejectBidModalOpen.set(false);
      this.isOpen.set(true);
      this.getCarAuctionOffersApproval();
    });
  }

  acceptArtOffer(): void {
    this.isAcceptLastChanceBidButtonDisabled.set(true);

    this.#lastChanceArtAuctionsService.acceptOffer$(this.lastChanceAuctionId(), this.bidId()).subscribe({
      next: () => {
        // this.getMyAuctions();
        this.toastSuccess('Solicitud aceptada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isAcceptLastChanceBidModalOpen.set(false);
      this.offerAccepted.emit();
    });
  }

  rejectArtBid(): void {
    this.isRejectBidButtonDisabled.set(true);

    this.#lastChanceArtAuctionsService.rejectBid$(this.lastChanceAuctionId(), this.bidId()).subscribe({
      next: () => {
        // this.getMyAuctions();
        this.toastSuccess('Solicitud rechazada');
      },
      error: (error) => {
        console.error(error);
      }
    }).add(() => {
      this.isRejectBidModalOpen.set(false);
      this.isOpen.set(true);
      this.getArtAuctionOffersApproval();
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
