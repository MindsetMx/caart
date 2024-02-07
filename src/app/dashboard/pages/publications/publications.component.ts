import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';

import { AuctionCarPublicationsData } from '@app/auctions/interfaces/auction-car-publishes';
import { AuctionService } from '@app/auctions/services/auction.service';
import { SidebarComponent } from '@app/dashboard/layout/sidebar/sidebar.component';
import { AuthStatus } from '@auth/enums';
import { AuthService } from '@auth/services/auth.service';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { EMPTY, Observable, catchError, map } from 'rxjs';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [
    SidebarComponent,
  ],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationsComponent implements OnInit {
  #auctionService = inject(AuctionService);
  #authService = inject(AuthService);
  #generalInfoService = inject(GeneralInfoService);

  auctionCarPublishes = signal<AuctionCarPublicationsData[]>([]);

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

  ngOnInit(): void {
    this.getAuctionCarPublishes();
  }

  getAuctionCarPublishes(): void {
    this.#auctionService.auctionCarPublications$().subscribe((auctionCarPublishes) => {
      this.auctionCarPublishes.set(auctionCarPublishes.data);
    });
  }
}
