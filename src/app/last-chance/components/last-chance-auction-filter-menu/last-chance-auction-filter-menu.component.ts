import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, WritableSignal, input, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '@shared/directives';

@Component({
  selector: 'last-chance-auction-filter-menu',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    FormsModule,
  ],
  templateUrl: './last-chance-auction-filter-menu.component.html',
  styleUrl: './last-chance-auction-filter-menu.component.css',
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
export class LastChanceAuctionFilterMenuComponent {
  isOpen = input<boolean>(false);
  @Output() isOpenChange = new EventEmitter<boolean>();
  categoryList = input.required<{ value: string; label: string }[]>();
  currentOfferList = input.required<{ value: string; label: string }[]>();
  endsInList = input.required<{ value: string; label: string }[]>();
  eraList = input.required<{ value: string; label: string }[]>();
  orderByList = input.required<{ value: string; label: string }[]>();
  statesList = input.required<{ value: string; label: string }[]>();

  @Output() setCategoryChange = new EventEmitter<string[]>();
  @Output() setEraChange = new EventEmitter<string[]>();
  @Output() setCurrentOfferChange = new EventEmitter<string[]>();
  @Output() setEndsInChange = new EventEmitter<string[]>();
  @Output() setOrderByChange = new EventEmitter<string>();
  @Output() setStatesChange = new EventEmitter<string[]>();
  @Output() setYearRangeChange = new EventEmitter<{ yearFrom: number, yearTo: number }>();

  filterMenu = viewChild.required<ElementRef>('filterMenu');

  category = signal<string[]>([]);
  era = signal<string[]>([]);
  currentOffer = signal<string[]>([]);
  endsIn = signal<string[]>([]);
  orderBy = signal<string[]>([]);
  states = signal<string[]>([]);
  yearFrom = signal<number | undefined>(undefined);
  yearTo = signal<number | undefined>(undefined);

  categoryIsOpen = signal<boolean>(false);
  eraIsOpen = signal<boolean>(false);
  yearsRangeIsOpen = signal<boolean>(false);
  endsInIsOpen = signal<boolean>(false);
  currentOfferIsOpen = signal<boolean>(false);
  statesIsOpen = signal<boolean>(false);

  toggleSelection(value: string, selectedValues: WritableSignal<string[]>): void {
    (this.isSelected(value, selectedValues))
      ? selectedValues.update((values) => values.filter((val) => val !== value))
      : selectedValues.update((values) => [...values, value]);

    switch (selectedValues) {
      case this.category:
        this.setCategoryChange.emit(selectedValues());
        break;
      case this.era:
        this.setEraChange.emit(selectedValues());
        break;
      case this.currentOffer:
        this.setCurrentOfferChange.emit(selectedValues());
        break;
      case this.endsIn:
        this.setEndsInChange.emit(selectedValues());
        break;
      case this.states:
        this.setStatesChange.emit(selectedValues());
        break;
    }
  }

  // toggleSelectionOrderBy(value: string): void {
  //   this.orderBy.set([value]);
  //   this.setOrderByChange.emit(value);
  // }

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
    if (event && this.filterMenu()?.nativeElement.contains(event.target)) {
      return;
    }

    this.isOpenChange.emit(false);
  }

  toggleFilter(event: Event, filter: WritableSignal<boolean>): void {
    event.stopPropagation();
    filter.update((value) => !value);
  }
}
