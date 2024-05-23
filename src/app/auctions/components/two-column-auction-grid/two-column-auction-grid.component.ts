import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'two-column-auction-grid',
  standalone: true,
  templateUrl: './two-column-auction-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoColumnAuctionGridComponent { }
