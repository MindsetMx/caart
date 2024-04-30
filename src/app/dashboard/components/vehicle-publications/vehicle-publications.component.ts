import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { AuctionCarPublicationsData } from '@auctions/interfaces';
import { AuctionService } from '@auctions/services/auction.service';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vehicle-publications',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './vehicle-publications.component.html',
  styleUrl: './vehicle-publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePublicationsComponent {
  #auctionService = inject(AuctionService);

  auctionCarPublishes = signal<AuctionCarPublicationsData[]>([]);

  ngOnInit(): void {
    this.getAuctionCarPublishes();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {
      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }
}
