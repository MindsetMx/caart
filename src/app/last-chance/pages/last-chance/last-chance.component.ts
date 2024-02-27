import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LastChanceVehicleFilterResultsComponent } from '@app/last-chance/components/last-chance-vehicle-filter-results/last-chance-vehicle-filter-results.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  selector: 'app-last-chance',
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    LastChanceVehicleFilterResultsComponent
  ],
  templateUrl: './last-chance.component.html',
  styleUrl: './last-chance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceComponent {
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
