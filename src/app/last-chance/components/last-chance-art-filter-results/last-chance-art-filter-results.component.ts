import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { LastChanceArtCardComponent } from '@lastChance/components/last-chance-art-card/last-chance-art-card.component';
import { LastChanceArtFilterService } from '@lastChance/services/last-chance-art-filter.service';
import { states } from '@shared/states';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { LastChanceArtAuctionFilterMenuComponent } from '@lastChance/components/last-chance-art-auction-filter-menu/last-chance-art-auction-filter-menu.component';
import { LastChanceArts } from '@lastChance/interfaces';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'last-chance-art-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IntersectionDirective,
    LastChanceArtAuctionFilterMenuComponent,
    LastChanceArtCardComponent,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    TertiaryButtonDirective,
    YearRangeComponent,
  ],
  templateUrl: './last-chance-art-filter-results.component.html',
  styleUrl: './last-chance-art-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceArtFilterResultsComponent {
  currentPage = signal<number>(0);
  size = signal<number>(10);

  category = signal<string[]>([]);
  era = signal<string[]>([]);
  yearRange = signal<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOffer = signal<string[]>([]);
  states = signal<string[]>([]);

  search = signal<string>('');

  auctionFilterMenuIsOpen = signal<boolean>(false);

  isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH; // Actualiza el valor en tiempo real
  }

  categoryList: { value: string; label: string }[] = [
    { value: 'Automóviles', label: 'Automóviles' },
    { value: 'Motos', label: 'Motos' },
    { value: 'Eléctricos', label: 'Eléctricos' },
    { value: 'Proyectos', label: 'Proyectos' },
    { value: 'Autopartes', label: 'Autopartes' },
    { value: 'Rines', label: 'Rines' },
  ];

  currentOfferList: { value: string; label: string }[] = [
    { value: 'lessThan200000', label: 'Menor a 200,000' },
    { value: 'lessThan500000', label: 'Menor a 500,000' },
    { value: 'lessThan750000', label: 'Menor a 750,000' },
    { value: 'lessThan1000000', label: 'Menor a 1,000,000' },
    { value: 'lessThan2000000', label: 'Menor a 2,000,000' },
  ];

  eraList: { value: string; label: string }[] = [
    { value: '2020s', label: '2020s' },
    { value: '2010s', label: '2010s' },
    { value: '2000s', label: '2000s' },
    { value: '1990s', label: '1990s' },
    { value: '1980s', label: '1980s' },
    { value: '1970s', label: '1970s' },
    { value: '1960s', label: '1960s' },
    { value: '1950s', label: '1950s' },
    { value: '1940s', label: '1940s' },
    { value: '1930s', label: '1930s' },
    { value: '1920s', label: '1920s' },
    { value: '1910s', label: '1910s' },
    { value: '1900s', label: '1900s' },
    { value: 'Pre1900', label: 'Pre-1900s' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  #artFilterService = inject(LastChanceArtFilterService);

  arts = signal<LastChanceArts | undefined>(undefined);

  ngOnInit(): void {
    this.getArts(true);
  }

  getArts(replace: boolean = false): void {
    this.currentPage.update((page) => page + 1);

    this.#artFilterService.getLastChanceArts$(
      this.currentPage(),
      this.size(),
      this.category().join(','),
      this.era().join(','),
      this.yearRange(),
      // this.currentOffer().join(','),
      this.states().join(','),
      this.search()
    ).subscribe({
      next: (arts) => {
        if (replace) {
          this.arts.set(arts);
          this.getArts(false);
          return;
        }

        this.arts.update((art) => {
          return {
            data: art ? [...art.data, ...arts.data] : arts.data,
            meta: arts.meta,
          };
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  resetPage(): void {
    this.currentPage.set(0);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.resetPage();
    this.getArts(true);
  }

  setCategory(value: string[]): void {
    this.category.set(value);
    this.resetPage();
    this.getArts(true);
  }

  setEra(value: string[]): void {
    this.era.set(value);
    this.resetPage();
    this.getArts(true);
  }

  setCurrentOffer(value: string[]): void {
    this.currentOffer.set(value);
    this.resetPage();
    this.getArts(true);
  }

  setStates(value: string[]): void {
    this.states.set(value);
    this.resetPage();
    this.getArts(true);
  }

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    this.yearRange.set(value);
    this.resetPage();
    this.getArts(true);
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
