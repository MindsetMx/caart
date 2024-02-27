import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleAuctionData } from '@auctions/interfaces';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'app-last-chance-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent
  ],
  templateUrl: './last-chance-vehicle-card.component.html',
  styleUrl: './last-chance-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceVehicleCardComponent {
  auction = input.required<VehicleAuctionData>();

  #countdownService = inject(CountdownService);

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
