import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StarComponent } from '@shared/components/icons/star/star.component';

import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [
    PrimaryButtonDirective,
    StarComponent
  ],
  templateUrl: './auction.component.html',
  styleUrl: './auction.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionComponent { }
