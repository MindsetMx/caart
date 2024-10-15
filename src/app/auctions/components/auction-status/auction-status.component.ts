import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { FavoritesSource } from '@favorites/enums';

@Component({
  selector: 'auction-status',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './auction-status.component.html',
  styleUrl: './auction-status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionStatusComponent {
  source = input.required<FavoritesSource>();

  get favoritesSource(): typeof FavoritesSource {
    return FavoritesSource;
  }
}
