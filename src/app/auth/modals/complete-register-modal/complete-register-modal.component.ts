import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';

import { CompleteRegisterComponent } from '@auth/pages/complete-register/complete-register.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'complete-register-modal',
  standalone: true,
  imports: [
    ModalComponent,
    CompleteRegisterComponent
  ],
  templateUrl: './complete-register-modal.component.html',
  styleUrl: './complete-register-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterModalComponent {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
}
