import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { RouterLink } from '@angular/router';
import { VehicleAuctionData } from '@app/auctions/interfaces';

@Component({
  selector: 'auction-results-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FollowButtonComponent
  ],
  templateUrl: './auction-results-vehicle-card.component.html',
  styleUrl: './auction-results-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionResultsVehicleCardComponent {
  auction = input.required<VehicleAuctionData>();
}
