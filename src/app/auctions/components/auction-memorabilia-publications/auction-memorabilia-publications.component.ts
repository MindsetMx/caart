import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuctionMemorabiliaPublications } from '@auctions/interfaces';
import { AuctionMemorabiliaService } from '@auctions/services/auction-memorabilia.service';
import { AuctionTypes } from '@auctions/enums';

@Component({
  selector: 'auction-memorabilia-publications',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auction-memorabilia-publications.component.html',
  styleUrl: './auction-memorabilia-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionMemorabiliaPublicationsComponent {
  hasGeneralInfo = input.required<boolean>();
  completeRegisterModalChange = output<{ publicationId: string; auctionType: AuctionTypes }>();

  auctionMemorabiliaPublishes = signal<AuctionMemorabiliaPublications>({} as AuctionMemorabiliaPublications);

  #auctionMemorabiliaService = inject(AuctionMemorabiliaService);

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.getAuctionMemorabilia();
  }

  getAuctionMemorabilia(): void {
    this.#auctionMemorabiliaService.getMemorabiliaPublications$().subscribe((auctionMemorabilia) => {
      this.auctionMemorabiliaPublishes.set(auctionMemorabilia);
    });
  }

  openCompleteRegisterModal(publicationId: string, auctionType: AuctionTypes): void {
    this.completeRegisterModalChange.emit({ publicationId, auctionType });
  }
}
