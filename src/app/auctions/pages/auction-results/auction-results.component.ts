import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionResultsVehicleFilterResultsComponent } from '@app/auction-results/pages/auction-results-vehicle-filter-results/auction-results-vehicle-filter-results.component';
import { VehicleFilterResultsComponent } from '@auctions/components/vehicle-filter-results/vehicle-filter-results.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    AuctionResultsVehicleFilterResultsComponent
  ],
  templateUrl: './auction-results.component.html',
  styleUrl: './auction-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsComponent {
  tabs: TabWithIcon[];
  currentTab = signal<TabWithIcon>({} as TabWithIcon);

  #router = inject(Router);

  constructor() {
    this.tabs =
      [
        {
          id: 1,
          name: 'Todo',
          img: 'assets/img/icons/apps-outline.svg',
          current: false
        },
        {
          id: 2,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: true
        },
        {
          id: 3,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        },
      ];

    this.currentTab.set(this.tabs[1]);

    this.navigateWithQueryParams(this.currentTab().id);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);

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
