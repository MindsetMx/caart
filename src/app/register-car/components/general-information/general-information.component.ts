import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    TertiaryButtonDirective
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

  generalInformationForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  auctionTypes: WritableSignal<AuctionTypes> = signal({} as AuctionTypes);
  paymentMethodModalIsOpen: WritableSignal<boolean> = signal(false);
  paymentMethods: WritableSignal<PaymentMethod[]> = signal([] as PaymentMethod[]);
  applyDiscountCodeResponse: WritableSignal<ApplyDiscountCode> = signal({} as ApplyDiscountCode);

  isValidDiscountCode: Signal<boolean | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.isValid;
  });

  discountCodeMessage: Signal<string | undefined> = computed(() => {
    if (!this.applyDiscountCodeResponse().discountInfo) return undefined;

    return this.applyDiscountCodeResponse().discountInfo.attributes.message;
  });

  constructor() {
    this.generalInformationForm = this.#fb.group({
      paymentMethodId: ['', [Validators.required]],
      auctionCarPublishId: [this.#route.snapshot.params['id'], [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: [''],
    });
  }

  ngOnInit(): void {
    this.getAuctionTypes();
    this.getGeneralInfo();
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
        },
        error: (error) => {
          console.error(error);
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
    this.#completeCarRegistrationService.getAuctionTypes$().subscribe((auctionTypes) => {
      this.auctionTypes.set(auctionTypes);
    });
  }

  hasError(form: FormGroup, field: string): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(form: FormGroup, field: string): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
}
