import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { AuctionTypes } from '@auctions/enums/auction-types';
import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { CompleteRegisterModalComponent } from '@auth/modals/complete-register-modal/complete-register-modal.component';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { TabsWithIconsComponent } from '@shared/components/tabs-with-icons/tabs-with-icons.component';
import { TabWithIcon } from '@shared/interfaces/tabWithIcon';
import { AuctionCarPublicationsComponent } from '@auctions/components/auction-car-publications/auction-car-publications.component';
import { AuctionMemorabiliaPublicationsComponent } from '@auctions/components/auction-memorabilia-publications/auction-memorabilia-publications.component';
import { AuctionArtPublicationsComponent } from '@auctions/components/auction-art-publications/auction-art-publications.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  imports: [
    CompleteRegisterModalComponent,
    TabsWithIconsComponent,
    AuctionCarPublicationsComponent,
    AuctionMemorabiliaPublicationsComponent,
    AuctionArtPublicationsComponent
  ],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionCarPublishesComponent {
  #authService = inject(AuthService);
  #generalInfoService = inject(GeneralInfoService);
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  completeRegisterModalIsOpen = signal<boolean>(false);
  hasGeneralInfo = signal<boolean>(false);
  publicationId = signal<string>('');
  auctionType = signal<AuctionTypes>(AuctionTypes.car);
  tabs?: TabWithIcon[];
  currentTabId = signal<number>(1);
  currentTabAuctionType = signal<AuctionTypes>(AuctionTypes.car);

  authStatusChangeEffect = effect(() => {
    if (this.authStatus === AuthStatus.authenticated) {
      this.getHasGeneralInfo();
    }
  });

  get authStatus(): AuthStatus {
    return this.#authService.authStatus();
  }

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
            {
              id: 3,
              name: 'Memorabilia',
              img: 'assets/img/registrar auto/milo-venus.svg',
              current: this.currentTabAuctionType() === AuctionTypes.memorabilia
            }
          ];

        this.currentTabId.set(this.tabs.find(tab => tab.current)?.id || 1);
      });

    this.getHasGeneralInfo();
  }


  openCompleteRegisterModal(publicationId: string, auctionType: AuctionTypes): void {
    this.completeRegisterModalIsOpen.set(true);
    this.publicationId.set(publicationId);
    this.auctionType.set(auctionType);
  }

  getHasGeneralInfo(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe({
      next: (response) => {
        this.hasGeneralInfo.set(response.data.attributes.hasGeneralInfo);
      },
      error: (error) => {
        console.error(error);
      }
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
