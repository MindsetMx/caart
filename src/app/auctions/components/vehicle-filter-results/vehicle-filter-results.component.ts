import { ChangeDetectionStrategy, Component, HostListener, WritableSignal, effect, inject, model, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, debounceTime } from 'rxjs';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuctionCardComponent } from '@app/auctions/components/auction-card/auction-card.component';
import { CarAuctionFilterMenuMobileComponent } from '@auctions/components/car-auction-filter-menu-mobile/car-auction-filter-menu-mobile.component';
import { GetLiveCarAuction, VehicleAuction } from '@app/auctions/interfaces';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { states } from '@shared/states';
import { VehicleFilterService } from '@app/auctions/services/vehicle-filter.service';
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

  auctions = signal<VehicleAuction>({} as VehicleAuction);

  updatedAuctionCarEffect = effect(() => {
    this.addCarAuction();
  }, { allowSignalWrites: true });

  getLiveAuctionsEffect = effect(() => {
    untracked(() => {
      this.currentPage.set(1);
    });

    this.getLiveAuctions(true);
  }, { allowSignalWrites: true });

  auctionTypeEffect = effect(() => this.auctionTypeControl.setValue(this.auctionType()));
  categoryEffect = effect(() => this.categoryControl.setValue(this.category()));
  eraEffect = effect(() => this.eraControl.setValue(this.era()));
  yearRangeEffect = effect(() => this.yearRangeControl.setValue(this.yearRange()));
  currentOfferEffect = effect(() => this.currentOfferControl.setValue(this.currentOffer()));
  orderByEffect = effect(() => this.orderByControl.setValue(this.orderBy()));
  endsInEffect = effect(() => this.endsInControl.setValue(this.endsIn()));
  statesEffect = effect(() => this.statesControl.setValue(this.states()));

  constructor() {
    this.initializeControl(this.searchControl, this.search, 300);
    this.initializeControl(this.orderByControl, this.orderBy);
    this.initializeControl(this.auctionTypeControl, this.auctionType);
    this.initializeControl(this.categoryControl, this.category);
    this.initializeControl(this.eraControl, this.era);
    this.initializeControl(this.yearRangeControl, this.yearRange, 500, this.yearRangeValidator);
    this.initializeControl(this.endsInControl, this.endsIn);
    this.initializeControl(this.currentOfferControl, this.currentOffer);
    this.initializeControl(this.statesControl, this.states);
  }

  private initializeControl(control: AbstractControl, target: WritableSignal<any>, debounce: number = 0, validator: (value: any) => boolean = () => true) {
    control.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(debounce),
    ).subscribe((value) => {
      if (validator(value)) {
        target.set(value);
      }
    });
  }

  private yearRangeValidator(value: any): boolean {
    return value && value.yearFrom && value.yearTo && value.yearFrom <= value.yearTo;
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
            this.getLiveAuctions(false);
            return;
          }

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
