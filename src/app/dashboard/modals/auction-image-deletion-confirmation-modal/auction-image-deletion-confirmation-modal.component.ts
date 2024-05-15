import { ChangeDetectionStrategy, Component, input, model, output, signal } from '@angular/core';
import { FormArray } from '@angular/forms';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'auction-image-deletion-confirmation-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './auction-image-deletion-confirmation-modal.component.html',
  styleUrl: './auction-image-deletion-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionImageDeletionConfirmationModalComponent {
  isOpen = model.required<boolean>();
  deleteImagesChange = output<void>();

  isButtonSubmitDisabled = input.required<boolean>();

  deleteImage(): void {
    this.deleteImagesChange.emit();
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
