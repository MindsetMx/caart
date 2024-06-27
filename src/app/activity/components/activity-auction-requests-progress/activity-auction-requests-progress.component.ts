import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivityRequests, ActivityRequestsStatus, ActivityRequestsType } from '@activity/interfaces';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { ConfirmReleaseAuctionModalComponent } from '@app/dashboard/modals/confirm-release-auction-modal/confirm-release-auction-modal.component';
import { AuctionCarService } from '@dashboard/services/auction-car.service';
import { AppService } from '@app/app.service';
import { ReleaseCarForLiveAuctionModalComponent } from '@app/dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';
import { ReleaseArtForLiveAuctionModalComponent } from '@app/dashboard/modals/release-art-for-live-auction-modal/release-art-for-live-auction-modal.component';

@Component({
  selector: 'activity-auction-requests-progress',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltipModule,
    MatPaginatorModule,
    RouterLink,
    ConfirmReleaseAuctionModalComponent,
    ReleaseCarForLiveAuctionModalComponent,
    ReleaseArtForLiveAuctionModalComponent,
  ],
  templateUrl: './activity-auction-requests-progress.component.html',
  styleUrl: './activity-auction-requests-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityAuctionRequestsProgressComponent {
  requests = signal<ActivityRequests>({} as ActivityRequests);
  currentPage = signal<number>(1);
  size = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);
  auctionCarId = signal<string>('');
  confirmReleaseAuctionModalIsOpen = signal<boolean>(false);
  isConfirmReleaseAuctionButtonDisabled = signal<boolean>(false);
  releaseCarForLiveAuctionModalIsOpen = signal<boolean>(false);

  #activityRequestsService = inject(ActivityRequestsService);
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);

  get activityRequestsStatus(): typeof ActivityRequestsStatus {
    return ActivityRequestsStatus;
  }

  get activityRequestsType(): typeof ActivityRequestsType {
    return ActivityRequestsType;
  }

  constructor() {
    this.getMyRequests();
  }

  getMyRequests(): void {
    this.#activityRequestsService.getMyRequests$(this.currentPage(), this.size()).subscribe((requests) => {
      this.requests.set(requests);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(requests.meta.totalCount));
    });
  }

  releaseCarForLiveAuction(): void {
    this.isConfirmReleaseAuctionButtonDisabled.set(true);

    this.#auctionCarService.releaseCarForLiveAuction$(this.auctionCarId()).subscribe({
      next: () => {
        this.releaseCarForLiveAuctionModalIsOpen.set(false);
        this.confirmReleaseAuctionModalIsOpen.set(false);
        this.getMyRequests();
        this.toastSuccess('El auto se ha publicado en subastas en vivo');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isConfirmReleaseAuctionButtonDisabled.set(false);
    });
  }

  openConfirmReleaseAuctionModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.confirmReleaseAuctionModalIsOpen.set(true);
  }

  closeReleaseCarForLiveAuctionModal(): void {
    this.releaseCarForLiveAuctionModalIsOpen.set(false);
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.requests().meta.pageSize; i <= totalItems; i += this.requests().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.pageIndex + 1);
    this.size.set(event.pageSize);
    this.getMyRequests();
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
