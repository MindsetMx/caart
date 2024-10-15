import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MomentModule } from 'ngx-moment';

import { IntersectionDirective } from '@shared/directives';
import { SpecificAuctionBid } from '@auctions/interfaces';
import { GetBidsBid } from '@auctions/interfaces/get-bids';
import { LastChanceBidsBid } from '@app/last-chance/interfaces';

@Component({
  selector: 'bid-history',
  standalone: true,
  imports: [
    MomentModule,
    CurrencyPipe,
    NgClass,
    IntersectionDirective,
  ],
  templateUrl: './bid-history.component.html',
  styleUrl: './bid-history.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BidHistoryComponent {
  amount = input.required<number | undefined>();
  bids = input.required<GetBidsBid[] | LastChanceBidsBid[]>();
  isWinnerInfoInitialized = input.required<boolean>();
  purchaseDate = input.required<string | undefined>();
  userName = input.required<string | undefined>();

  loadMoreBidsChange = output<void>();

  loadMoreBids(): void {
    this.loadMoreBidsChange.emit();
  }

  transformDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Type guard for GetBidsBid
  isGetBidsBid(bid: any): bid is GetBidsBid {
    return (bid as GetBidsBid).bidTime !== undefined;
  }

  // Type guard for LastChanceBidsBid
  isLastChanceBidsBid(bid: any): bid is LastChanceBidsBid {
    return (bid as LastChanceBidsBid).bidDate !== undefined;
  }
}
