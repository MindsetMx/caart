import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PaymentMethodDeletionConfirmationModalComponent } from '@app/account/modals/payment-method-deletion-confirmation-modal/payment-method-deletion-confirmation-modal.component';
import { AppService } from '@app/app.service';
import { PaymentMethods } from '@app/register-car/interfaces';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { StarComponent } from '@shared/components/icons/star/star.component';
import { TertiaryButtonDirective } from '@shared/directives';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';

@Component({
  selector: 'settings-account-payment-methods',
  standalone: true,
  imports: [
    TertiaryButtonDirective,
    TitleCasePipe,
    PaymentMethodModalComponent,
    StarComponent,
    MatIcon,
    PaymentMethodDeletionConfirmationModalComponent
  ],
  templateUrl: './settings-account-payment-methods.component.html',
  styleUrl: './settings-account-payment-methods.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountPaymentMethodsComponent {
  #paymentMethodsService = inject(PaymentMethodsService);
  #appService = inject(AppService);

  paymentMethods = signal<PaymentMethods>({} as PaymentMethods);
  paymentMethodModalIsOpen = signal<boolean>(false);
  deletePaymentMethodIsOpen = signal<boolean>(false);
  setPaymentMethodButtonIsDisabled = signal<boolean[]>([]);
  deletePaymentMethodButtonIsDisabled = signal<boolean[]>([]);
  paymentMethodIdToDelete = signal<string>('');
  deletePaymentMethodSubmitButtonIsDisabled = signal<boolean>(false);

  constructor() {
    this.getPaymentMethods();
  }

  openDeletePaymentMethodModal(paymentMethodId: string, index: number): void {
    this.deletePaymentMethodButtonIsDisabled.set(this.deletePaymentMethodButtonIsDisabled().map((_, i) => i === index));

    this.paymentMethodIdToDelete.set(paymentMethodId);
    this.deletePaymentMethodIsOpen.set(true);
  }

  deletePaymentMethod(paymentMethodId: string): void {
    this.#paymentMethodsService.deletePaymentMethod$(paymentMethodId).subscribe({
      next: () => {
        this.paymentMethods.update((paymentMethods) => {
          paymentMethods.data = paymentMethods.data.filter((paymentMethod) => paymentMethod.id !== paymentMethodId);

          return { ...paymentMethods };
        });

        this.toastSuccess('Método de pago eliminado correctamente.');
      },
      error: (error) => {
        console.error(error);

        this.toastError(error.error.message);
      }
    }).add(() => {
      this.deletePaymentMethodSubmitButtonIsDisabled.set(false);
      this.deletePaymentMethodIsOpen.set(false);
    });
  }

  getPaymentMethods(): void {
    this.#paymentMethodsService.getPaymentMethods$().subscribe((paymentMethods) => {
      this.paymentMethods.set(paymentMethods);
      this.setPaymentMethodButtonIsDisabled.set(paymentMethods.data.map(() => false));
    });
  }

  setDefaultPaymentMethod(paymentMethodId: string, index: number): void {
    this.setPaymentMethodButtonIsDisabled.set(this.setPaymentMethodButtonIsDisabled().map((_, i) => i === index));

    const previndex = this.paymentMethods().data.findIndex((paymentMethod) => paymentMethod.attributes.isDefault);

    this.paymentMethods.update((paymentMethods) => {
      paymentMethods.data.forEach((paymentMethod) => {
        paymentMethod.attributes.isDefault = paymentMethod.id === paymentMethodId;
      });

      return { ...paymentMethods };
    });

    this.#paymentMethodsService.setDefaultPaymentMethod$(paymentMethodId).subscribe({
      error: (error) => {
        console.error(error);

        this.paymentMethods.update((paymentMethods) => {
          paymentMethods.data.forEach((paymentMethod, i) => {
            paymentMethod.attributes.isDefault = i === previndex;
          });

          return { ...paymentMethods };
        });
      }
    }).add(() => {
      this.setPaymentMethodButtonIsDisabled.set(this.setPaymentMethodButtonIsDisabled().map((_, i) => i === index ? false : _));
    });
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
