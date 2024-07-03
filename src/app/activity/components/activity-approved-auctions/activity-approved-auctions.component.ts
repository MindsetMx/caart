import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { Approved, MyAuctionsStatus } from '@activity/interfaces';
import { ApprovedService } from '@activity/services/approved.service';
import { AuctionOffersApprovalTableModalComponent } from '@activity/modals/auction-offers-approval-table-modal/auction-offers-approval-table-modal.component';
import { CountdownService } from '@shared/services/countdown.service';
import { AuctionTypes } from '@activity/enums';
import { AuctionOffersTableModalComponent } from '@activity/modals/auction-offers-table-modal/auction-offers-table-modal.component';

@Component({
  selector: 'activity-approved-auctions',
  standalone: true,
  imports: [
    CountdownModule,
    NgClass,
    CurrencyPipe,
    MatPaginatorModule,
    AuctionOffersApprovalTableModalComponent,
    AuctionOffersTableModalComponent,
  ],
  templateUrl: './activity-approved-auctions.component.html',
  styleUrl: './activity-approved-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityApprovedAuctionsComponent {
  page = model.required<number>();
  size = model.required<number>();

  #approvedService = inject(ApprovedService);
  #countdownService = inject(CountdownService);
  #router = inject(Router);

  approvedAuctions = signal<Approved>({} as Approved);
  pageSizeOptions = signal<number[]>([]);

  isAuctionOffersApprovalTableModalOpen = signal<boolean>(false);
  isAuctionOffersTableModalOpen = signal<boolean>(false);
  auctionId = signal<string>('');
  auctionType = signal<AuctionTypes>(AuctionTypes.auto);

  getMyApprovedEffect = effect(() => {
    this.getMyApproved();
  });

  get myAuctionsStatus(): typeof MyAuctionsStatus {
    return MyAuctionsStatus;
  }

  openAuctionOffersApprovalTableModal(auctionId: string, auctionType: AuctionTypes): void {
    this.auctionId.set(auctionId);
    this.auctionType.set(auctionType);
    this.isAuctionOffersApprovalTableModalOpen.set(true);
  }

  openAuctionOffersTableModal(auctionId: string, auctionType: AuctionTypes): void {
    this.auctionId.set(auctionId);
    this.auctionType.set(auctionType);
    this.isAuctionOffersTableModalOpen.set(true);
  }

  getMyApproved(): void {
    this.#approvedService.getMyApproved$(this.page(), this.size()).subscribe((requests) => {
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

  onPageChange(event: any): void {
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page2: this.page(),
        size2: this.size()
      },
      queryParamsHandling: 'merge',
    });
  }
}
