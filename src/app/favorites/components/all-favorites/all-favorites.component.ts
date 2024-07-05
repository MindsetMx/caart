import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ArtAuctionCardComponent } from '@auctions/components/art-auction-card/art-auction-card.component';
import { AuctionCardComponent } from '@auctions/components/auction-card/auction-card.component';
import { AuctionTypes } from '@auctions/enums';

import { FavoritesService } from '@favorites/services/favorites.service';
import { IntersectionDirective } from '@shared/directives';

@Component({
  selector: 'all-favorites',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    ArtAuctionCardComponent,
    AuctionCardComponent,
    IntersectionDirective,
  ],
  templateUrl: './all-favorites.component.html',
  styleUrl: './all-favorites.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllFavoritesComponent {
  auctionType = input.required<AuctionTypes | 'any'>();

  #favoritesService = inject(FavoritesService);

  currentPage = signal<number>(1);
  size = signal<number>(10);

  searchControl = new FormControl<string>('');
  orderByControl = new FormControl<string>('EndingSoonest');

  orderByList: { value: string; label: string }[] = [
    { value: '1', label: 'Más Recientes' },
    { value: '-1', label: 'Más Antiguos' },
  ];

  favorites = signal<any>('');

  getFavoritesEffect = effect(() => {
    untracked(() => {
      this.currentPage.set(1);
    });

    this.getFavorites(true);
  }, { allowSignalWrites: true });

  auctionTypeEffect = effect(() => {
    untracked(() => {
      this.currentPage.set(1);
    });

    if (this.auctionType() && untracked(() => this.favorites().data && this.favorites().data.length > 0)) {
      this.getFavorites(true);
    }
  });

  get auctionTypes(): typeof AuctionTypes {
    return AuctionTypes;
  }

  constructor() {
    this.orderByControl.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe(() => {
      this.currentPage.set(1);
      this.getFavorites(true);
    });
  }

  getFavorites(replace: boolean = false): void {
    this.#favoritesService.getFavorites$(
      untracked(() => this.currentPage()),
      untracked(() => this.size()),
      this.orderByControl.value!,
      untracked(() => this.auctionType())
    ).subscribe((response) => {
      untracked(() => {

        if (replace) {
          this.favorites.set(response);
          console.log({ currentPage1: this.currentPage() });
          this.currentPage.update((page) => page + 1);
          console.log({ currentPage2: this.currentPage() });

          this.getFavorites(false);
          return;
        }

        this.favorites.update((favorites) => {
          return {
            data: favorites ? [...favorites.data, ...response.data] : response.data,
            meta: response.meta,
          };
        });
      });
    });
  }
}
