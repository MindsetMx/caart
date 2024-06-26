import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import { PrimaryButtonDirective, SecondaryButtonDirective } from '@shared/directives';
import { ActivityRequests, ActivityRequestsStatus } from '@activity/interfaces';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { ActivityTabs } from '@activity/enums/activityTabs.enum';

@Component({
  selector: 'activity',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonDirective,
    SecondaryButtonDirective,
    MatIcon,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  currentActivityTab = signal<ActivityTabs>(ActivityTabs.requests);
  requests = signal<ActivityRequests>({} as ActivityRequests);
  pageSizeOptions = signal<number[]>([]);
  currentPage = signal<number>(1);
  size = signal<number>(10);

  #activityRequestsService = inject(ActivityRequestsService);

  get activityTabs(): typeof ActivityTabs {
    return ActivityTabs;
  }

  get activityRequestsStatus(): typeof ActivityRequestsStatus {
    return ActivityRequestsStatus;
  }

  constructor() {
    this.getMyRequests();
  }

  getMyRequests(): void {
    this.#activityRequestsService.getMyRequests(this.currentPage(), this.size()).subscribe((requests) => {
      this.requests.set(requests);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(requests.meta.totalCount));
    });
  }

  setActivityTab(tab: ActivityTabs): void {
    this.currentActivityTab = signal(tab);
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.pageIndex + 1);
    this.size.set(event.pageSize);
    this.getMyRequests();
  }

  private calculatePageSizeOptions(totalItems: number): number[] {
    const pageSizeOptions = [];
    if (totalItems > 0) {
      for (let i = this.requests().meta.pageSize; i <= totalItems; i += this.requests().meta.pageSize) {
        pageSizeOptions.push(i);
      }
    }

    return pageSizeOptions;
  }
}
