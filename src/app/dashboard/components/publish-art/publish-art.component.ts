import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { AppService } from '@app/app.service';
import { AuctionArtDetailsModalComponent } from '@dashboard/modals/auction-art-details-modal/auction-art-details-modal.component';
import { AuctionArtInfo, AuctionArtStatus } from '@dashboard/interfaces';
import { AuctionArtService } from '@dashboard/services/auction-art.service';
import { ConfirmReleaseAuctionModalComponent } from '@dashboard/modals/confirm-release-auction-modal/confirm-release-auction-modal.component';
import { ReleaseArtAuctionForPreviewModalComponent } from '@dashboard/modals/release-art-auction-for-preview-modal/release-art-auction-for-preview-modal.component';
import { EditArtAuctionPreviewComponent } from '@dashboard/modals/edit-art-auction-preview-modal/edit-art-auction-preview-modal.component';
import { AuctionTypes } from '@auctions/enums';

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
    ReleaseArtAuctionForPreviewModalComponent,
    ConfirmReleaseAuctionModalComponent,
    EditArtAuctionPreviewComponent
  ],
  templateUrl: './publish-art.component.html',
  styleUrl: './publish-art.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishArtComponent {
  #auctionArtService = inject(AuctionArtService);
  #appService = inject(AppService);

  auctionArtInfo = signal<AuctionArtInfo>({} as AuctionArtInfo);
  auctionArtId = signal<string>('');
  auctionArtDetailsModalIsOpen = signal<boolean>(false);
  releaseAuctionForPreviewModalIsOpen = signal<boolean>(false);
  // auctionArtDetailsModalIsOpen = signal<boolean>(false);
  confirmReleaseAuctionModalIsOpen = signal<boolean>(false);
  isConfirmReleaseAuctionButtonDisabled = signal<boolean>(false);
  editAuctionPreviewModalIsOpen = signal<boolean>(false);

  auctionTypes = AuctionTypes;

  get status(): typeof AuctionArtStatus {
    return AuctionArtStatus;
  }

  constructor() {
    this.dashboardInfo();
  }

  releaseArtForLiveAuction(event: { startDate: string; endDate: string }): void {
    this.isConfirmReleaseAuctionButtonDisabled.set(true);

    this.#auctionArtService.releaseArtForLiveAuction$(this.auctionArtId(), event.startDate, event.endDate).subscribe({
      next: (response) => {
        this.releaseAuctionForPreviewModalIsOpen.set(false);
        this.confirmReleaseAuctionModalIsOpen.set(false);
        this.dashboardInfo();
        this.toastSuccess('La obra se ha publicado en subastas en vivo');
      },
      error: (error) => {
        console.error(error);
      },
    }).add(() => {
      this.isConfirmReleaseAuctionButtonDisabled.set(false);
    });
  }

  toggleComingSoon(originalId: string): void {
    this.#auctionArtService.toggleComingSoon$(originalId, this.auctionTypes.art).subscribe((response) => {
      this.dashboardInfo();

      response.data.comingSoon ? this.toastSuccess('La obra se ha marcado como "Próximamente"') : this.toastSuccess('La obra se ha desmarcado como "Próximamente"');
    });
  }

  openConfirmReleaseAuctionModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.confirmReleaseAuctionModalIsOpen.set(true);
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

  openModalToReleaseAuctionForPreview(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.releaseAuctionForPreviewModalIsOpen.set(true);
  }

  openEditAuctionPreviewModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.editAuctionPreviewModalIsOpen.set(true);
  }

  closeReleaseAuctionForPreviewModal(): void {
    this.releaseAuctionForPreviewModalIsOpen.set(false);
  }

  openAuctionArtDetailsModal(auctionId: string): void {
    this.auctionArtId.set(auctionId);
    this.auctionArtDetailsModalIsOpen.set(true);
  }

  closeAuctionArtDetailsModal(): void {
    this.auctionArtDetailsModalIsOpen.set(false);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
