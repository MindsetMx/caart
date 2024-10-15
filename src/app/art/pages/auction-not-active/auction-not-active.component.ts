import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './auction-not-active.component.html',
  styleUrl: './auction-not-active.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionNotActiveComponent { }
