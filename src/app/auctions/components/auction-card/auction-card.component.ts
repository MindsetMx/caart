import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Router, RouterLink } from '@angular/router';

import { CountdownService } from '@shared/services/countdown.service';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { VehicleAuctionData } from '@app/auctions/interfaces';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { NoReserveTagComponentComponent } from '../no-reserve-tag-component/no-reserve-tag-component.component';
import { AuctionStatus } from '@auctions/enums';

@Component({
  selector: 'auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    NoReserveTagComponentComponent
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCardComponent {
  // auction = input.required<VehicleAuctionData>();
  originalAuctionCarId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  reserve = input.required<boolean>();
  premium = input.required<boolean>();
  extract = input.required<string>();
  lastBid = input.required<number>();
  endDate = input.required<string>();
  status = input.required<AuctionStatus>();

  #countdownService = inject(CountdownService);
  #router = inject(Router);

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get statusTypes(): typeof AuctionStatus {
    return AuctionStatus;
  }

  get isHomeRoute(): boolean {
    return this.#router.url === '/home';
  }

  countdownConfig(): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(this.endDate());
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
