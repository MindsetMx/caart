import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LiveAuctionsTabs } from '@dashboard/enums';
import { GetLiveAuctions } from '@dashboard/interfaces';
import { LiveAuctionsService } from '@dashboard/services/live-auctions.service';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'live-auctions',
  standalone: true,
  imports: [
    CountdownModule,
    NgClass,
    CurrencyPipe,
    MatPaginatorModule,
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveCarAuctionsComponent {
  page = model.required<number>();
  size = model.required<number>();
  currentLiveAuctionsTab = input.required<LiveAuctionsTabs>();

  #countdownService = inject(CountdownService);
  #liveAuctionsService = inject(LiveAuctionsService);
  #router = inject(Router);

  auctions = signal<GetLiveAuctions>({} as GetLiveAuctions);

  pageSizeOptions = signal<number[]>([]);

  getLiveAuctionsEffect = effect(() => {
    if (this.page() && this.size())
      this.getLiveAuctions();
  });

  getLiveAuctions(): void {
    this.#liveAuctionsService.getLiveAuctions$(this.page(), this.size(), 1, this.currentLiveAuctionsTab()).subscribe(response => {
      this.auctions.set(response);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(response.meta.totalCount));
    });
  }

  countdownConfig(endDate: string): CountdownConfig {
    let leftTime = this.getSecondsUntilEndDate(endDate);
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

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.auctions().meta.pageSize; i <= totalItems; i += this.auctions().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }


  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page1: this.page(),
        size1: this.size()
      },
      queryParamsHandling: 'merge',
    });
  }
}
