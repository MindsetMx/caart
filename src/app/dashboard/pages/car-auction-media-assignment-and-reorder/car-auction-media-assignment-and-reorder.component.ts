import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuctionImageAssignmentAndReorderComponent } from '@dashboard/components/auction-image-assignment-and-reorder/auction-image-assignment-and-reorder.component';
import { SidebarComponent } from '@dashboard/layout/sidebar/sidebar.component';
import { MultimediaType } from '@dashboard/enums';
import { InputDirective } from '@shared/directives';
import { CarAuctionVideoAssignmentAndReorderComponent } from '@dashboard/components/car-auction-video-assignment-and-reorder/car-auction-video-assignment-and-reorder.component';

@Component({
  standalone: true,
  imports: [
    SidebarComponent,
    AuctionImageAssignmentAndReorderComponent,
    ReactiveFormsModule,
    InputDirective,
    CarAuctionVideoAssignmentAndReorderComponent
  ],
  templateUrl: './car-auction-media-assignment-and-reorder.component.html',
  styleUrls: ['./car-auction-media-assignment-and-reorder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarAuctionMediaAssignmentAndReorderComponent {
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);

  multimediaTypeControl: FormControl = new FormControl(MultimediaType.Images);
  multimediaType = MultimediaType;

  constructor() {
    this.initializeQueryParamSubscription();
    this.initializeFormControlSubscription();
  }

  private initializeQueryParamSubscription(): void {
    this.#activatedRoute.queryParams.subscribe(params => {
      const type = params['type'];
      if (type === 'imagenes') {
        this.multimediaTypeControl.setValue(MultimediaType.Images, { emitEvent: false });
      } else if (type === 'videos') {
        this.multimediaTypeControl.setValue(MultimediaType.Videos, { emitEvent: false });
      }
    });
  }

  private initializeFormControlSubscription(): void {
    this.multimediaTypeControl.valueChanges.subscribe(value => {
      this.#router.navigate([], {
        relativeTo: this.#activatedRoute,
        queryParams: { type: value === MultimediaType.Images ? 'imagenes' : 'videos' },
        queryParamsHandling: 'merge',
      });
    });
  }
}
