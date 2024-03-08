import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { SignInComponent } from '@auth/components/sign-in/sign-in.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'auth-sign-in-modal',
  standalone: true,
  imports: [
    ModalComponent,
    SignInComponent,
  ],
  templateUrl: './sign-in-modal.component.html',
  styleUrl: './sign-in-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInModalComponent {
  @Input() isOpen: WritableSignal<boolean> = signal(false);
  @Output() registerModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emailForPasswordResetModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  emitRegisterModalIsOpenChange(isOpen: boolean): void {
    this.registerModalIsOpenChange.emit(isOpen);
  }

  emitEmailForPasswordResetModalIsOpenChange(isOpen: boolean): void {
    this.emailForPasswordResetModalIsOpenChange.emit(isOpen);
  }

  isOpenChange(isOpen: boolean): void {
    this.isOpen.set(isOpen);
  }
}
