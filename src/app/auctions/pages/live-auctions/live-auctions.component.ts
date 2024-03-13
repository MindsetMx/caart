import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { VehicleFilterResultsComponent } from '@app/auctions/components/vehicle-filter-results/vehicle-filter-results.component';
import { MemorabiliaFilterResultsComponent } from '@auctions/components/memorabilia-filter-results/memorabilia-filter-results.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    VehicleFilterResultsComponent,
    MemorabiliaFilterResultsComponent,
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
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
          current: false
        },
        {
          id: 3,
          name: 'Memorabilia',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: true
        },
      ];

    this.currentTab.set(this.tabs[this.tabs.findIndex((tab) => tab.current)]);

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
