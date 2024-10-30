import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'all-videos-deletion-confirmation-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './all-videos-deletion-confirmation-modal.component.html',
  styleUrl: './all-videos-deletion-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllVideosDeletionConfirmationModalComponent {
  isOpen = model.required<boolean>();
  deleteImageChange = output<void>();

  isButtonSubmitDisabled = input.required<boolean>();

  deleteImage(): void {
    this.deleteImageChange.emit();
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
