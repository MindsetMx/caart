import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'auction-details-table-component',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './auction-details-table-component.component.html',
  styleUrl: './auction-details-table-component.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionDetailsTableComponentComponent {
  auctionDetails = input.required<{ label: string, value: string | number }[]>();
}
