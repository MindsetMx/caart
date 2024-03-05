import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, WritableSignal, input, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { InputDirective, TertiaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'auction-results-filter-menu',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TertiaryButtonDirective,
    RouterLink
  ],
  templateUrl: './auction-results-filter-menu.component.html',
  styleUrl: './auction-results-filter-menu.component.css',
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
export class AuctionResultsFilterMenuComponent {
  isOpen = input<boolean>(false);
  @Output() isOpenChange = new EventEmitter<boolean>();
  auctionTypeList = input.required<{ value: string; label: string }[]>();
  categoryList = input.required<{ value: string; label: string }[]>();
  eraList = input.required<{ value: string; label: string }[]>();
  orderByList = input.required<{ value: string; label: string }[]>();
  statesList = input.required<{ value: string; label: string }[]>();

  @Output() setAuctionTypeChange = new EventEmitter<string[]>();
  @Output() setCategoryChange = new EventEmitter<string[]>();
  @Output() setEraChange = new EventEmitter<string[]>();
  @Output() setOrderByChange = new EventEmitter<string>();
  @Output() setStatesChange = new EventEmitter<string[]>();
  @Output() setYearRangeChange = new EventEmitter<{ yearFrom: number, yearTo: number }>();

  filterMenu = viewChild.required<ElementRef>('filterMenu');

  auctionType = signal<string[]>([]);
  category = signal<string[]>([]);
  era = signal<string[]>([]);
  orderBy = signal<string[]>([]);
  states = signal<string[]>([]);
  yearFrom = signal<number | undefined>(undefined);
  yearTo = signal<number | undefined>(undefined);

  listingTypeIsOpen = signal<boolean>(false);
  categoryIsOpen = signal<boolean>(false);
  eraIsOpen = signal<boolean>(false);
  yearsRangeIsOpen = signal<boolean>(false);
  statesIsOpen = signal<boolean>(false);

  orderByControl: FormControl = new FormControl();

  toggleSelection(value: string, selectedValues: WritableSignal<string[]>): void {
    (this.isSelected(value, selectedValues))
      ? selectedValues.update((values) => values.filter((val) => val !== value))
      : selectedValues.update((values) => [...values, value]);

    switch (selectedValues) {
      case this.auctionType:
        this.setAuctionTypeChange.emit(selectedValues());
        break;
      case this.category:
        this.setCategoryChange.emit(selectedValues());
        break;
      case this.era:
        this.setEraChange.emit(selectedValues());
        break;
      case this.states:
        this.setStatesChange.emit(selectedValues());
        break;
    }
  }

  isSelected(value: string, selectedValues: WritableSignal<string[]>): boolean {
    return selectedValues().includes(value);
  }

  setYearFrom(value: number): void {
    this.yearFrom.set(value);

    if (this.yearTo() !== undefined) {
      this.setYearRangeChange.emit({ yearFrom: this.yearFrom()!, yearTo: this.yearTo()! });
    }
  }

  setYearTo(value: number): void {
    this.yearTo.set(value);

    if (this.yearFrom() !== undefined) {
      this.setYearRangeChange.emit({ yearFrom: this.yearFrom()!, yearTo: this.yearTo()! });
    }
  }

  closeMenu(event?: Event): void {
    if (event && this.filterMenu().nativeElement.contains(event.target)) {
      return;
    }

    this.isOpenChange.emit(false);
  }

  toggleFilter(event: Event, filter: WritableSignal<boolean>): void {
    event.stopPropagation();
    filter.update((value) => !value);
  }

  setOrderBy(value: string): void {
    this.orderBy.set([value]);
    this.setOrderByChange.emit(value);
  }
}
