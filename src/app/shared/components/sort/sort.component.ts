import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';

@Component({
  selector: 'sort',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
  ],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('0.1s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.075s ease-in', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ]),
  ],
})
export class SortComponent {
  @Input({ required: true }) options: string[] = [];

  isOpen = signal<boolean>(false);

  toggleSort(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  closeSort(): void {
    this.isOpen.set(false);
  }
}
