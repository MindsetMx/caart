import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CountdownModule } from 'ngx-countdown';
import { RouterLink } from '@angular/router';

import { AuctionStatusComponent } from '@auctions/components/auction-status/auction-status.component';
import { AuctionTypes } from '@auctions/enums';
import { FavoritesSource } from '@favorites/enums';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { PrimaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'last-chance-art-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    PrimaryButtonDirective,
    LastChanceArtCardComponent,
    AuctionStatusComponent,
  ],
  templateUrl: './last-chance-art-card.component.html',
  styleUrl: './last-chance-art-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceArtCardComponent {
  // auction = input.required<LastChanceArtsData>();
  originalAuctionArtId = input.required<string>();
  cover = input.required<string>();
  title = input.required<string>();
  extract = input.required<string>();
  reserveAmount = input.required<number>();

  source = input<FavoritesSource>();

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }
}
