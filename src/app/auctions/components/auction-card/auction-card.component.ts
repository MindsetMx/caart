import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { VehicleAuctionData } from '@app/auctions/interfaces';

@Component({
  selector: 'auction-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule
  ],
  templateUrl: './auction-card.component.html',
  styleUrl: './auction-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCardComponent {
  @Input({ required: true }) auction!: VehicleAuctionData;

  countdownConfig(auction: VehicleAuctionData): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(auction.attributes.endDate);
    return {
      leftTime: leftTime,
      format: this.getFormat(leftTime)
    };
  }

  getSecondsUntilEndDate(endDate: string): number {
    let now = new Date();
    let end = new Date(endDate);
    let difference = end.getTime() - now.getTime();

    return Math.floor(difference / 1000);
  }

  getFormat(seconds: number): string {
    return seconds >= 86400 ? 'd\'d\', H\'h\'' : 'HH:mm:ss';
  }
}
