import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { AuctionCardComponent } from '@app/auctions/components/auction-card/auction-card.component';
import { AuctionResultsFilterMenuComponent } from '@app/auction-results/components/auction-results-filter-menu/auction-results-filter-menu.component';
import { AuctionResultsVehicleCardComponent } from '@app/auction-results/components/auction-results-vehicle-card/auction-results-vehicle-card.component';
import { CompletedAuctionsService } from '@auctions/services/completed-auctions.service';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { states } from '@shared/states';
import { CompletedAuctions, VehicleAuction } from '@auctions/interfaces';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { ResultsAuctionService } from '@app/auction-results/services/results-auction.service';
import { ResultTypes } from '@app/auction-results/enums';
import { AuctionResults } from '@app/auction-results/interfaces';

const MOBILE_SCREEN_WIDTH = 1024;
@Component({
  selector: 'auction-results-vehicle-filter-results',
  standalone: true,
  imports: [
    AuctionCardComponent,
    AuctionResultsFilterMenuComponent,
    AuctionResultsVehicleCardComponent,
    CommonModule,
    FormsModule,
    IntersectionDirective,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    TertiaryButtonDirective,
    YearRangeComponent,
  ],
  templateUrl: './auction-results-vehicle-filter-results.component.html',
  styleUrl: './auction-results-vehicle-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ opacity: 0 }))
      ]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('0.3s ease-in-out', style({ transform: 'translateX(100%)' }))
      ]),
    ]),
  ]
})
export class AuctionResultsVehicleFilterResultsComponent implements OnInit {
  currentPage = signal<number>(0);
  size = signal<number>(10);

  auctionType = signal<string[]>([]);
  category = signal<string[]>([]);
  era = signal<string[]>([]);
  yearRange = signal<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOffer = signal<string[]>([]);
  orderBy = signal<string>('desc');
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
    { value: 'asc', label: 'Más antiguos' },
    { value: 'desc', label: 'Más recientes' },
    { value: 'highestPrice', label: 'Precio más alto' },
    { value: 'lowestPrice', label: 'Precio más bajo' },
    // { value: 'zipCode', label: 'Codigo Postal' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  // #vehicleFilterService = inject(VehicleFilterService);
  #completedAuctionsService = inject(ResultsAuctionService);

  auctions = signal<AuctionResults | undefined>(undefined);

  get resultTypes(): typeof ResultTypes {
    return ResultTypes;
  }

  ngOnInit(): void {
    this.getCompletedAuctions(true);
  }

  getCompletedAuctions(replace: boolean = false): void {
    this.currentPage.update((page) => page + 1);

    this.#completedAuctionsService.getLiveAuctions$(
      this.resultTypes.car,
      this.currentPage(),
      this.size(),
      this.orderBy(),
      this.auctionType().join(','),
      this.era().join(','),
      this.states().join(','),
      this.yearRange(),
      this.search(),

      // this.category().join(','),
      // this.currentOffer().join(','),
      // this.endsIn().join(','),
    ).subscribe({
      next: (auctions: AuctionResults) => {
        if (replace) {
          this.auctions.set(auctions);
          this.getCompletedAuctions(false);
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
    this.getCompletedAuctions(true);
  }

  setAuctionType(value: string[]): void {
    this.auctionType.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setCategory(value: string[]): void {
    this.category.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setEra(value: string[]): void {
    this.era.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setEndsIn(value: string[]): void {
    this.endsIn.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setCurrentOffer(value: string[]): void {
    this.currentOffer.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setStates(value: string[]): void {
    this.states.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setOrderBy(value: string): void {
    this.orderBy.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    this.yearRange.set(value);
    this.resetPage();
    this.getCompletedAuctions(true);
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
