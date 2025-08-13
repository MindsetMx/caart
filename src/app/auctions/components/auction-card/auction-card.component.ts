import { ChangeDetectionStrategy, Component, inject, input, model, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Router, RouterLink } from '@angular/router';

import { AuctionStatus } from '@auctions/enums';
import { AuctionStatusComponent } from '@auctions/components/auction-status/auction-status.component';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { CountdownService } from '@shared/services/countdown.service';
import { environments } from '@env/environments';
import { FavoritesSource } from '@favorites/enums';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';

export interface EventData {
  type: string;
  auctions: Auction[];
}

export interface Auction {
  id: string;
  originalAuctionId: string;
  secondsRemaining: number;
  auctionType: string;
}

@Component({
  selector: 'auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    NoReserveTagComponentComponent,
    AuctionStatusComponent,
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCardComponent implements OnDestroy {
  readonly #baseUrl = environments.baseUrl;

  originalAuctionCarId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  reserve = input.required<boolean>();
  premium = input.required<boolean>();
  extract = input.required<string>();
  lastBid = input.required<number>();
  endDate = input.required<string>();
  status = input.required<AuctionStatus>();
  isComingSoon = input.required<boolean>();
  secondsRemaining = model.required<number>();
  startDate = input.required<string>();

  source = input<FavoritesSource>();

  #countdownService = inject(CountdownService);
  #router = inject(Router);
  platformId = inject(PLATFORM_ID);

  eventSource?: EventSource;

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get statusTypes(): typeof AuctionStatus {
    return AuctionStatus;
  }

  get isHomeRoute(): boolean {
    return this.#router.url === '/home';
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-all-auctions`);

      this.eventSource.onmessage = (event) => {
        const data: EventData = JSON.parse(event.data);

        const auctions = data.auctions;

        if (data.type === 'TIME_UPDATE') {

          const auction = auctions.find(auction => auction.originalAuctionId === this.originalAuctionCarId());

          if (auction) {
            this.secondsRemaining.set(auction.secondsRemaining);
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  countdownConfig(): CountdownConfig {
    return {
      leftTime: this.secondsRemaining(),
      format: this.getFormat(this.secondsRemaining()),
      prettyText: (text) => this.#countdownService.prettyText(this.secondsRemaining(), text),
    };
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }
}
