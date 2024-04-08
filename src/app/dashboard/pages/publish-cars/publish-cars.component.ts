import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionCarService } from '../../services/auction-car.service';
import { CommonModule } from '@angular/common';
import { AddCarHistoryModalComponent } from '@app/dashboard/modals/add-car-history-modal/add-car-history-modal.component';
import { ReleaseCarForLiveAuctionModalComponent } from '@app/dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';
import { AuctionCarInfo } from '@app/dashboard/interfaces';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    AddCarHistoryModalComponent,
    ReleaseCarForLiveAuctionModalComponent
  ],
  templateUrl: './publish-cars.component.html',
  styleUrl: './publish-cars.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishCarsComponent {
  #auctionCarService = inject(AuctionCarService);

  auctionCarInfo = signal<AuctionCarInfo>({} as AuctionCarInfo);

  addCarHistoryModalIsOpen = signal<boolean>(false);
  releaseCarForLiveAuctionModalIsOpen = signal<boolean>(false);

  auctionCarId = signal<string>('');

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

  openAddCarHistoryModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.addCarHistoryModalIsOpen.set(true);
  }

  closeAddCarHistoryModal(): void {
    this.addCarHistoryModalIsOpen.set(false);
  }

  openReleaseCarForLiveAuctionModal(auctionId: string): void {
    this.auctionCarId.set(auctionId);
    this.releaseCarForLiveAuctionModalIsOpen.set(true);
  }

  closeReleaseCarForLiveAuctionModal(): void {
    this.releaseCarForLiveAuctionModalIsOpen.set(false);
  }
}
