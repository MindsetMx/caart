import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, HostListener, WritableSignal, effect, inject, model, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuctionCardComponent } from '@auctions/components/auction-card/auction-card.component';
import { CarAuctionFilterMenuMobileComponent } from '@auctions/components/car-auction-filter-menu-mobile/car-auction-filter-menu-mobile.component';
import { GetLiveCarAuction, VehicleAuction } from '@auctions/interfaces';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { states } from '@shared/states';
import { VehicleFilterService } from '@auctions/services/vehicle-filter.service';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'vehicle-filter-results',
  standalone: true,
  imports: [
    AuctionCardComponent,
    CarAuctionFilterMenuMobileComponent,
    CommonModule,
    ReactiveFormsModule,
    IntersectionDirective,
    MatFormFieldModule,
    MatSelectModule,
    PrimaryButtonDirective,
    TertiaryButtonDirective,
    YearRangeComponent,
    RouterModule
  ],
  templateUrl: './vehicle-filter-results.component.html',
  styleUrl: './vehicle-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFilterResultsComponent {
  updatedCarAuction = model<GetLiveCarAuction>({} as GetLiveCarAuction);

  currentPage = signal<number>(1);
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

  auctionTypeControl = new FormControl<string[]>([]);
  categoryControl = new FormControl<string[]>([]);
  eraControl = new FormControl<string[]>([]);
  yearRangeControl = new FormControl<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOfferControl = new FormControl<string[]>([]);
  orderByControl = new FormControl<string>('EndingSoonest');
  endsInControl = new FormControl<string[]>([]);
  statesControl = new FormControl<string[]>([]);
  searchControl = new FormControl<string>('');

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
    { value: 'EndingSoonest', label: 'Tiempo Menor a mayor' },
    { value: 'EndingLatest', label: 'Tiempo Mayor a Menor' },
    { value: 'BidLowestFirst', label: 'Precio Menor a Mayor' },
    { value: 'BidHighestFirst', label: 'Precio Mayor a Menor' },
    // { value: 'zipCode', label: 'Codigo Postal' },
  ];

  statesList: { value: string; label: string }[] = states.map((state) => ({ value: state, label: state }));

  #vehicleFilterService = inject(VehicleFilterService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  auctions = signal<VehicleAuction>({} as VehicleAuction);

  updatedAuctionCarEffect = effect(() => {
    this.addCarAuction();
  });

  getLiveAuctionsEffect = effect(() => {
    untracked(() => {
      this.currentPage.set(1);
    });

    this.getLiveAuctions(true);
  });

  auctionTypeEffect = effect(() => this.auctionTypeControl.setValue(this.auctionType(), { emitEvent: false }));
  categoryEffect = effect(() => this.categoryControl.setValue(this.category(), { emitEvent: false }));
  eraEffect = effect(() => this.eraControl.setValue(this.era(), { emitEvent: false }));
  yearRangeEffect = effect(() => this.yearRangeControl.setValue(this.yearRange(), { emitEvent: false }));
  currentOfferEffect = effect(() => this.currentOfferControl.setValue(this.currentOffer(), { emitEvent: false }));
  orderByEffect = effect(() => this.orderByControl.setValue(this.orderBy(), { emitEvent: false }));
  endsInEffect = effect(() => this.endsInControl.setValue(this.endsIn(), { emitEvent: false }));
  statesEffect = effect(() => this.statesControl.setValue(this.states(), { emitEvent: false }));
  searchEffect = effect(() => this.searchControl.setValue(this.search(), { emitEvent: false }));

  constructor() {
    // Leer query params iniciales
    this.#activatedRoute.queryParams.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.auctionType.set(params['auctionType']?.split(',') || []);
        this.category.set(params['category']?.split(',') || []);
        this.era.set(params['era']?.split(',') || []);
        if (params['yearRange']) {
          const [yearFrom, yearTo] = params['yearRange'].split('-').map(Number);
          if (!isNaN(yearFrom) && !isNaN(yearTo)) {
            this.yearRange.set({ yearFrom, yearTo });
          }
        } else {
          this.yearRange.set(undefined);
        }
        this.currentOffer.set(params['currentOffer']?.split(',') || []);
        this.orderBy.set(params['orderBy'] || 'EndingSoonest');
        this.endsIn.set(params['endsIn']?.split(',') || []);
        this.states.set(params['states']?.split(',') || []);
        this.search.set(params['search'] || '');
      }
    });

    this.initializeControl(this.searchControl, this.search, 300);
    this.initializeControl(this.orderByControl, this.orderBy);
    this.initializeControl(this.auctionTypeControl, this.auctionType);
    this.initializeControl(this.categoryControl, this.category);
    this.initializeControl(this.eraControl, this.era);
    this.initializeControl(this.yearRangeControl, this.yearRange, 500);
    this.initializeControl(this.endsInControl, this.endsIn);
    this.initializeControl(this.currentOfferControl, this.currentOffer);
    this.initializeControl(this.statesControl, this.states);
  }

  private updateQueryParams(): void {
    const queryParams: any = {};

    if (this.auctionType().length) queryParams.auctionType = this.auctionType().join(',');
    if (this.category().length) queryParams.category = this.category().join(',');
    if (this.era().length) queryParams.era = this.era().join(',');
    if (this.yearRange()?.yearFrom && this.yearRange()?.yearTo) {
      queryParams.yearRange = `${this.yearRange()?.yearFrom}-${this.yearRange()?.yearTo}`;
    }
    if (this.currentOffer().length) queryParams.currentOffer = this.currentOffer().join(',');
    if (this.orderBy() !== 'EndingSoonest') queryParams.orderBy = this.orderBy();
    if (this.endsIn().length) queryParams.endsIn = this.endsIn().join(',');
    if (this.states().length) queryParams.states = this.states().join(',');
    if (this.search()) queryParams.search = this.search();

    this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams,
      replaceUrl: true,
    });
  }

  private initializeControl(control: AbstractControl, target: WritableSignal<any>, debounce: number = 0) {
    control.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(debounce),
    ).subscribe((value) => {
      target.set(value);
      this.updateQueryParams();
    });
  }

  clearFilters(): void {
    this.auctionType.set([]);
    this.category.set([]);
    this.era.set([]);
    this.yearRange.set(undefined);
    this.currentOffer.set([]);
    this.orderBy.set('EndingSoonest');
    this.endsIn.set([]);
    this.states.set([]);
    this.search.set('');

    this.#router.navigate([], {
      relativeTo: this.#activatedRoute,
      queryParams: {},
    });
  }

  addCarAuction(): void {
    if (this.updatedCarAuction().data) {
      untracked(() => {
        this.auctions.update((auctions) => {
          const data = auctions.data.map((item) => {
            if (item.id === this.updatedCarAuction().data.id) {
              return {
                id: this.updatedCarAuction().data.id,
                type: this.updatedCarAuction().data.type,
                originalAuctionCarId: this.updatedCarAuction().data.originalAuctionCarId,
                attributes: this.updatedCarAuction().data.attributes,
              };
            }

            return item;
          });

          return {
            data,
            meta: auctions.meta,
          };
        });

        this.updatedCarAuction.set({} as GetLiveCarAuction);
      });
    }
  }

  getLiveAuctions(replace: boolean = false): void {
    if (this.yearRange() && (!this.yearRange()?.yearFrom || !this.yearRange()?.yearTo)) {
      return;
    }

    this.#vehicleFilterService.getLiveAuctions$(
      untracked(() => this.currentPage()),
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
      next: (auctions: VehicleAuction) => {
        untracked(() => {
          if (replace) {
            this.auctions.set(auctions);
            this.currentPage.update((page) => page + 1);
            return;
          }

          this.currentPage.update((page) => page + 1);

          this.auctions.update((auction) => {
            return {
              data: auction ? [...auction.data, ...auctions.data] : auctions.data,
              meta: auctions.meta,
            };
          });
        });
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
