import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownModule } from 'ngx-countdown';
import { RouterLink } from '@angular/router';

import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { VehicleAuctionData } from '@auctions/interfaces';
import { PrimaryButtonDirective } from '@shared/directives';
import { LastChanceVehiclesData } from '@app/last-chance/interfaces';

@Component({
  selector: 'last-chance-vehicle-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    PrimaryButtonDirective
  ],
  templateUrl: './last-chance-vehicle-card.component.html',
  styleUrl: './last-chance-vehicle-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceVehicleCardComponent {
  auction = input.required<LastChanceVehiclesData>();
}
