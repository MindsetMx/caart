import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';

@Component({
  selector: 'auction-car-user-details',
  templateUrl: './auction-car-user-details.component.html',
  styleUrls: ['./auction-car-user-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: []
})
export class AuctionCarUserDetailsComponent {
  userDetails = input.required<any>();

  constructor() {
    Fancybox.bind("[data-fancybox='userPhotoGallery']", { Hash: false });
  }
} 