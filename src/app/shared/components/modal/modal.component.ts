import { animate, query, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, input, signal } from '@angular/core';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';

@Component({
  selector: 'shared-modal',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),

    trigger('scaleAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
})

export class ModalComponent {
  // @Input() isOpen: WritableSignal<boolean> = signal(false);
  isOpen = input.required<boolean>();
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() modalMaxWidth: string = 'sm:max-w-xl';
  @Input() verticalCenter: boolean = false;

  closeModal(): void {
    // this.isOpen.set(false);
    this.isOpenChange.emit(false);
  }
}
