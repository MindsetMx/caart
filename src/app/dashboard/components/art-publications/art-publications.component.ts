import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionArtPublications } from '@auctions/interfaces';
import { ArtPublicationsService } from '@auctions/services/art-publications.service';

@Component({
  selector: 'art-publications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './art-publications.component.html',
  styleUrl: './art-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtPublicationsComponent {
  #artPublicationsService = inject(ArtPublicationsService);

  artAuctionPublications = signal<AuctionArtPublications>({} as AuctionArtPublications);

  constructor() {
    this.getAuctionArtPublishes();
  }

  getAuctionArtPublishes(): void {
    this.#artPublicationsService.getAuctionArtPublications$().subscribe((auctionCarPublishes) => {
      this.artAuctionPublications.set(auctionCarPublishes);
    });
  }
}
