import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, WritableSignal, signal } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { InputDirective } from '@shared/directives';

@Component({
  selector: 'auction-filter-menu',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
  ],
  templateUrl: './auction-filter-menu.component.html',
  styleUrl: './auction-filter-menu.component.css',
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
export class AuctionFilterMenuComponent {
  @Input() isOpen = signal<boolean>(false);
  @Input({ required: true }) auctionTypeList!: string[];
  @Input({ required: true }) categoryList!: string[];
  @Input({ required: true }) currentOfferList!: string[];
  @Input({ required: true }) endsInList!: string[];
  @Input({ required: true }) eraList!: string[];
  @Input({ required: true }) orderByList!: string[];
  @Input({ required: true }) statesList!: string[];

  @ViewChild('filterMenu') filterMenu?: ElementRef;

  listingTypeIsOpen = signal<boolean>(false);
  categoryIsOpen = signal<boolean>(false);
  eraIsOpen = signal<boolean>(false);
  yearsRangeIsOpen = signal<boolean>(false);
  endsInIsOpen = signal<boolean>(false);
  currentOfferIsOpen = signal<boolean>(false);
  statesIsOpen = signal<boolean>(false);


  openMenu(): void {
    this.isOpen.set(true);
  }

  closeMenu(event?: Event): void {
    if (event && this.filterMenu?.nativeElement.contains(event.target)) {
      return;
    }

    this.isOpen.set(false);
  }

  toggleFilter(event: Event, filter: WritableSignal<boolean>): void {
    event.stopPropagation();
    filter.update((value) => !value);
  }
}
