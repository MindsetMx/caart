import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionTypes } from '@auctions/enums/auction-types';
import { VehicleAuctionData } from '@auctions/interfaces';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'auction-card2',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    FollowButtonComponent,
    RouterLink,
  ],
  templateUrl: './auction-card2.component.html',
  styleUrl: './auction-card2.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCard2Component {
  #countdownService = inject(CountdownService);

  auction = input.required<VehicleAuctionData>();

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }

  countdownConfig(auction: VehicleAuctionData): CountdownConfig {
    let leftTime = auction.attributes.secondsRemaining;
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
    };
  }

  getFormat(seconds: number): string {
    return this.#countdownService.getFormat(seconds);
  }
}
