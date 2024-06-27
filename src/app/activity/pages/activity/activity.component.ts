import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ActivityApprovedAuctionsComponent } from '@activity/components/activity-approved-auctions/activity-approved-auctions.component';
import { ActivityAuctionRequestsProgressComponent } from '@activity/components/activity-auction-requests-progress/activity-auction-requests-progress.component';
import { ActivityTabs } from '@activity/enums/activityTabs.enum';
import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';

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

  get activityTabs(): typeof ActivityTabs {
    return ActivityTabs;
  }

  setActivityTab(tab: ActivityTabs): void {
    this.currentActivityTab = signal(tab);
  }
}
