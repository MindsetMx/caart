import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'confirmation-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent {
  isOpen = model.required<boolean>();
  acceptChange = output<void>();

  isButtonSubmitDisabled = input.required<boolean>();

  confirmRelease(): void {
    this.acceptChange.emit();
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
