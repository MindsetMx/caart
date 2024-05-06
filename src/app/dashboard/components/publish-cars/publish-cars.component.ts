import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AuctionCarDetailsModalComponent } from '@dashboard/modals/auction-car-details-modal/auction-car-details-modal.component';
import { AuctionCarInfo } from '@dashboard/interfaces';
import { AuctionCarService } from '@dashboard/services/auction-car.service';
import { ReleaseCarForLiveAuctionModalComponent } from '@dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';

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
  ],
  templateUrl: './publish-cars.component.html',
  styleUrl: './publish-cars.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishCarsComponent {
  #auctionCarService = inject(AuctionCarService);

  auctionCarInfo = signal<AuctionCarInfo>({} as AuctionCarInfo);
  auctionCarId = signal<string>('');
  auctionCarDetailsModalIsOpen = signal<boolean>(false);
  addCarHistoryModalIsOpen = signal<boolean>(false);
  releaseCarForLiveAuctionModalIsOpen = signal<boolean>(false);

  constructor() {
    this.dashboardInfo();
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
}
