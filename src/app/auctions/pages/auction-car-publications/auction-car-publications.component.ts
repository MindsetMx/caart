import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionCarPublicationsData } from '@app/auctions/interfaces/auction-car-publishes';
import { AuctionService } from '@app/auctions/services/auction.service';

@Component({
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './auction-car-publications.component.html',
  styleUrl: './auction-car-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarPublishesComponent implements OnInit {
  #auctionService = inject(AuctionService);
  auctionCarPublishes: WritableSignal<AuctionCarPublicationsData[]> = signal([]);

  ngOnInit(): void {
    this.getAuctionCarPublishes();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {

      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }
}
