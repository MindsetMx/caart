import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { AlertModalComponent } from '@shared/components/alert-modal/alert-modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'payment-method-deletion-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    AlertModalComponent,
    SpinnerComponent
  ],
  templateUrl: './payment-method-deletion-confirmation-modal.component.html',
  styleUrl: './payment-method-deletion-confirmation-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodDeletionConfirmationModalComponent {
  isOpen = model.required<boolean>();
  isButtonSubmitDisabled = model.required<boolean>();
  deletePaymentMethodChange = output<string>();
  paymentMethodId = input.required<string>();

  deletePaymentMethod(): void {
    this.isButtonSubmitDisabled.set(true);
    this.deletePaymentMethodChange.emit(this.paymentMethodId());
  }

  closeModal(): void {
    this.isOpen.set(false);
  }
}
