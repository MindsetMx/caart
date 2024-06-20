import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'alert-modal',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css',
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
export class AlertModalComponent {
  modal = viewChild<ElementRef>('modal');
  // modalContent = viewChild<ElementRef>('modalContent');
  isOpen = input.required<boolean>();
  showIcon = input<boolean>(true);
  // isOpenChange = output<boolean>();
  // modalMaxWidth = input<string>('sm:max-w-xl');
  // verticalCenter = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isOpen() && this.modal()) {
        this.modal()?.nativeElement.focus({ preventScroll: true });
      }
    });
  }
}
