import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemorabiliaAuctionData } from '@auctions/interfaces';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'memorabilia-auction-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FollowButtonComponent,
    CountdownModule
  ],
  templateUrl: './memorabilia-auction-card.component.html',
  styleUrl: './memorabilia-auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemorabiliaAuctionCardComponent {
  auction = input.required<MemorabiliaAuctionData>();

  #countdownService = inject(CountdownService);

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
