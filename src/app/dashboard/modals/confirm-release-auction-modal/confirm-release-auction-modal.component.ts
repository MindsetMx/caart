import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'confirm-release-auction-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './confirm-release-auction-modal.component.html',
  styleUrl: './confirm-release-auction-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmReleaseAuctionModalComponent {
  isOpen = model.required<boolean>();
  confirmReleaseChange = output<void>();

  isButtonSubmitDisabled = input.required<boolean>();

  confirmRelease(): void {
    this.confirmReleaseChange.emit();
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
