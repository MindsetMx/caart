import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuctionTypes } from '@auctions/enums';
import { MyLiveCarAuctions } from '@auctions/interfaces';
import { UpdateReservePriceModalComponent } from '@auctions/modals/update-reserve-price-modal/update-reserve-price-modal.component';
import { MyLiveCarAuctionsService } from '@auctions/services/my-live-car-auctions.service';

@Component({
  selector: 'my-live-car-auctions',
  standalone: true,
  imports: [
    UpdateReservePriceModalComponent,
  ],
  templateUrl: './my-live-car-auctions.component.html',
  styleUrl: './my-live-car-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLiveCarAuctionsComponent {
  #myLiveCarAuctionsService = inject(MyLiveCarAuctionsService);

  myLiveCarAuctions = signal<MyLiveCarAuctions>({} as MyLiveCarAuctions);
  publicationId = signal<string>('');
  reservePrice = signal<number>(0);
  isUpdateReservePriceModalOpen = signal<boolean>(false);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.getMyLiveCarAuctions();
  }

  openUpdateReservePriceModal(publicationId: string, reservePrice: number): void {
    this.publicationId.set(publicationId);
    this.reservePrice.set(reservePrice);
    this.isUpdateReservePriceModalOpen.set(true);
  }

  getMyLiveCarAuctions(): void {
    this.#myLiveCarAuctionsService.getMyLiveCarAuctions$().subscribe({
      next: (auctionCarPublishes) => {
        this.myLiveCarAuctions.set(auctionCarPublishes);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
