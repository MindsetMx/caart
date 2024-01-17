import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';
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
}
