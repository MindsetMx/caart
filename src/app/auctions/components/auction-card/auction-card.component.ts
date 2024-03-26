import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { RouterLink } from '@angular/router';

import { CountdownService } from '@shared/services/countdown.service';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { VehicleAuctionData } from '@app/auctions/interfaces';
import { AuctionTypes } from '@auctions/enums/auction-types';

@Component({
  selector: 'auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCardComponent {
  auction = input.required<VehicleAuctionData>();

  #countdownService = inject(CountdownService);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  countdownConfig(auction: VehicleAuctionData): CountdownConfig {
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
