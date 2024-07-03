import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { AcceptLastChanceBidModalComponent } from '@auctions/modals/accept-last-chance-bid-modal/accept-last-chance-bid-modal.component';
import { AppService } from '@app/app.service';
import { AuctionOffersService } from '@activity/services/auction-offers.service';
import { AuctionTypes } from '@activity/enums';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { RejectLastChanceBidModalComponent } from '@auctions/modals/reject-last-chance-bid-modal/reject-last-chance-bid-modal.component';
import { ArtAuctionOffers, CarAuctionOffers } from '@activity/interfaces';

@Component({
  selector: 'auction-offers-table-modal',
  standalone: true,
  imports: [
    ModalComponent,
    AcceptLastChanceBidModalComponent,
    RejectLastChanceBidModalComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './auction-offers-table-modal.component.html',
  styleUrl: './auction-offers-table-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionOffersTableModalComponent {
  isOpen = model.required<boolean>();

  auctionId = input.required<string>();
  auctionType = input.required<AuctionTypes>();

  carAuctionOffers = signal<CarAuctionOffers>({} as CarAuctionOffers);
  artAuctionOffers = signal<ArtAuctionOffers>({} as ArtAuctionOffers);

  #auctionOffersService = inject(AuctionOffersService);
  #appService = inject(AppService);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  isOpenEffect = effect(() => {
    if (!this.isOpen()) {
      this.carAuctionOffers.set({} as CarAuctionOffers);
      this.artAuctionOffers.set({} as ArtAuctionOffers);
    }
  }, { allowSignalWrites: true });

  auctionTypeEffect = effect(() => {
    if (this.auctionId() && this.auctionType() && this.isOpen()) {
      switch (this.auctionType()) {
        case AuctionTypes.auto:
          this.getCarAuctionOffers();
          break;

        case AuctionTypes.arte:
          this.getArtAuctionOffers();
          break;
      }
    }
  });

  getCarAuctionOffers(): void {
    this.#auctionOffersService.getCarAuctionOffers$(this.auctionId()).subscribe({
      next: (response) => {
        this.carAuctionOffers.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getArtAuctionOffers(): void {
    this.#auctionOffersService.getArtAuctionOffers$(this.auctionId()).subscribe({
      next: (response) => {
        this.artAuctionOffers.set(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
