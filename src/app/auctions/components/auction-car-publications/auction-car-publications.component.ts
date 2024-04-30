import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionTypes } from '@auctions/enums';
import { AuctionCarPublicationsData } from '@auctions/interfaces';
import { AuctionService } from '@auctions/services/auction.service';

@Component({
  selector: 'auction-car-publications',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auction-car-publications.component.html',
  styleUrl: './auction-car-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarPublicationsComponent {
  hasGeneralInfo = input.required<boolean>();
  completeRegisterModalChange = output<{ publicationId: string; auctionType: AuctionTypes }>();

  #auctionService = inject(AuctionService);

  auctionCarPublishes = signal<AuctionCarPublicationsData[]>([]);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.getAuctionCarPublishes();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {
      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }

  openCompleteRegisterModal(publicationId: string, auctionType: AuctionTypes): void {
    this.completeRegisterModalChange.emit({ publicationId, auctionType });
  }
}
