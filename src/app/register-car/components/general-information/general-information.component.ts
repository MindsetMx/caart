import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuctionTypes } from '@app/register-car/interfaces/auction-types.interface';
import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { ApplyDiscountCode } from '@app/register-car/interfaces';
import { AuctionTypes as AuctionTypes2 } from '@app/auctions/enums/auction-types';
import { PaymentMethodDeletionConfirmationModalComponent } from '@account/modals/payment-method-deletion-confirmation-modal/payment-method-deletion-confirmation-modal.component';
import { MatIcon } from '@angular/material/icon';
import { PaymentMethodsService } from '@shared/services/payment-methods.service';
import { AppService } from '@app/app.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'register-car-general-information',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    CurrencyPipe,
    SpinnerComponent,
    PaymentMethodModalComponent,
    TitleCasePipe,
    TertiaryButtonDirective,
    PaymentMethodDeletionConfirmationModalComponent,
    MatIcon,
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnInit {
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);
  #generalInfoService = inject(GeneralInfoService);
  #route = inject(ActivatedRoute);
  #paymentMethodsService = inject(PaymentMethodsService);
  #appService = inject(AppService);
  #destroyRef: DestroyRef = inject(DestroyRef);

  generalInformationForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  auctionTypes: WritableSignal<AuctionTypes> = signal({} as AuctionTypes);
  paymentMethodModalIsOpen: WritableSignal<boolean> = signal(false);
  paymentMethods: WritableSignal<PaymentMethod[]> = signal([] as PaymentMethod[]);
  applyDiscountCodeResponse: WritableSignal<ApplyDiscountCode> = signal({} as ApplyDiscountCode);
  auctionTypeIdSignal = signal<string | undefined>(undefined);

  deletePaymentMethodButtonIsDisabled = signal<boolean[]>([]);
  paymentMethodIdToDelete = signal<string>('');
  deletePaymentMethodIsOpen = signal<boolean>(false);
  deletePaymentMethodSubmitButtonIsDisabled = signal<boolean>(false);
  error = signal<string | undefined>(undefined);

  isValidDiscountCode: Signal<boolean | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.isValid;
  });

  discountCodeMessage: Signal<string | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.message;
  });

  get auctionTypeId(): FormControl {
    return this.generalInformationForm.get('auctionTypeId') as FormControl;
  }

  auctionTypeIdEffect = effect(() => {
    this.auctionTypeId.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
    ).subscribe((auctionTypeId) => {
      this.auctionTypeIdSignal.set(auctionTypeId);
    });
  });

  get hasToPay(): WritableSignal<boolean> {
    return this.applyDiscountCodeResponse().data && this.applyDiscountCodeResponse().data.length > 0
      ? signal(this.applyDiscountCodeResponse().data.find((discount) => discount.id === this.auctionTypeIdSignal())!.attributes.hasToPay)
      : signal(true);
  }

  constructor() {
    this.generalInformationForm = this.#fb.group({
      paymentMethodId: ['', [Validators.required]],
      auctionCarPublishId: [this.#route.snapshot.params['id'], [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: [''],
    });
  }

  asToPayEffect = effect(() => {
    if (this.hasToPay()) {
      this.generalInformationForm.get('paymentMethodId')?.setValidators([Validators.required]);
      this.generalInformationForm.get('paymentMethodId')?.updateValueAndValidity();
    } else {
      this.generalInformationForm.get('paymentMethodId')?.clearValidators();
      this.generalInformationForm.get('paymentMethodId')?.updateValueAndValidity();
    }
  });

  ngOnInit(): void {
    this.getAuctionTypes();
    this.getGeneralInfo();
  }

  openDeletePaymentMethodModal(paymentMethodId: string, index: number): void {
    this.deletePaymentMethodButtonIsDisabled.set(this.deletePaymentMethodButtonIsDisabled().map((_, i) => i === index));

    this.paymentMethodIdToDelete.set(paymentMethodId);
    this.deletePaymentMethodIsOpen.set(true);
  }

  generalInformationFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.generalInformationForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveGeneralInformation$(this.generalInformationForm)
      .subscribe({
        next: () => {
          this.#completeCarRegistrationService.indexTargetStep.set(1);
          this.#completeCarRegistrationService.indexCurrentStep.set(1);

          window.scrollTo(0, 0);
        },
        error: (error) => {
          console.error(error);
          this.error.set(error.error.message);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  applyDiscountCode(): void {
    this.#completeCarRegistrationService.applyDiscountCode$(this.generalInformationForm.value.discountCode)
      .subscribe({
        next: (response) => {
          this.applyDiscountCodeResponse.set(response);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  refreshPaymentMethods(): void {
    this.getGeneralInfo();
  }

  getGeneralInfo(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);
    });
  }

  getAuctionTypes(): void {
    this.#completeCarRegistrationService.getAuctionTypes$(AuctionTypes2.car).subscribe((auctionTypes) => {
      this.auctionTypes.set(auctionTypes);

      this.auctionTypeId?.setValue(auctionTypes.data[0].id);
    });
  }

  deletePaymentMethod(paymentMethodId: string): void {
    this.#paymentMethodsService.deletePaymentMethod$(paymentMethodId).subscribe({
      next: () => {
        // this.paymentMethods.update((paymentMethods) => {
        //   paymentMethods.data = paymentMethods.data.filter((paymentMethod) => paymentMethod.id !== paymentMethodId);

        //   return { ...paymentMethods };
        // });

        this.getGeneralInfo();

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

  hasError(form: FormGroup, field: string): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(form: FormGroup, field: string): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
