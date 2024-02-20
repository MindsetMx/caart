import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, input, signal } from '@angular/core';

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
  publicationId = input.required<string>();

  @Output() getHasGeneralInfo: EventEmitter<void> = new EventEmitter<void>();

  completeRegisterModalIsOpenChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);
    this.getHasGeneralInfo.emit();
  }
}
