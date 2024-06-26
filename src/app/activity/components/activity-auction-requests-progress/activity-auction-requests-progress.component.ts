import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivityRequests, ActivityRequestsStatus } from '@activity/interfaces';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'activity-auction-requests-progress',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltipModule,
    MatPaginatorModule,
  ],
  templateUrl: './activity-auction-requests-progress.component.html',
  styleUrl: './activity-auction-requests-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityAuctionRequestsProgressComponent {
  requests = signal<ActivityRequests>({} as ActivityRequests);
  currentPage = signal<number>(1);
  size = signal<number>(10);
  pageSizeOptions = signal<number[]>([]);

  #activityRequestsService = inject(ActivityRequestsService);

  get activityRequestsStatus(): typeof ActivityRequestsStatus {
    return ActivityRequestsStatus;
  }

  constructor() {
    this.getMyRequests();
  }

  getMyRequests(): void {
    this.#activityRequestsService.getMyRequests$(this.currentPage(), this.size()).subscribe((requests) => {
      this.requests.set(requests);

      if (this.pageSizeOptions().length === 0)
        this.pageSizeOptions.set(this.calculatePageSizeOptions(requests.meta.totalCount));
    });
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

  onPageChange(event: any): void {
    this.currentPage.set(event.pageIndex + 1);
    this.size.set(event.pageSize);
    this.getMyRequests();
  }
}
