import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AuctionArtInfo } from '@dashboard/interfaces';
import { AuctionArtService } from '@dashboard/services/auction-art.service';
import { AuctionArtDetailsModalComponent } from '@dashboard/modals/auction-art-details-modal/auction-art-details-modal.component';
import { ReleaseArtForLiveAuctionModalComponent } from '@dashboard/modals/release-art-for-live-auction-modal/release-art-for-live-auction-modal.component';

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
    ReleaseArtForLiveAuctionModalComponent
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
    ).subscribe((auctionArtInfo) => {
      // this.auctionArtInfo.set(auctionArtInfo);

      //reverser this.auctionArtInfo data
      this.auctionArtInfo.set({
        ...auctionArtInfo,
        data: auctionArtInfo.data.reverse()
      });
    });
  }

  openReleaseArtForLiveAuctionModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.releaseArtForLiveAuctionModalIsOpen.set(true);
  }

  closeReleaseArtForLiveAuctionModal(): void {
    this.releaseArtForLiveAuctionModalIsOpen.set(false);
  }

  openAuctionArtDetailsModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.auctionArtDetailsModalIsOpen.set(true);
  }

  closeAuctionArtDetailsModal(): void {
    this.auctionArtDetailsModalIsOpen.set(false);
  }
}
