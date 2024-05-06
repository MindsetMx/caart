import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AuctionArtInfo } from '@app/dashboard/interfaces';
import { AuctionArtService } from '@app/dashboard/services/auction-art.service';
import { ReleaseCarForLiveAuctionModalComponent } from '@app/dashboard/modals/release-car-for-live-auction-modal/release-car-for-live-auction-modal.component';
import { AuctionArtDetailsModalComponent } from '@app/dashboard/modals/auction-art-details-modal/auction-art-details-modal.component';

@Component({
  selector: 'publish-art',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    AuctionArtDetailsModalComponent,
    ReleaseCarForLiveAuctionModalComponent,
  ],
  templateUrl: './publish-art.component.html',
  styleUrl: './publish-art.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishArtComponent {
  #auctionArtService = inject(AuctionArtService);

  auctionArtInfo = signal<AuctionArtInfo>({} as AuctionArtInfo);
  auctionArtId = signal<string>('');
  auctionArtDetailsModalIsOpen = signal<boolean>(false);
  releaseArtForLiveAuctionModalIsOpen = signal<boolean>(false);
  // auctionArtDetailsModalIsOpen = signal<boolean>(false);

  constructor() {
    this.dashboardInfo();
  }

  dashboardInfo(): void {
    this.#auctionArtService.dashboardInfo$(
      1,
      50,
      'brand',
    ).subscribe((auctionCarInfo) => {
      // this.auctionCarInfo.set(auctionCarInfo);

      //reverser this.auctionCarInfo data
      this.auctionArtInfo.set({
        ...auctionCarInfo,
        data: auctionCarInfo.data.reverse()
      });
    });
  }

  openReleaseCarForLiveAuctionModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.releaseArtForLiveAuctionModalIsOpen.set(true);
  }

  openAuctionArtDetailsModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.auctionArtDetailsModalIsOpen.set(true);
  }

  closeAuctionArtDetailsModal(): void {
    this.auctionArtDetailsModalIsOpen.set(false);
  }
}
