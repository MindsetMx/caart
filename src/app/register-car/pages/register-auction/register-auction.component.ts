import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ArtRegisterComponent } from '@app/art/components/art-register/art-register.component';
import { AuctionTypes } from '@auctions/enums';
import { CarRegisterComponent } from '@app/art/components/car-register/car-register.component';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { VehicleMemorabiliaComponentComponent } from '@app/register-car/components/vehicle-memorabilia-component/vehicle-memorabilia-component.component';

@Component({
  selector: 'register-car',
  standalone: true,
  imports: [
    TabsWithIconsComponent,
    VehicleMemorabiliaComponentComponent,
    ArtRegisterComponent,
    CarRegisterComponent
  ],
  templateUrl: './register-auction.component.html',
  styleUrl: './register-auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterAuctionComponent {
  tabs?: TabWithIcon[];
  currentTabId = signal<number>(1);
  currentTabAuctionType = signal<AuctionTypes>(AuctionTypes.car);

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.#activatedRoute.queryParams.
      pipe(
        takeUntilDestroyed(),
      ).subscribe(params => {
        let type: AuctionTypes = params['type'];

        if (!(type in AuctionTypes)) {
          type = AuctionTypes.car;
        }

        this.currentTabAuctionType.set(type);

        this.tabs =
          [
            {
              id: 1,
              name: 'Automóviles',
              img: 'assets/img/registrar auto/car-sport-outline.svg',
              current: this.currentTabAuctionType() === AuctionTypes.car
            },
            {
              id: 2,
              name: 'Arte',
              img: 'assets/img/registrar auto/milo-venus.svg',
              current: this.currentTabAuctionType() === AuctionTypes.art
            },
            // {
            //   id: 3,
            //   name: 'Memorabilia',
            //   img: 'assets/img/registrar auto/milo-venus.svg',
            //   current: this.currentTabAuctionType() === AuctionTypes.memorabilia
            // }
          ];

        this.currentTabId.set(this.tabs.find(tab => tab.current)?.id || 1);
      });
  }

  onTabSelected(tab: TabWithIcon): void {
    this.currentTabId.set(tab.id);

    switch (tab.id) {
      case 1:
        this.currentTabAuctionType.set(AuctionTypes.car);
        break;
      case 2:
        this.currentTabAuctionType.set(AuctionTypes.art);
        break;
      case 3:
        this.currentTabAuctionType.set(AuctionTypes.memorabilia);
        break;
    }

    this.navigateWithQueryParams(this.currentTabAuctionType());
  }

  private navigateWithQueryParams(tabId: AuctionTypes): void {
    this.#router.navigate([], {
      queryParams: {
        type: tabId
      },
      queryParamsHandling: 'merge'
    });
  }
}
