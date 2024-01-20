import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { AuctionTypes } from '@app/register-car/interfaces/auctionTypes';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';
import { PaymentMethodModalComponent } from '@app/register-car/modals/payment-method-modal/payment-method-modal.component';
import { PaymentMethod } from '@auth/interfaces/general-info';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor() {
    this.generalInformationForm = this.#fb.group({
      paymentMethodId: ['', [Validators.required]],
      auctionCarPublishId: [this.#route.snapshot.params['id'], [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAuctionTypes();
    this.getGeneralInfo();
  }

  generalInformationFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.generalInformationForm);

    console.log({ isValid });

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#completeCarRegistrationService.saveGeneralInformation$(this.generalInformationForm)
      .subscribe({
        next: (response) => {
          console.log({ response });
          this.#completeCarRegistrationService.indexCurrentStep.set(1);
        },
        error: (error) => {
          console.log(error);
        },
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  refreshPaymentMethods(): void {
    this.getGeneralInfo();
  }

  getGeneralInfo(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      console.log({ generalInfo: generalInfo });
      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);

      console.log({ paymentMethods: this.paymentMethods() });
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
