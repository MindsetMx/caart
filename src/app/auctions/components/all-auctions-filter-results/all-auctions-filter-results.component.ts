import { ChangeDetectionStrategy, Component, HostListener, WritableSignal, effect, inject, model, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { ArtAuctionCardComponent } from '@auctions/components/art-auction-card/art-auction-card.component';
import { AuctionCardComponent } from '@auctions/components/auction-card/auction-card.component';
import { AuctionTypesAll } from '@auctions/enums';
import { GetAllAuctions, GetLiveArtAuction, GetLiveCarAuction } from '@auctions/interfaces';
import { GetAllAuctionsService } from '@auctions/services/all-auctions.service';
import { IntersectionDirective, PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { MemorabiliaAuctionCard2Component } from '@auctions/components/memorabilia-auction-card2/memorabilia-auction-card2.component';
import { states } from '@shared/states';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { AllLiveAuctionsFilterMenuMobileComponent } from '@auctions/components/all-live-auctions-filter-menu-mobile/all-live-auctions-filter-menu-mobile.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'all-auctions-filter-results',
  standalone: true,
  imports: [
    ArtAuctionCardComponent,
    AuctionCardComponent,
    AllLiveAuctionsFilterMenuMobileComponent,
    CommonModule,
    ReactiveFormsModule,
    IntersectionDirective,
    MatFormFieldModule,
    MatSelectModule,
    MemorabiliaAuctionCard2Component,
    PrimaryButtonDirective,
    RouterModule,
    TertiaryButtonDirective,
    YearRangeComponent,
  ],
  templateUrl: './all-auctions-filter-results.component.html',
  styleUrl: './all-auctions-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllAuctionsFilterResultsComponent {
  updatedCarAuction = model<GetLiveCarAuction>({} as GetLiveCarAuction);
  updatedArtAuction = model<GetLiveArtAuction>({} as GetLiveArtAuction);

  currentPage = signal<number>(1);
  size = signal<number>(10);

  auctionType = signal<string[]>([]);
  era = signal<string[]>([]);
  yearRange = signal<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOffer = signal<string[]>([]);
  orderBy = signal<string>('EndingSoonest');
  endsIn = signal<string[]>([]);
  states = signal<string[]>([]);

  search = signal<string>('');

  auctionTypeControl = new FormControl<string[]>([]);
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

  auctions = signal<GetAllAuctions>({} as GetAllAuctions);

  get auctionTypesAll(): typeof AuctionTypesAll {
    return AuctionTypesAll;
  }

  updatedAuctionCarEffect = effect(() => {
    this.addCarAuction();
  }, { allowSignalWrites: true });

  updatedAuctionArtEffect = effect(() => {
    this.addArtAuction();
  }, { allowSignalWrites: true });

  getLiveAuctionsEffect = effect(() => {
    untracked(() => {
      this.currentPage.set(1);
    });

    this.getLiveAuctions(true);
  }, { allowSignalWrites: true });

  auctionTypeEffect = effect(() => this.auctionTypeControl.setValue(this.auctionType(), { emitEvent: false }));
  eraEffect = effect(() => this.eraControl.setValue(this.era(), { emitEvent: false }));
  yearRangeEffect = effect(() => this.yearRangeControl.setValue(this.yearRange(), { emitEvent: false }), { allowSignalWrites: true });
  currentOfferEffect = effect(() => this.currentOfferControl.setValue(this.currentOffer(), { emitEvent: false }));
  orderByEffect = effect(() => this.orderByControl.setValue(this.orderBy(), { emitEvent: false }));
  endsInEffect = effect(() => this.endsInControl.setValue(this.endsIn(), { emitEvent: false }));
  statesEffect = effect(() => this.statesControl.setValue(this.states(), { emitEvent: false }));

  constructor() {
    this.initializeControl(this.searchControl, this.search, 300);
    this.initializeControl(this.orderByControl, this.orderBy);
    this.initializeControl(this.auctionTypeControl, this.auctionType);
    this.initializeControl(this.eraControl, this.era);
    this.initializeControl(this.yearRangeControl, this.yearRange, 500);
    this.initializeControl(this.endsInControl, this.endsIn);
    this.initializeControl(this.currentOfferControl, this.currentOffer);
    this.initializeControl(this.statesControl, this.states);
  }

  private initializeControl(control: AbstractControl, target: WritableSignal<any>, debounce: number = 0) {
    control.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(debounce),
    ).subscribe((value) => {
      target.set(value);
    });
  }

  clearFilters(): void {
    this.auctionType.set([]);
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
                originalAuctionId: this.updatedCarAuction().data.originalAuctionCarId,
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

  addArtAuction(): void {
    if (this.updatedArtAuction().data) {
      untracked(() => {
        this.auctions.update((auctions) => {
          const data = auctions.data.map((item) => {
            if (item.id === this.updatedArtAuction().data.id) {
              return {
                id: this.updatedArtAuction().data.id,
                type: this.updatedArtAuction().data.type,
                originalAuctionId: this.updatedArtAuction().data.originalAuctionArtId,
                attributes: this.updatedArtAuction().data.attributes,
              };
            }

            return item;
          });

          return {
            data,
            meta: auctions.meta,
          };
        });

        this.updatedArtAuction.set({} as any);
      });
    }
  }

  getLiveAuctions(replace: boolean = false): void {
    if (this.yearRange() && (!this.yearRange()?.yearFrom || !this.yearRange()?.yearTo)) {
      return;
    }

    this.#allAuctionsService.getAllLiveAuctions$(
      untracked(() => this.currentPage()),
      this.size(),
      this.orderBy(),
      this.auctionType().join(','),
      this.era().join(','),
      this.currentOffer().join(','),
      this.states().join(','),
      this.yearRange(),
      this.endsIn().join(','),
      this.search(),
    ).subscribe({
      next: (auctions: GetAllAuctions) => {
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
