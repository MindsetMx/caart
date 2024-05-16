import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtAuctionResultsFilterResultsComponent } from '@app/auction-results/pages/art-auction-results-filter-results/art-auction-results-vehicle-results.component';
import { AuctionResultsVehicleFilterResultsComponent } from '@app/auction-results/pages/auction-results-vehicle-filter-results/auction-results-vehicle-filter-results.component';
import { VehicleFilterResultsComponent } from '@auctions/components/vehicle-filter-results/vehicle-filter-results.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    AuctionResultsVehicleFilterResultsComponent,
    ArtAuctionResultsFilterResultsComponent
  ],
  templateUrl: './auction-results.component.html',
  styleUrl: './auction-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsComponent {
  tabs?: TabWithIcon[];
  currentTab = signal<number | undefined>(undefined);

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.#activatedRoute.queryParams.subscribe(params => {
      let tabId = +params['tab'];

      if (isNaN(tabId)) {
        tabId = 1;
      }

      this.currentTab.set(tabId);


      this.tabs =
        [
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
