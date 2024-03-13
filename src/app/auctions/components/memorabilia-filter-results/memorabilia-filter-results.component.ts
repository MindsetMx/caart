import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MemorabiliaFilterService } from '@auctions/services/memorabilia-filter.service';

import { states } from '@shared/states';
import { AuctionFilterMenuComponent } from '../auction-filter-menu/auction-filter-menu.component';
import { MemorabiliaAuction } from '@auctions/interfaces';
import { MemorabiliaAuctionCardComponent } from '../memorabilia-auction-card/memorabilia-auction-card.component';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { RouterModule } from '@angular/router';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'memorabilia-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AuctionFilterMenuComponent,
    MemorabiliaAuctionCardComponent,
    IntersectionDirective,
    PrimaryButtonDirective,
    RouterModule,
    TertiaryButtonDirective,
    YearRangeComponent,
  ],
  templateUrl: './memorabilia-filter-results.component.html',
  styleUrl: './memorabilia-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemorabiliaFilterResultsComponent {
  currentPage = signal<number>(0);
  size = signal<number>(10);

  auctionType = signal<string[]>([]);
  category = signal<string[]>([]);
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

  auctionTypeList: { value: string; label: string }[] = [
    { value: 'premium', label: 'Premium' },
    { value: 'no-reserve', label: 'Sin Reserva' },
  ];

  categoryList: { value: string; label: string }[] = [
    { value: 'automoviles', label: 'Automóviles' },
    { value: 'motos', label: 'Motos' },
    { value: 'electric', label: 'Eléctricos' },
    { value: 'proyectos', label: 'Proyectos' },
    { value: 'autopartes', label: 'Autopartes' },
    { value: 'rines', label: 'Rines' },
  ];

  currentOfferList: { value: string; label: string }[] = [
    { value: 'lessThan200000', label: 'Menor a 200,000' },
    { value: 'lessThan500000', label: 'Menor a 500,000' },
    { value: 'lessThan750000', label: 'Menor a 750,000' },
    { value: 'lessThan1000000', label: 'Menor a 1,000,000' },
    { value: 'lessThan2000000', label: 'Menor a 2,000,000' },
  ];

  endsInList: { value: string; label: string }[] = [
    { value: '1h', label: '1 hora' },
    { value: '4h', label: '4 horas' },
    { value: '1d', label: '1 día' },
    { value: '5d', label: '5 días' },
    { value: '7d', label: '7 días' },
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

  orderByList: { value: string; label: string }[] = [
    { value: 'EndingSoonest', label: 'Tiempo Menor a mayor' },
    { value: 'EndingLatest', label: 'Tiempo Mayor a Menor' },
    { value: 'BidLowestFirst', label: 'Precio Menor a Mayor' },
    { value: 'BidHighestFirst', label: 'Precio Mayor a Menor' },
    // { value: 'zipCode', label: 'Codigo Postal' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  #memorabiliaFilterService = inject(MemorabiliaFilterService);

  auctions = signal<MemorabiliaAuction | undefined>(undefined);

  ngOnInit(): void {
    this.getLiveAuctions(true);
  }

  getLiveAuctions(replace: boolean = false): void {
    this.currentPage.update((page) => page + 1);

    this.#memorabiliaFilterService.getLiveAuctions$(
      this.currentPage(),
      this.size(),
      this.auctionType().join(','),
      this.category().join(','),
      this.era().join(','),
      this.yearRange(),
      this.currentOffer().join(','),
      this.orderBy(),
      this.endsIn().join(','),
      this.states().join(','),
      this.search(),
    ).subscribe({
      next: (auctions: MemorabiliaAuction) => {
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

  setAuctionType(value: string[]): void {
    this.auctionType.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setCategory(value: string[]): void {
    this.category.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  setEra(value: string[]): void {
    this.era.set(value);
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

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    this.yearRange.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
