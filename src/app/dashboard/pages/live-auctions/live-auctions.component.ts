import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LiveAuctionsTabs } from '@dashboard/enums';
import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { LiveCarAuctionsComponent } from '@dashboard/components/live-auctions/live-auctions.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    LiveCarAuctionsComponent,
  ],
  templateUrl: './live-auctions.component.html',
  styleUrl: './live-auctions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveAuctionsComponent {
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  currentLiveAuctionsTab = signal<LiveAuctionsTabs>(LiveAuctionsTabs.cars);
  page1 = signal<number>(1);
  size1 = signal<number>(10);
  page2 = signal<number>(1);
  size2 = signal<number>(10);

  get liveAuctionsTabs(): typeof LiveAuctionsTabs {
    return LiveAuctionsTabs;
  }

  constructor() {
    this.#activatedRoute.queryParams.
      pipe(
        takeUntilDestroyed(),
      ).subscribe(params => {
        let type: LiveAuctionsTabs = params['type'];

        if (!(type in LiveAuctionsTabs)) {
          type = LiveAuctionsTabs.cars;
        }

        this.currentLiveAuctionsTab.set(type);

        switch (type) {
          case LiveAuctionsTabs.cars:
            const page1 = params['page1'];
            const size1 = params['size1'];

            if (page1) this.page1.set(+page1);
            if (size1) this.size1.set(+size1);
            break;
          case LiveAuctionsTabs.art:
            const page2 = params['page2'];
            const size2 = params['size2'];

            if (page2) this.page2.set(+page2);
            if (size2) this.size2.set(+size2);
            break;
        }
      });
  }

  setActivityTab(tab: LiveAuctionsTabs): void {
    this.currentLiveAuctionsTab.set(tab);
    this.navigateWithQueryParams(tab);
  }

  private navigateWithQueryParams(tabId: LiveAuctionsTabs): void {
    this.#router.navigate([], {
      queryParams: {
        type: tabId
      },
      queryParamsHandling: 'merge'
    });
  }
}
