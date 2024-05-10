import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { VehicleFilterResultsComponent } from '@app/auctions/components/vehicle-filter-results/vehicle-filter-results.component';
import { MemorabiliaFilterResultsComponent } from '@auctions/components/memorabilia-filter-results/memorabilia-filter-results.component';
import { AllAuctionsFilterResultsComponent } from '@auctions/components/all-auctions-filter-results/all-auctions-filter-results.component';
import { ArtFilterResultsComponent } from '@auctions/components/art-filter-results/art-filter-results.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    VehicleFilterResultsComponent,
    MemorabiliaFilterResultsComponent,
    AllAuctionsFilterResultsComponent,
    ArtFilterResultsComponent
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
  tabs?: TabWithIcon[];
  currentTab = signal<number | undefined>(undefined);

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

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
