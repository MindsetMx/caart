import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { VehicleFilterResultsComponent } from '@app/auctions/components/vehicle-filter-results/vehicle-filter-results.component';
import { MemorabiliaFilterResultsComponent } from '@auctions/components/memorabilia-filter-results/memorabilia-filter-results.component';
import { AllAuctionsFilterResultsComponent } from '@auctions/components/all-auctions-filter-results/all-auctions-filter-results.component';
import { ArtFilterResultsComponent } from '@auctions/components/art-filter-results/art-filter-results.component';
import { environments } from '@env/environments';
import { UpdatedAuctionTypes } from '@auctions/enums';
import { LiveAuctionsService } from '@auctions/services/live-auctions.service';
import { GetLiveArtAuction, GetLiveCarAuction } from '@auctions/interfaces';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    VehicleFilterResultsComponent,
    AllAuctionsFilterResultsComponent,
    ArtFilterResultsComponent
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent implements OnDestroy {
  readonly #baseUrl = environments.baseUrl;

  tabs?: TabWithIcon[];
  currentTab = signal<number | undefined>(undefined);
  eventSource?: EventSource;

  updatedCarAuction = signal<GetLiveCarAuction>({} as GetLiveCarAuction);
  updatedArtAuction = signal<GetLiveArtAuction>({} as GetLiveArtAuction);

  reserveNotMetCarId = signal<string>('');
  reserveNotMetArtId = signal<string>('');

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);
  #liveAuctionsService = inject(LiveAuctionsService);

  constructor() {
    this.#activatedRoute.queryParams.subscribe(params => {
      let tabId = +params['tab']; // Obtiene el id de la pestaña de los parámetros de consulta

      if (isNaN(tabId)) {
        tabId = 1;
      }

      this.currentTab.set(tabId);

      this.tabs = [
        {
          id: 1,
          name: 'Todo',
          img: 'assets/img/icons/apps-outline.svg',
          current: tabId === 1
        },
        {
          id: 2,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: tabId === 2
        },
        {
          id: 3,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: tabId === 3
        },
      ];
    });

    this.eventSource?.close();

    this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe-all-auctions`);

    this.eventSource.onmessage = (event) => {
      if (JSON.parse(event.data).type === 'AUCTION_UPDATE' || JSON.parse(event.data).type === 'LAST_CHANCE' || JSON.parse(event.data).type === 'COMPLETED') {
        const auctionType = JSON.parse(event.data).auctionType;

        switch (auctionType) {
          case UpdatedAuctionTypes.activeAuctionCar:
            this.getUpdatedCarAuction(JSON.parse(event.data).auctionId);
            break;

          case UpdatedAuctionTypes.activeAuctionArt:
            this.getUpdatedArtAuction(JSON.parse(event.data).auctionId);
            break;
        }
      }

      // if (JSON.parse(event.data).type === 'LAST_CHANCE') {
      //   const auctionType = JSON.parse(event.data).auctionType;

      //   switch (auctionType) {
      //     case UpdatedAuctionTypes.activeAuctionCar:
      //       this.reserveNotMetCarId.set(JSON.parse(event.data).auctionId);
      //       break;

      //     case UpdatedAuctionTypes.activeAuctionArt:
      //       this.reserveNotMetArtId.set(JSON.parse(event.data).auctionId);
      //       break;
      //   }
      // }
    };
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  getUpdatedCarAuction(auctionCarId: string): void {
    this.#liveAuctionsService.getCarAuction$(auctionCarId).subscribe({
      next: (auction: GetLiveCarAuction) => {
        this.updatedCarAuction.set(auction);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getUpdatedArtAuction(auctionArtId: string): void {
    this.#liveAuctionsService.getArtAuction$(auctionArtId).subscribe({
      next: (auction: any) => {
        this.updatedArtAuction.set(auction);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab.id);

    this.navigateWithQueryParams(tab.id);
  }

  private navigateWithQueryParams(tabId: number): void {
    this.#router.navigate([], {
      queryParams: {
        tab: tabId
      },
      queryParamsHandling: 'merge'
    });
  }
}
