import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AuctionTypes } from '@auctions/enums';
import { MyLiveArtAuctions } from '@auctions/interfaces';
import { MyLiveArtAuctionsService } from '@auctions/services/my-live-art-auctions.service';
import { UpdateReservePriceModalComponent } from '@auctions/modals/update-reserve-price-modal/update-reserve-price-modal.component';

@Component({
  selector: 'my-live-art-auctions',
  standalone: true,
  imports: [
    UpdateReservePriceModalComponent
  ],
  templateUrl: './my-live-art-auctions.component.html',
  styleUrl: './my-live-art-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLiveArtAuctionsComponent {
  #myLiveArtAuctionsService = inject(MyLiveArtAuctionsService);

  myLiveArtAuctions = signal<MyLiveArtAuctions>({} as MyLiveArtAuctions);
  publicationId = signal<string>('');
  reservePrice = signal<number>(0);
  isUpdateReservePriceModalOpen = signal<boolean>(false);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.getMyLiveArtAuctions();
  }

  openUpdateReservePriceModal(publicationId: string, reservePrice: number): void {
    this.publicationId.set(publicationId);
    this.reservePrice.set(reservePrice);
    this.isUpdateReservePriceModalOpen.set(true);
  }

  getMyLiveArtAuctions(): void {
    this.#myLiveArtAuctionsService.getMyLiveArtAuctions$().subscribe({
      next: (auctionArtPublishes) => {
        this.myLiveArtAuctions.set(auctionArtPublishes);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
