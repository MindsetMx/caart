import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { RouterLink } from '@angular/router';

import { CountdownService } from '@shared/services/countdown.service';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { MemorabiliaAuctionData } from '@auctions/interfaces';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  selector: 'auction-memorabilia-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CountdownModule,
    FollowButtonComponent
  ],
  templateUrl: './auction-memorabilia-card.component.html',
  styleUrl: './auction-memorabilia-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionMemorabiliaCardComponent {
  #countdownService = inject(CountdownService);

  auction = input.required<MemorabiliaAuctionData>();

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  countdownConfig(auction: MemorabiliaAuctionData): CountdownConfig {
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
