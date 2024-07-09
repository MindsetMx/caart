import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';

import { ActivityRequests, ActivityRequestsStatus, ActivityRequestsType } from '@activity/interfaces';
import { ActivityRequestsService } from '@activity/services/activity-requests.service';
import { AppService } from '@app/app.service';

@Component({
  selector: 'activity-auction-requests-progress',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltipModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './activity-auction-requests-progress.component.html',
  styleUrl: './activity-auction-requests-progress.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityAuctionRequestsProgressComponent {
  page = model.required<number>();
  size = model.required<number>();

  requests = signal<ActivityRequests>({} as ActivityRequests);
  pageSizeOptions = signal<number[]>([]);

  #activityRequestsService = inject(ActivityRequestsService);
  #appService = inject(AppService);
  #router = inject(Router);

  get activityRequestsStatus(): typeof ActivityRequestsStatus {
    return ActivityRequestsStatus;
  }

  get activityRequestsType(): typeof ActivityRequestsType {
    return ActivityRequestsType;
  }

  getMyRequestsEffect = effect(() => {
    this.getMyRequests();
  });

  getMyRequests(): void {
    this.#activityRequestsService.getMyRequests$(this.page(), this.size()).subscribe((requests) => {
      this.requests.set(requests);
      console.log(requests);


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
    this.page.set(event.pageIndex + 1);
    this.size.set(event.pageSize);

    this.#router.navigate([], {
      queryParams: {
        page1: this.page(),
        size1: this.size()
      },
      queryParamsHandling: 'merge',
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
