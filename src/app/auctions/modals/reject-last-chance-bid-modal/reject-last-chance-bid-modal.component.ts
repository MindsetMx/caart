import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'reject-last-chance-bid-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './reject-last-chance-bid-modal.component.html',
  styleUrl: './reject-last-chance-bid-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RejectLastChanceBidModalComponent {
  isOpen = model.required<boolean>();
  auctionId = input.required<string>();
  bidId = input.required<string>();
  rejectLastChanceBid = output<{ auctionId: string; bidId: string }>();

  isButtonSubmitDisabled = input.required<boolean>();

  emitRejectLastChanceBid(): void {
    this.rejectLastChanceBid.emit({ auctionId: this.auctionId(), bidId: this.bidId() });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
