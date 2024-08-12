import { AuctionTypes as AuctionTypes2 } from '@auctions/enums/auction-types';
import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';
import { CurrencyPipe, NgClass } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router, RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

import { Approved, ApprovedBids, MyAuctionsStatus, WinnerInfo } from '@activity/interfaces';
import { ApprovedService } from '@activity/services/approved.service';
import { AuctionOffersApprovalTableModalComponent } from '@activity/modals/auction-offers-approval-table-modal/auction-offers-approval-table-modal.component';
import { CountdownService } from '@shared/services/countdown.service';
import { AuctionTypes } from '@activity/enums';
import { AuctionOffersTableModalComponent } from '@activity/modals/auction-offers-table-modal/auction-offers-table-modal.component';
import { UpdateReservePriceModalComponent } from '@auctions/modals/update-reserve-price-modal/update-reserve-price-modal.component';
import { WinnerDetailsModalComponent } from '@activity/modals/winner-details-modal/winner-details-modal.component';
import { SoldAuctionBidTableModalComponent } from '@activity/modals/sold-auction-bid-table-modal/sold-auction-bid-table-modal.component';

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
    UpdateReservePriceModalComponent,
    WinnerDetailsModalComponent,
    RouterLink,
    MatBadgeModule,
    SoldAuctionBidTableModalComponent,
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
  isUpdateReservePriceModalOpen = signal<boolean>(false);

  isAuctionOffersApprovalTableModalOpen = signal<boolean>(false);
  isAuctionOffersTableModalOpen = signal<boolean>(false);
  auctionId = signal<string>('');
  auctionType = signal<AuctionTypes>(AuctionTypes.auto);
  reserveAmount = signal<number>(0);
  winnerInfo = signal<WinnerInfo>({} as WinnerInfo);
  isWinnerDetailsModalOpen = signal<boolean>(false);

  isSoldAuctionBidTableModalOpen = signal<boolean>(false);
  bids = signal<ApprovedBids[]>([]);

  getMyApprovedEffect = effect(() => {
    this.getMyApproved();
  });

  get myAuctionsStatus(): typeof MyAuctionsStatus {
    return MyAuctionsStatus;
  }

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  get auctionTypes2(): typeof AuctionTypes2 {
    return AuctionTypes2;
  }

  openSoldAuctionBidTableModal(bids: ApprovedBids[]): void {
    this.bids.set(bids);
    this.isSoldAuctionBidTableModalOpen.set(true);
  }

  openWinnerDetailsModal(winnerInfo: WinnerInfo): void {
    this.winnerInfo.set(winnerInfo);
    this.isWinnerDetailsModalOpen.set(true);
  }

  openUpdateReservePriceModal(auctionId: string, auctionType: AuctionTypes, reservePrice: number): void {
    this.auctionId.set(auctionId);
    this.auctionType.set(auctionType);
    this.reserveAmount.set(reservePrice);
    this.isUpdateReservePriceModalOpen.set(true);
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
