import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionCarService } from '../../services/auction-car.service';
import { CommonModule } from '@angular/common';
import { AddCarHistoryModalComponent } from '@app/dashboard/modals/add-car-history-modal/add-car-history-modal.component';
import { ReleaseCarForLiveAuctionModalComponent } from '@app/dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';

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

  auctionCarInfo = this.#auctionCarService.auctionCarInfo;

  addCarHistoryModalIsOpen = signal<boolean>(false);
  releaseCarForLiveAuctionModalIsOpen = signal<boolean>(false);

  auctionCarId = signal<string>('');

  reloadAuctionCarInfo(): void {
    this.auctionCarInfo = this.#auctionCarService.auctionCarInfo;
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
