import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LastChanceArtsData } from '@app/last-chance/interfaces';
import { AuctionTypes } from '@auctions/enums';
import { FollowButtonComponent } from '@shared/components/follow-button/follow-button.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'last-chance-art-card',
  standalone: true,
  imports: [
    CommonModule,
    CountdownModule,
    RouterLink,
    FollowButtonComponent,
    PrimaryButtonDirective,
    LastChanceArtCardComponent
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

  get auctionType(): typeof AuctionTypes {
    return AuctionTypes;
  }
}
