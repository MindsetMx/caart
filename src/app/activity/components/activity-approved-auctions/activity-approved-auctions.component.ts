import { CommonModule, CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ApprovedService } from '@activity/services/approved.service';
import { Approved } from '@app/activity/interfaces';
import { CountdownService } from '@shared/services/countdown.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'activity-approved-auctions',
  standalone: true,
  imports: [
    CountdownModule,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './activity-approved-auctions.component.html',
  styleUrl: './activity-approved-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityApprovedAuctionsComponent {
  #approvedService = inject(ApprovedService);
  #countdownService = inject(CountdownService);

  approvedAuctions = signal<Approved>({} as Approved);
  currentPage = signal<number>(1);
  size = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  constructor() {
    this.getMyApproved();
  }

  getMyApproved(): void {
    this.#approvedService.getMyApproved$(this.currentPage(), this.size()).subscribe((requests) => {
      this.approvedAuctions.set(requests);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(requests.meta.totalCount));
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
      for (let i = this.approvedAuctions().meta.pageSize; i <= totalItems; i += this.approvedAuctions().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }
}
