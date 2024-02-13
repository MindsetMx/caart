import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuctionFilterMenuComponent } from '@app/auctions/components/auction-filter-menu/auction-filter-menu.component';
import { SortComponent } from '@shared/components/sort/sort.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';

import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { states } from '@shared/states';

const MOBILE_SCREEN_WIDTH = 1024;
@Component({
  selector: 'app-live-auctions',
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    SortComponent,
    TertiaryButtonDirective,
    PrimaryButtonDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    AuctionFilterMenuComponent,
    YearRangeComponent
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
  tabs: TabWithIcon[];
  currentTab = signal<TabWithIcon>({} as TabWithIcon);
  auctionType = new FormControl('');
  category = new FormControl('');
  currentOffer = new FormControl('');
  era = new FormControl('');
  orderBy = new FormControl('');
  endsIn = new FormControl('');
  states = new FormControl('');

  auctionFilterMenuIsOpen = signal<boolean>(false);

  #router = inject(Router);

  isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH; // Actualiza el valor en tiempo real
  }

  auctionTypeList: string[] = ['Premium', 'Sin reserva'];
  categoryList: string[] = ['Automoviles', 'Electricos', 'Proyectos', 'Autopartes', 'Rines'];
  currentOfferList: string[] = ['Menor a 200,000', 'Menor a 500,00', 'Menor a 750,000', 'Menor a 1,000,000', 'Menor a 2,000,000'];
  endsInList: string[] = ['1 hora', '4 horas', '1 día', '5 días', '7 días'];
  eraList: string[] = ['2020s', '2010s', '2000s', '1990s', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s', '1910s', '1900s', 'Pre-1900s'];
  orderByList: string[] = ['Tiempo Menor a mayor', 'Tiempo Mayor a Menor', 'Precio Menor a Mayor', 'Precio Mayor a Menor', 'Codigo Postal'];
  statesList: string[] = states;

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

    this.#router.navigate([], {
      queryParams: {
        tab: tab.id
      },
      queryParamsHandling: 'merge'
    });
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
