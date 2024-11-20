import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostListener, effect, inject, signal, untracked } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { GetAllAuctions, GetAllAuctionsData } from '@auctions/interfaces';
import { GetAllAuctionsService } from '@auctions/services/all-auctions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuctionTypesAll } from '@auctions/enums';

@Component({
  selector: 'searchbar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-8px)',
          scale: 0.95
        }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 1,
          transform: 'translateY(0)',
          scale: 1
        }))
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          transform: 'translateY(-8px)',
          scale: 0.95
        }))
      ])
    ])
  ]
})
export class SearchbarComponent {
  #formBuilder = inject(FormBuilder);

  getAllAuctionsService = inject(GetAllAuctionsService);
  auctions = signal<GetAllAuctions>({} as GetAllAuctions);

  search = signal<string>('');

  searchControl = this.#formBuilder.control('', { nonNullable: true });

  searchEffect = effect(() => this.searchControl.setValue(this.search(), { emitEvent: false }));

  router = inject(Router);
  showDropdown = signal<boolean>(false);
  selectedIndex = signal<number>(-1);

  auctionTypesAll = AuctionTypesAll;

  getAllLiveAuctionsEffect = effect(() => this.getAllLiveAuctions());

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const searchbarElement = (event.target as HTMLElement).closest('searchbar');
    if (!searchbarElement) {
      this.showDropdown.set(false);
      this.selectedIndex.set(-1);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.update(i =>
          i < this.auctions().data.length - 1 ? i + 1 : 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.update(i =>
          i > 0 ? i - 1 : this.auctions().data.length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex() >= 0) {
          this.navigateToAuction(this.auctions().data[this.selectedIndex()]);
        }
        break;
      case 'Escape':
        this.showDropdown.set(false);
        this.selectedIndex.set(-1);
        break;
    }
  }

  onInputClick(): void {
    this.showDropdown.set(true);
    if (!this.auctions().data) {
      this.getAllLiveAuctions();
    }
  }

  navigateToAuction(auction: GetAllAuctionsData) {
    switch (auction.type) {
      case AuctionTypesAll.auctionsCar:
        this.router.navigate(['/subasta', auction.originalAuctionId]);
        break;
      case AuctionTypesAll.auctionsArt:
        this.router.navigate(['/subasta-arte', auction.originalAuctionId]);
        console.log('auction', auction);

        break;
    }

    this.showDropdown.set(false);
    this.selectedIndex.set(-1);
  }

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe((searchTerm) => {
      this.search.set(searchTerm);
      this.showDropdown.set(true);
      this.selectedIndex.set(-1);
    });
  }

  getAllLiveAuctions(): void {
    this.getAllAuctionsService.getAllLiveAuctions$(
      1,
      5,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      this.search(),
    ).subscribe((auctions) => {
      untracked(() => {
        this.auctions.set(auctions);
      });
    });
  }
}
