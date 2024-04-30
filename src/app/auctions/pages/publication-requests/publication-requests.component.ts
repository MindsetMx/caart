import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ArtRequestsComponent } from '@auctions/components/art-requests/art-requests.component';
import { InputDirective } from '@shared/directives';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { VehicleRequestsComponent } from '@auctions/components/vehicle-requests/vehicle-requests.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputDirective,
    VehicleRequestsComponent,
    ArtRequestsComponent,
    TabsWithIconsComponent
  ],
  templateUrl: './publication-requests.component.html',
  styleUrl: './publication-requests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationRequestsComponent {
  tabs: TabWithIcon[];
  currentTab = signal<TabWithIcon>({} as TabWithIcon);

  constructor() {
    this.tabs =
      [
        {
          id: 1,
          name: 'Automóviles',
          img: 'assets/img/registrar auto/car-sport-outline.svg',
          current: true
        },
        {
          id: 2,
          name: 'Arte',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        },
        {
          id: 3,
          name: 'Memorabilia',
          img: 'assets/img/registrar auto/milo-venus.svg',
          current: false
        }
      ];
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTab.set(tab);
  }
}
