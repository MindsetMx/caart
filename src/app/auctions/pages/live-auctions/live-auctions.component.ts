import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SortComponent } from '@shared/components/sort/sort.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  selector: 'app-live-auctions',
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    SortComponent,
    TertiaryButtonDirective
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
  tabs: TabWithIcon[];
  currentTab = signal<TabWithIcon>({} as TabWithIcon);

  constructor() {
    this.tabs =
      [
        {
          id: 1,
          name: 'Todo',
          img: 'assets/img/icons/apps-outline.svg',
          current: true
        },
        {
          id: 2,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: false
        },
        {
          id: 3,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        },
      ];

    this.currentTab.set(this.tabs[0]);
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }
}
