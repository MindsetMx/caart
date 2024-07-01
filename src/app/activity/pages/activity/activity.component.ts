import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ActivityApprovedAuctionsComponent } from '@activity/components/activity-approved-auctions/activity-approved-auctions.component';
import { ActivityAuctionRequestsProgressComponent } from '@activity/components/activity-auction-requests-progress/activity-auction-requests-progress.component';
import { ActivityTabs } from '@activity/enums/activityTabs.enum';
import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'activity',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    ActivityAuctionRequestsProgressComponent,
    ActivityApprovedAuctionsComponent,
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  currentActivityTab = signal<ActivityTabs>(ActivityTabs.requests);
  page1 = signal<number>(1);
  size1 = signal<number>(10);
  page2 = signal<number>(1);
  size2 = signal<number>(10);

  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  get activityTabs(): typeof ActivityTabs {
    return ActivityTabs;
  }

  constructor() {
    this.#activatedRoute.queryParams.
      pipe(
        takeUntilDestroyed(),
      ).subscribe(params => {
        let type: ActivityTabs = params['type'];

        if (!(type in ActivityTabs)) {
          type = ActivityTabs.requests;
        }

        this.currentActivityTab.set(type);

        switch (type) {
          case ActivityTabs.requests:
            const page1 = params['page1'];
            const size1 = params['size1'];

            if (page1) this.page1.set(+page1);
            if (size1) this.size1.set(+size1);
            break;
          case ActivityTabs.approved:
            const page2 = params['page2'];
            const size2 = params['size2'];

            if (page2) this.page2.set(+page2);
            if (size2) this.size2.set(+size2);
            break;
        }
      });
  }

  setActivityTab(tab: ActivityTabs): void {
    this.currentActivityTab = signal(tab);
    this.navigateWithQueryParams(tab);
  }

  private navigateWithQueryParams(tabId: ActivityTabs): void {
    this.#router.navigate([], {
      queryParams: {
        type: tabId
      },
      queryParamsHandling: 'merge'
    });
  }
}
