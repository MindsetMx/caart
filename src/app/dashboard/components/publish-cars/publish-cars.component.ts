import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AuctionCarDetailsModalComponent } from '@dashboard/modals/auction-car-details-modal/auction-car-details-modal.component';
import { AuctionCarInfo, AuctionCarStatus } from '@dashboard/interfaces';
import { AuctionCarService } from '@dashboard/services/auction-car.service';
import { ConfirmReleaseAuctionModalComponent } from '@dashboard/modals/confirm-release-auction-modal/confirm-release-auction-modal.component';
import { ReleaseCarForLiveAuctionModalComponent } from '@dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';
import { AppService } from '@app/app.service';

@Component({
  selector: 'publish-cars',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    AuctionCarDetailsModalComponent,
    ReleaseCarForLiveAuctionModalComponent,
    ConfirmReleaseAuctionModalComponent
  ],
  templateUrl: './publish-cars.component.html',
  styleUrl: './publish-cars.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishCarsComponent {
  #auctionCarService = inject(AuctionCarService);
  #appService = inject(AppService);

  auctionCarInfo = signal<AuctionCarInfo>({} as AuctionCarInfo);
  auctionCarId = signal<string>('');
  auctionCarDetailsModalIsOpen = signal<boolean>(false);
  addCarHistoryModalIsOpen = signal<boolean>(false);
  releaseCarForLiveAuctionModalIsOpen = signal<boolean>(false);
  confirmReleaseAuctionModalIsOpen = signal<boolean>(false);
  isConfirmReleaseAuctionButtonDisabled = signal<boolean>(false);

  constructor() {
    this.dashboardInfo();
  }

  get status(): typeof AuctionCarStatus {
    return AuctionCarStatus;
  }

  releaseCarForLiveAuction(event: { startDate: string; endDate: string }): void {
    this.isConfirmReleaseAuctionButtonDisabled.set(true);

    this.#auctionCarService.releaseCarForLiveAuction$(this.auctionCarId(), event.startDate, event.endDate).subscribe({
      next: () => {
        this.releaseCarForLiveAuctionModalIsOpen.set(false);
        this.confirmReleaseAuctionModalIsOpen.set(false);
        this.dashboardInfo();
        this.toastSuccess('El auto se ha publicado en subastas en vivo');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isConfirmReleaseAuctionButtonDisabled.set(false);
    });
  }

  dashboardInfo(): void {
    this.#auctionCarService.dashboardInfo$(
      1,
      50,
      'brand',
    ).subscribe((auctionCarInfo) => {
      // this.auctionCarInfo.set(auctionCarInfo);

      //reverser this.auctionCarInfo data
      this.auctionCarInfo.set({
        ...auctionCarInfo,
        data: auctionCarInfo.data.reverse()
      });
    });
  }

  closeAddCarHistoryModal(): void {
    this.addCarHistoryModalIsOpen.set(false);
  }

  closeReleaseCarForLiveAuctionModal(): void {
    this.releaseCarForLiveAuctionModalIsOpen.set(false);
  }

  openConfirmReleaseAuctionModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.confirmReleaseAuctionModalIsOpen.set(true);
  }

  openAuctionCarDetailsModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.auctionCarDetailsModalIsOpen.set(true);
  }

  openAddCarHistoryModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.addCarHistoryModalIsOpen.set(true);
  }

  openReleaseCarForLiveAuctionModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.releaseCarForLiveAuctionModalIsOpen.set(true);
  }

  closeAuctionCarDetailsModal(): void {
    this.auctionCarDetailsModalIsOpen.set(false);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
