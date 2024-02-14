import { ChangeDetectionStrategy, Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AuctionFilterMenuComponent } from '@app/auctions/components/auction-filter-menu/auction-filter-menu.component';
import { PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';
import { states } from '@shared/states';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { VehicleFilterService } from '@app/auctions/services/vehicle-filter.service';
import { VehicleAuction } from '@app/auctions/interfaces';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'vehicle-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    YearRangeComponent,
    AuctionFilterMenuComponent,
    TertiaryButtonDirective,
    PrimaryButtonDirective,
  ],
  templateUrl: './vehicle-filter-results.component.html',
  styleUrl: './vehicle-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFilterResultsComponent implements OnInit {
  auctionType = signal<string[]>([]);
  category = signal<string[]>([]);
  era = signal<string[]>([]);
  yearRange = signal<{ yearFrom: number, yearTo: number } | undefined>(undefined);
  currentOffer = signal<string[]>([]);
  orderBy = signal<string>('');
  endsIn = signal<string[]>([]);
  states = signal<string[]>([]);

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

  #vehicleFilterService = inject(VehicleFilterService);

  auctions = signal<VehicleAuction | null>(null);

  ngOnInit(): void {
    this.getLiveAuctions();
  }

  getLiveAuctions(): void {
    this.#vehicleFilterService.getLiveAuctions$(
      this.auctionType().join(','),
      this.category().join(','),
      this.era().join(','),
      this.yearRange(),
      this.currentOffer().join(','),
      this.orderBy(),
      this.endsIn().join(','),
      this.states().join(','),
    ).subscribe({
      next: (auctions: VehicleAuction) => {
        console.log({ auctions });
        this.auctions.set(auctions);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  setAuctionType(value: string[]): void {
    this.auctionType.set(value);
    this.getLiveAuctions();
  }

  setCategory(value: string[]): void {
    this.category.set(value);
    this.getLiveAuctions();
  }

  setEra(value: string[]): void {
    this.era.set(value);
    this.getLiveAuctions();
  }

  setEndsIn(value: string[]): void {
    this.endsIn.set(value);
    this.getLiveAuctions();
  }

  setCurrentOffer(value: string[]): void {
    this.currentOffer.set(value);
    this.getLiveAuctions();
  }

  setStates(value: string[]): void {
    this.states.set(value);
    this.getLiveAuctions();
  }

  setOrderBy(value: string): void {
    this.orderBy.set(value);
    this.getLiveAuctions();
  }

  setYearRange(value: { yearFrom: number, yearTo: number }): void {
    console.log('setYearRange', value);
    this.yearRange.set(value);
    this.getLiveAuctions();
  }

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
