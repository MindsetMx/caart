import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ArtAuctionImageAssignmentAndReorderComponent } from '@dashboard/pages/art-auction-image-assignment-and-reorder/art-auction-image-assignment-and-reorder.component';
import { InputDirective } from '@shared/directives';
import { MultimediaType } from '@dashboard/enums';
import { ArtAuctionVideoAssignmentAndReorderComponent } from '@dashboard/pages/art-auction-video-assignment-and-reorder/art-auction-video-assignment-and-reorder.component';

@Component({
  standalone: true,
  imports: [
    ArtAuctionImageAssignmentAndReorderComponent,
    ReactiveFormsModule,
    InputDirective,
    ArtAuctionVideoAssignmentAndReorderComponent
  ],
  templateUrl: './art-auction-media-assignment-and-reorder.component.html',
  styleUrl: './art-auction-media-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtAuctionMediaAssignmentAndReorderComponent {
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
