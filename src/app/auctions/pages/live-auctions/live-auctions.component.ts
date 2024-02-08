import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuctionFilterMenuComponent } from '@app/auctions/components/auction-filter-menu/auction-filter-menu.component';
import { SortComponent } from '@shared/components/sort/sort.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

const MOBILE_SCREEN_WIDTH = 1024;
@Component({
  selector: 'app-live-auctions',
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    SortComponent,
    TertiaryButtonDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    AuctionFilterMenuComponent
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
  tabs: TabWithIcon[];
  currentTab = signal<TabWithIcon>({} as TabWithIcon);
  toppings = new FormControl('');
  auctionFilterMenuIsOpen = signal<boolean>(false);

  isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH; // Actualiza el valor en tiempo real
  }

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
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

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
