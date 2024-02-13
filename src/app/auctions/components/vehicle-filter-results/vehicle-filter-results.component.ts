import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { YearRangeComponent } from '@shared/components/year-range/year-range.component';
import { states } from '@shared/states';
import { AuctionFilterMenuComponent } from '@app/auctions/components/auction-filter-menu/auction-filter-menu.component';
import { PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';

const MOBILE_SCREEN_WIDTH = 1024;

@Component({
  selector: 'vehicle-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    YearRangeComponent,
    AuctionFilterMenuComponent,
    TertiaryButtonDirective,
    PrimaryButtonDirective,
  ],
  templateUrl: './vehicle-filter-results.component.html',
  styleUrl: './vehicle-filter-results.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFilterResultsComponent {
  auctionType = new FormControl('');
  category = new FormControl('');
  era = new FormControl('');
  currentOffer = new FormControl('');
  orderBy = new FormControl('');
  endsIn = new FormControl('');
  states = new FormControl('');

  auctionFilterMenuIsOpen = signal<boolean>(false);

  isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth < MOBILE_SCREEN_WIDTH; // Actualiza el valor en tiempo real
  }

  auctionTypeList: string[] = ['Premium', 'Sin reserva'];
  categoryList: string[] = ['Automoviles', 'Electricos', 'Proyectos', 'Autopartes', 'Rines'];
  currentOfferList: string[] = ['Menor a 200,000', 'Menor a 500,00', 'Menor a 750,000', 'Menor a 1,000,000', 'Menor a 2,000,000'];
  endsInList: string[] = ['1 hora', '4 horas', '1 día', '5 días', '7 días'];
  eraList: string[] = ['2020s', '2010s', '2000s', '1990s', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s', '1910s', '1900s', 'Pre-1900s'];
  orderByList: string[] = ['Tiempo Menor a mayor', 'Tiempo Mayor a Menor', 'Precio Menor a Mayor', 'Precio Mayor a Menor', 'Codigo Postal'];
  statesList: string[] = states;

  openAuctionFilterMenu(): void {
    this.auctionFilterMenuIsOpen.set(true);
  }
}
