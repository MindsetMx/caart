import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivityRequests, ActivityRequestsStatus, ActivityRequestsType } from '@activity/interfaces';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { AuctionCarService } from '@dashboard/services/auction-car.service';
import { AppService } from '@app/app.service';
import { ConfirmationModalComponent } from '@shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'activity-auction-requests-progress',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltipModule,
    MatPaginatorModule,
    RouterLink,
    ConfirmationModalComponent,
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
  isAcceptPreviewCarAuctionButtonDisabled = signal<boolean>(false);
  confirmAcceptPreviewCarModalIsOpen = signal<boolean>(false);
  auctionArtId = signal<string>('');
  isAcceptPreviewArtAuctionButtonDisabled = signal<boolean>(false);
  confirmAcceptPreviewArtModalIsOpen = signal<boolean>(false);

  #activityRequestsService = inject(ActivityRequestsService);
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

  acceptPreviewCar(): void {
    this.isAcceptPreviewCarAuctionButtonDisabled.set(true);

    this.#activityRequestsService.acceptPreviewCar$(this.auctionCarId()).subscribe({
      next: () => {
        this.getMyRequests();
        this.confirmAcceptPreviewCarModalIsOpen.set(false);
        this.toastSuccess('El auto fue aceptado para vista previa');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isAcceptPreviewCarAuctionButtonDisabled.set(false);
    });
  }

  acceptPreviewArt(): void {
    this.isAcceptPreviewArtAuctionButtonDisabled.set(true);

    this.#activityRequestsService.acceptPreviewArt$(this.auctionArtId()).subscribe({
      next: () => {
        this.getMyRequests();
        this.confirmAcceptPreviewArtModalIsOpen.set(false);
        this.toastSuccess('La obra fue aceptada para vista previa');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isAcceptPreviewArtAuctionButtonDisabled.set(false);
    });
  }

  openConfirmAcceptPreviewCarModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.confirmAcceptPreviewCarModalIsOpen.set(true);
  }

  openConfirmAcceptPreviewArtModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.confirmAcceptPreviewArtModalIsOpen.set(true);
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
