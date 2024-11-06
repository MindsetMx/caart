import { ChangeDetectionStrategy, Component, effect, inject, input, model, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { Router, RouterLink } from '@angular/router';

import { AuctionStatus, AuctionTypes } from '@auctions/enums';
import { AuctionStatusComponent } from '@auctions/components/auction-status/auction-status.component';
import { CountdownService } from '@shared/services/countdown.service';
import { environments } from '@env/environments';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { NoReserveTagComponentComponent } from '@auctions/components/no-reserve-tag-component/no-reserve-tag-component.component';
import { FavoritesSource } from '@favorites/enums';

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
  selector: 'art-auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    NoReserveTagComponentComponent,
    AuctionStatusComponent,
  ],
  templateUrl: './art-auction-card.component.html',
  styleUrl: './art-auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionCardComponent implements OnDestroy {
  readonly #baseUrl = environments.baseUrl;

  originalAuctionArtId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  reserve = input.required<boolean>();
  premium = input.required<boolean>();
  extract = input.required<string>();
  lastBid = input.required<number>();
  endDate = input.required<string>();
  status = input.required<string>();
  isComingSoon = input.required<boolean>();
  secondsRemaining = model.required<number>();

  source = input<FavoritesSource>();

  #countdownService = inject(CountdownService);
  #router = inject(Router);

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
    this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-all-auctions`);

    this.eventSource.onmessage = (event) => {
      const data: EventData = JSON.parse(event.data);

      const auctions = data.auctions;

      if (data.type === 'TIME_UPDATE') {

        const auction = auctions.find(auction => auction.originalAuctionId === this.originalAuctionArtId());

        if (auction) {
          this.secondsRemaining.set(auction.secondsRemaining);
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  secondsRemainingEffect = effect((onCleanup) => {
    if (this.secondsRemaining() > 0) {
      const interval = setInterval(() => {
        this.secondsRemaining.update((value) => value - 1);
      }, 1000);

      onCleanup(() => {
        clearInterval(interval);
      });
    }
  });

  countdownConfig(): CountdownConfig {
    return {
      leftTime: this.secondsRemaining(),
      format: this.getFormat(this.secondsRemaining())
    };
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }
}
