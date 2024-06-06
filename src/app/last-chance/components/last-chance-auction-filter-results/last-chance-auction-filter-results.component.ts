import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { AuctionFilterMenuComponent } from '@auctions/components/auction-filter-menu/auction-filter-menu.component';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { LastChanceArtCardComponent } from '@lastChance/components/last-chance-art-card/last-chance-art-card.component';
import { LastChanceVehicleCardComponent } from '@lastChance/components/last-chance-vehicle-card/last-chance-vehicle-card.component';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { states } from '@shared/states';
import { LastChanceAuctionService } from '@app/last-chance/services/last-chance-auction.service';
import { AuctionTypesAll } from '@auctions/enums';
import { LastChanceAuctions } from '@app/last-chance/interfaces';
import { LastChanceAuctionTypes } from '@app/last-chance/enums';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'last-chance-auction-filter-results',
  standalone: true,
  imports: [
    LastChanceVehicleCardComponent,
    AuctionFilterMenuComponent,
    CommonModule,
    FormsModule,
    IntersectionDirective,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    // ReactiveFormsModule,
    TertiaryButtonDirective,
    YearRangeComponent,
    RouterModule,
    LastChanceArtCardComponent,
  ],
  templateUrl: './last-chance-auction-filter-results.component.html',
  styleUrl: './last-chance-auction-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceAuctionFilterResultsComponent {
  currentPage = signal<number>(0);
  size = signal<number>(10);

  era = signal<string[]>([]);
  yearRange = signal<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOffer = signal<string[]>([]);
  orderBy = signal<string>('EndingSoonest');
  endsIn = signal<string[]>([]);
  states = signal<string[]>([]);

  search = signal<string>('');

  auctionFilterMenuIsOpen = signal<boolean>(false);

  isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH; // Actualiza el valor en tiempo real
  }

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

  currentOfferList: { value: string; label: string }[] = [
    { value: 'lessThan200000', label: 'Menor a 200,000' },
    { value: 'lessThan500000', label: 'Menor a 500,000' },
    { value: 'lessThan750000', label: 'Menor a 750,000' },
    { value: 'lessThan1000000', label: 'Menor a 1,000,000' },
    { value: 'lessThan2000000', label: 'Menor a 2,000,000' },
  ];

  orderByList: { value: string; label: string }[] = [
    { value: 'EndingSoonest', label: 'Tiempo Menor a mayor' },
    { value: 'EndingLatest', label: 'Tiempo Mayor a Menor' },
    { value: 'BidLowestFirst', label: 'Precio Menor a Mayor' },
    { value: 'BidHighestFirst', label: 'Precio Mayor a Menor' },
    // { value: 'zipCode', label: 'Codigo Postal' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  #lastChanceAuctionService = inject(LastChanceAuctionService);

  auctions = signal<LastChanceAuctions>({} as LastChanceAuctions);

  get auctionTypesAll(): typeof LastChanceAuctionTypes {
    return LastChanceAuctionTypes;
  }

  ngOnInit(): void {
    this.getLiveAuctions(true);
  }

  getLiveAuctions(replace: boolean = false): void {
    this.currentPage.update((page) => page + 1);

    this.#lastChanceAuctionService.getAllLastChanceAuctions$(
      this.currentPage(),
      this.size(),
      this.orderBy(),
      this.era().join(','),
      this.currentOffer().join(','),
      this.states().join(','),
      this.yearRange(),
      this.endsIn().join(','),
    ).subscribe({
      next: (auctions: any) => {
        if (replace) {
          this.auctions.set(auctions);
          this.getLiveAuctions(false);
          return;
        }

        this.auctions.update((auction) => {
          return {
            data: auction ? [...auction.data, ...auctions.data] : auctions.data,
            meta: auctions.meta,
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
    this.getLiveAuctions(true);
  }

  setEndsIn(value: string[]): void {
    this.endsIn.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setCurrentOffer(value: string[]): void {
    this.currentOffer.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setStates(value: string[]): void {
    this.states.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setOrderBy(value: string): void {
    this.orderBy.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setEra(value: string[]): void {
    this.era.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    this.yearRange.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
