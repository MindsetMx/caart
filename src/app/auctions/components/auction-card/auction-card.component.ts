import { ChangeDetectionStrategy, Component, effect, inject, input, model } from '@angular/core';
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
  secondsRemaining = model.required<number>();

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

  secondsRemainingEffect = effect((onCleanup) => {
    if (this.secondsRemaining() > 0) {
      const interval = setInterval(() => {
        this.secondsRemaining.update((value) => value - 1);
      }, 1000);

      this.secondsRemainingEffect.destroy();

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
