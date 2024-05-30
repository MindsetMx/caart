import { ChangeDetectionStrategy, Component, ElementRef, input, model, output, viewChild } from '@angular/core';
import { AuctionPhotoSections } from '@dashboard/enums/auction-photo-sections.enum';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'all-photos-deletion-confirmation-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './all-photos-deletion-confirmation-modal.component.html',
  styleUrl: './all-photos-deletion-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllPhotosDeletionConfirmationModalComponent {
  isOpen = model.required<boolean>();
  deleteImageChange = output<AuctionPhotoSections>();
  auctionPhotoSection = input.required<AuctionPhotoSections>();

  isButtonSubmitDisabled = input.required<boolean>();

  deleteImage(): void {
    this.deleteImageChange.emit(this.auctionPhotoSection());
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
