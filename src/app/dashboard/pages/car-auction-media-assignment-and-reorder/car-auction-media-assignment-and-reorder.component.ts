import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  styleUrl: './car-auction-media-assignment-and-reorder.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarAuctionMediaAssignmentAndReorderComponent {
  multimediaTypeControl: FormControl = new FormControl(MultimediaType.Images);
  multimediaType = MultimediaType;
}
