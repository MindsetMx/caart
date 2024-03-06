import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { RegisterComponent } from '@auth/pages/register/register.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'register-modal',
  standalone: true,
  imports: [
    ModalComponent,
    RegisterComponent
  ],
  templateUrl: './register-modal.component.html',
  styleUrl: './register-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterModalComponent {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
  @Output() signInModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();


  emitSignInModalIsOpenChange(isOpen: boolean) {
    this.signInModalIsOpenChange.emit(isOpen);
  }

  isOpenChange(isOpen: boolean) {
    this.isOpen.set(isOpen);
  }
}
