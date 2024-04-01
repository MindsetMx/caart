import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuctionCarService } from '../../services/auction-car.service';
import { CommonModule } from '@angular/common';
import { AddCarHistoryModalComponent } from '@app/dashboard/modals/add-car-history-modal/add-car-history-modal.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    AddCarHistoryModalComponent
  ],
  templateUrl: './publish-cars.component.html',
  styleUrl: './publish-cars.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishCarsComponent {
  #auctionCarService = inject(AuctionCarService);

  auctionCarInfo = this.#auctionCarService.auctionCarInfo;

  addCarHistoryModalIsOpen = signal<boolean>(false);

  openAddCarHistoryModal(auctionId: string): void {
    // this.#auctionCarService.setAuctionId(auctionId);
    this.addCarHistoryModalIsOpen.set(true);
  }

  closeAddCarHistoryModal(): void {
    this.addCarHistoryModalIsOpen.set(false);
  }
}
