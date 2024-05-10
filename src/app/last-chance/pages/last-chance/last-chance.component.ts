import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LastChanceArtFilterResultsComponent } from '@lastChance/components/last-chance-art-filter-results/last-chance-art-filter-results.component';
import { LastChanceVehicleFilterResultsComponent } from '@lastChance/components/last-chance-vehicle-filter-results/last-chance-vehicle-filter-results.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    LastChanceVehicleFilterResultsComponent,
    LastChanceArtFilterResultsComponent
  ],
  templateUrl: './last-chance.component.html',
  styleUrl: './last-chance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceComponent {
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
