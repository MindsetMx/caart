import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, effect, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppService } from '@app/app.service';
import { AuctionTypes } from '@auctions/enums';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { LastChancePurchaseService } from '@auctions/services/last-chance-purchase.service';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { LastChanceArtPurchaseService } from '@app/last-chance/services/last-chance-art-purchase.service';

@Component({
  selector: 'last-chance-buy-now-modal',
  standalone: true,
  imports: [
    ModalComponent,
    PrimaryButtonDirective,
    CommonModule,
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
  ],
  templateUrl: './last-chance-buy-now-modal.component.html',
  styleUrl: './last-chance-buy-now-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastChanceBuyNowModalComponent {
  isOpen = model<boolean>(false);

  auctionId = input.required<string>();
  auctionType = input.required<AuctionTypes>();
  comission = input.required<number>();
  name = input.required<string>();
  paymentMethodId = input.required<string>();
  reserveAmount = input.required<number>();

  isBuyButtonDisabled = signal<boolean>(false);
  serverError = signal<string | undefined>(undefined);

  #appService = inject(AppService);
  #lastChancePurchaseService = inject(LastChancePurchaseService);
  #lastChanceArtPurchaseService = inject(LastChanceArtPurchaseService);
  #validatorsService = inject(ValidatorsService);

  purchaseForm: FormGroup;

  paymentMethodIdEffect = effect(() => {
    this.paymentMethodIdControl.setValue(this.paymentMethodId());
  });

  reserveAmountEffect = effect(() => {
    this.reserveAmountControl.setValue(this.reserveAmount());
  });

  auctionIdEffect = effect(() => {
    this.auctionIdControl.setValue(this.auctionId());
  });

  constructor() {
    this.purchaseForm = new FormGroup({
      acceptTerms: new FormControl(false, Validators.requiredTrue),
      auctionId: new FormControl('', Validators.required),
      paymentMethodId: new FormControl('', Validators.required),
      reserveAmount: new FormControl('', Validators.required),
    });
  }

  get acceptTermsControl(): FormControl {
    return this.purchaseForm.get('acceptTerms') as FormControl;
  }

  get paymentMethodIdControl(): FormControl {
    return this.purchaseForm.get('paymentMethodId') as FormControl;
  }

  get reserveAmountControl(): FormControl {
    return this.purchaseForm.get('reserveAmount') as FormControl;
  }

  get auctionIdControl(): FormControl {
    return this.purchaseForm.get('auctionId') as FormControl;
  }

  buyNow(): void {
    this.isBuyButtonDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.purchaseForm);

    if (!isValid) {
      this.isBuyButtonDisabled.set(false);
      return;
    }

    switch (this.auctionType()) {
      case AuctionTypes.car:
        this.#lastChancePurchaseService.purchase$(this.purchaseForm).subscribe({
          next: () => {
            this.isOpen.set(false);
            this.toastSuccess(`¡Felicidades! Has comprado ${this.name()} exitosamente.`);
          },
          error: (error) => {
            this.serverError.set(error.error.message);
          },
        }).add(() => {
          this.isBuyButtonDisabled.set(false);
        });
        break;
      case AuctionTypes.art:
        this.#lastChanceArtPurchaseService.purchase$(this.purchaseForm).subscribe({
          next: () => {
            this.isOpen.set(false);
            this.toastSuccess(`¡Felicidades! Has comprado ${this.name()} exitosamente.`);
          },
          error: (error) => {
            this.serverError.set(error.error.message);
          },
        }).add(() => {
          this.isBuyButtonDisabled.set(false);
        });
        break;
      case AuctionTypes.memorabilia:

        break;
    }
  }

  controlHasError(control: AbstractControl): boolean {
    return this.#validatorsService.controlHasError(control as FormControl);
  }

  getFirstError(control: AbstractControl): string | undefined {
    return this.#validatorsService.getFirstErrorMessage(control as FormControl);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
