import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'accept-last-chance-bid-modal',
  standalone: true,
  imports: [
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './accept-last-chance-bid-modal.component.html',
  styleUrl: './accept-last-chance-bid-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptLastChanceBidModalComponent {
  isOpen = model.required<boolean>();
  auctionId = input.required<string>();
  bidId = input.required<string>();
  aceptLastChanceBid = output<{ auctionId: string; bidId: string }>();

  isButtonSubmitDisabled = input.required<boolean>();

  acceptLastChanceBid(): void {
    this.aceptLastChanceBid.emit({ auctionId: this.auctionId(), bidId: this.bidId() });
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
