import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LiveAuctionsTabs } from '@dashboard/enums';
import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'auction-results',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    SecondaryButtonDirective,
  ],
  templateUrl: './auction-results.component.html',
  styleUrl: './auction-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsComponent {
  #router = inject(Router);

  currentLiveAuctionsTab = signal<LiveAuctionsTabs>(LiveAuctionsTabs.cars);

  get liveAuctionsTabs(): typeof LiveAuctionsTabs {
    return LiveAuctionsTabs;
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
