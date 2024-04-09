import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AuctionFilterMenuComponent } from '@app/auctions/components/auction-filter-menu/auction-filter-menu.component';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { states } from '@shared/states';
import { GetAllAuctions, VehicleAuction } from '@app/auctions/interfaces';
import { VehicleFilterService } from '@app/auctions/services/vehicle-filter.service';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { RouterModule } from '@angular/router';
import { GetAllAuctionsService } from '@auctions/services/all-auctions.service';
import { AuctionCard3Component } from '../auction-card3/auction-card3.component';
import { MemorabiliaAuctionCard2Component } from '../memorabilia-auction-card2/memorabilia-auction-card2.component';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'all-auctions-filter-results',
  standalone: true,
  imports: [
    AuctionCard3Component,
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
    MemorabiliaAuctionCard2Component
  ],
  templateUrl: './all-auctions-filter-results.component.html',
  styleUrl: './all-auctions-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllAuctionsFilterResultsComponent {
  currentPage = signal<number>(0);
  size = signal<number>(10);

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

  orderByList: { value: string; label: string }[] = [
    { value: 'EndingSoonest', label: 'Tiempo Menor a mayor' },
    { value: 'EndingLatest', label: 'Tiempo Mayor a Menor' },
    { value: 'BidLowestFirst', label: 'Precio Menor a Mayor' },
    { value: 'BidHighestFirst', label: 'Precio Mayor a Menor' },
    // { value: 'zipCode', label: 'Codigo Postal' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  #allAuctionsService = inject(GetAllAuctionsService);

  auctions = signal<GetAllAuctions | undefined>(undefined);

  ngOnInit(): void {
    this.getLiveAuctions(true);
  }

  getLiveAuctions(replace: boolean = false): void {
    this.currentPage.update((page) => page + 1);

    this.#allAuctionsService.getAllLiveAuctions$(
      this.currentPage(),
      this.size(),
    ).subscribe({
      next: (auctions: GetAllAuctions) => {
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

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    this.yearRange.set(value);
    this.resetPage();
    this.getLiveAuctions(true);
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
