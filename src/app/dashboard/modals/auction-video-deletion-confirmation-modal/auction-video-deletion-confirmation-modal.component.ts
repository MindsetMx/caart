import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'auction-video-deletion-confirmation-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './auction-video-deletion-confirmation-modal.component.html',
  styleUrl: './auction-video-deletion-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionVideoDeletionConfirmationModalComponent {
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
