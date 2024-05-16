import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { RouterLink } from '@angular/router';
import { VehicleAuctionData } from '@app/auctions/interfaces';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  selector: 'auction-results-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FollowButtonComponent
  ],
  templateUrl: './auction-results-vehicle-card.component.html',
  styleUrl: './auction-results-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsVehicleCardComponent {
  auctionLink = input.required<string>();
  originalAuctionId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  hasReserve = input.required<boolean>();
  isPremium = input.required<boolean>();
  extract = input.required<string>();
  lastBid = input.required<number>();
  endDate = input.required<string>();

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }
}
