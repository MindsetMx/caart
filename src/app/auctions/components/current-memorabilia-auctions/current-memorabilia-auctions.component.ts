import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MemorabiliaAuction, MemorabiliaAuctionData, VehicleAuctionData } from '@auctions/interfaces';
import { MemorabiliaFilterService } from '@auctions/services/memorabilia-filter.service';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'current-memorabilia-auctions',
  standalone: true,
  imports: [
    RouterLink,
    FollowButtonComponent,
    CurrencyPipe,
    CountdownModule,
    CommonModule
  ],
  templateUrl: './current-memorabilia-auctions.component.html',
  styleUrl: './current-memorabilia-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentMemorabiliaAuctionsComponent {
  liveAuctions = signal<MemorabiliaAuction>({} as MemorabiliaAuction);
  auctionId = input.required<string | null>();

  #memorabiliaFilterService = inject(MemorabiliaFilterService);
  #countdownService = inject(CountdownService);

  auctionIdEffect = effect(() => {
    this.getMemorabiliaAuctions();
  });

  ngOnInit(): void {
    this.getMemorabiliaAuctions();
  }

  getMemorabiliaAuctions(): void {
    this.#memorabiliaFilterService.getLiveAuctions$(
      1,
      5,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.auctionId()
    ).subscribe((response) => {
      this.liveAuctions.set(response);
    });
  }

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
