import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AllFavoritesComponent } from '@app/favorites/components/all-favorites/all-favorites.component';
import { AuctionTypes } from '@auctions/enums';

import { FavoritesService } from '@favorites/services/favorites.service';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TabsWithIconsComponent,
    AllFavoritesComponent
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  tabs?: TabWithIcon[];
  currentTab = signal<number | undefined>(undefined);
  auctionType = signal<AuctionTypes | 'any'>('any');

  constructor() {
    this.#activatedRoute.queryParams.subscribe(params => {
      let tabId = +params['tab']; // Obtiene el id de la pestaña de los parámetros de consulta

      if (isNaN(tabId)) {
        tabId = 1;
      }

      switch (tabId) {
        case 1:
          this.auctionType.set('any');
          break;
        case 2:
          this.auctionType.set(AuctionTypes.car);
          break;
        case 3:
          this.auctionType.set(AuctionTypes.art);
          break;
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

    switch (tab.id) {
      case 1:
        this.auctionType.set('any');
        break;
      case 2:
        this.auctionType.set(AuctionTypes.car);
        break;
      case 3:
        this.auctionType.set(AuctionTypes.art);
        break;
    }

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
