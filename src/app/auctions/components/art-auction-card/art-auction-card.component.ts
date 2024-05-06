import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionTypes } from '@auctions/enums';
import { ArtAuctionData } from '@auctions/interfaces/art-auction';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'art-auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent
  ],
  templateUrl: './art-auction-card.component.html',
  styleUrl: './art-auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionCardComponent {
  auction = input.required<ArtAuctionData>();

  #countdownService = inject(CountdownService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  countdownConfig(auction: any): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(auction.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
    };
  }

  getSecondsUntilEndDate(endDate: string): number {
    return this.#countdownService.getSecondsUntilEndDate(endDate);
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }
}
