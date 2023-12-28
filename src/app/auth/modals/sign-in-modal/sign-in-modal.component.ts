import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';
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
}
