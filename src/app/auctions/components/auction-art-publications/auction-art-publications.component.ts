import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtPublicationsService } from '@auctions/services/art-publications.service';
import { AuctionTypes } from '@auctions/enums';
import { AuctionArtPublications } from '@auctions/interfaces';

@Component({
  selector: 'auction-art-publications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './auction-art-publications.component.html',
  styleUrl: './auction-art-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionArtPublicationsComponent {
  hasGeneralInfo = input.required<boolean>();
  completeRegisterModalChange = output<{ publicationId: string; auctionType: AuctionTypes }>();

  artAuctionPublications = signal<AuctionArtPublications>({} as AuctionArtPublications);

  #artPublicationsService = inject(ArtPublicationsService);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.getAuctionArtPublishes();
  }

  getAuctionArtPublishes(): void {
    this.#artPublicationsService.getAuctionArtPublications$().subscribe((auctionCarPublishes) => {
      this.artAuctionPublications.set(auctionCarPublishes);
    });
  }

  openCompleteRegisterModal(publicationId: string, auctionType: AuctionTypes): void {
    this.completeRegisterModalChange.emit({ publicationId, auctionType });
  }
}
