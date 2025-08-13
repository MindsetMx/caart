import { ChangeDetectionStrategy, Component, effect, input, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionResultsTypes } from '@app/auction-results/enums';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';
import { RouterLink } from '@angular/router';
import { AuctionStatusComponent } from '@auctions/components/auction-status/auction-status.component';
import { FavoritesSource } from '@app/favorites/enums';

@Component({
  selector: 'auction-results-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FollowButtonComponent,
    NoReserveTagComponentComponent,
    AuctionStatusComponent,
  ],
  templateUrl: './auction-results-vehicle-card.component.html',
  styleUrl: './auction-results-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsVehicleCardComponent {
  auctionType2 = input.required<AuctionResultsTypes>();
  originalAuctionId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  hasReserve = input.required<boolean>();
  isPremium = input.required<boolean>();
  extract = input.required<string>();
  lastBid = input.required<number | null>();
  endDate = input.required<string>();
  source = input<FavoritesSource>();

  auctionLink = signal<string | undefined>(undefined);

  auctionType2Effect = effect(() => {
    untracked(() => {
      switch (this.auctionType2()) {
        case AuctionResultsTypes.auctionsCar:
          this.auctionLink.set('/subasta');
          break;
        case AuctionResultsTypes.lastChanceAuction:
          this.auctionLink.set('/ultima-oportunidad');
          break;
        case AuctionResultsTypes.auctionArt:
          this.auctionLink.set('/subasta-arte');
          break;
        case AuctionResultsTypes.lastChanceAuctionArt:
          this.auctionLink.set('/ultima-oportunidad-arte');
          break;
      }
    });
  });

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }
}
