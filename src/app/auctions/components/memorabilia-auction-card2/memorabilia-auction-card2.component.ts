import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { GetAllAuctionsData, MemorabiliaAuctionData } from '@auctions/interfaces';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'memorabilia-auction-card2',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FollowButtonComponent,
    CountdownModule
  ],
  templateUrl: './memorabilia-auction-card2.component.html',
  styleUrl: './memorabilia-auction-card2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemorabiliaAuctionCard2Component {
  auction = input.required<GetAllAuctionsData>();

  #countdownService = inject(CountdownService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  countdownConfig(auction: GetAllAuctionsData): CountdownConfig {
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
