import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionTypes } from '@auctions/enums';

@Component({
  selector: 'app-sell-with-us',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './sell-with-us.component.html',
  styleUrl: './sell-with-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellWithUsComponent {
  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }
}
