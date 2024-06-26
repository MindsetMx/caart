import { ChangeDetectionStrategy, Component, ElementRef, WritableSignal, model, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';

import { InputDirective, TertiaryButtonDirective } from '@shared/directives';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'car-auction-filter-menu-mobile',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    TertiaryButtonDirective,
    RouterLink
  ],
  templateUrl: './car-auction-filter-menu-mobile.component.html',
  styleUrl: './car-auction-filter-menu-mobile.component.css',
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
export class CarAuctionFilterMenuMobileComponent {
  isOpen = model.required<boolean>();

  auctionType = model.required<string[]>();
  category = model.required<string[]>();
  era = model.required<string[]>();
  yearRange = model.required<{ yearFrom: number, yearTo: number } | undefined>();
  currentOffer = model.required<string[]>();
  orderBy = model.required<string>();
  endsIn = model.required<string[]>();
  states = model.required<string[]>();

  auctionTypeList = model.required<{ value: string; label: string }[]>();
  categoryList = model.required<{ value: string; label: string }[]>();
  currentOfferList = model.required<{ value: string; label: string }[]>();
  endsInList = model.required<{ value: string; label: string }[]>();
  eraList = model.required<{ value: string; label: string }[]>();
  orderByList = model.required<{ value: string; label: string }[]>();
  statesList = model.required<{ value: string; label: string }[]>();

  filterMenu = viewChild<ElementRef>('filterMenu');

  listingTypeIsOpen = signal<boolean>(false);
  categoryIsOpen = signal<boolean>(false);
  eraIsOpen = signal<boolean>(false);
  yearsRangeIsOpen = signal<boolean>(false);
  endsInIsOpen = signal<boolean>(false);
  currentOfferIsOpen = signal<boolean>(false);
  statesIsOpen = signal<boolean>(false);

  yearRangeForm: FormGroup = new FormGroup({
    yearFrom: new FormControl(),
    yearTo: new FormControl()
  });
  orderByControl: FormControl<string> = new FormControl();

  constructor() {
    this.yearRangeForm.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(500)
    ).subscribe((value) => {
      this.yearRange.set({ yearFrom: value.yearFrom, yearTo: value.yearTo });
    });

    this.orderByControl.valueChanges.pipe(
      takeUntilDestroyed(),
    ).subscribe((value) => {
      this.orderBy.set(value);
    });
  }

  toggleSelection(value: string, selectedValues: WritableSignal<string[]>): void {
    (this.isSelected(value, selectedValues))
      ? selectedValues.update((values) => values.filter((val) => val !== value))
      : selectedValues.update((values) => [...values, value]);
  }

  isSelected(value: string, selectedValues: WritableSignal<string[]>): boolean {
    return selectedValues().includes(value);
  }

  openMenu(): void {
    this.isOpen.set(true);
  }

  closeMenu(event?: Event): void {
    if (event && this.filterMenu()?.nativeElement.contains(event.target)) {
      return;
    }

    this.isOpen.set(false);
  }

  toggleFilter(event: Event, filter: WritableSignal<boolean>): void {
    event.stopPropagation();
    filter.update((value) => !value);
  }
}
