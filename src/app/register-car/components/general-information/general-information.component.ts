import { ChangeDetectionStrategy, Component, OnInit, ViewChild, WritableSignal, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, TokenResult } from '@stripe/stripe-js';

import { environments } from '@env/environments';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { GeneralInfoService } from '../../../auth/services/general-info.service';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { AuctionTypes } from '@app/register-car/interfaces/auctionTypes';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { PaymentMethod } from '../../../auth/interfaces/general-info';
import { TertiaryButtonDirective } from '@shared/directives/tertiary-button.directive';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'register-car-general-information',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    StripeCardComponent,
    StripeElementsDirective,
    CurrencyPipe,
    TitleCasePipe,
    TertiaryButtonDirective
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  readonly #stripePublishableKey = environments.stripe.publishableKey;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  stripe = injectStripe(this.#stripePublishableKey);

  #generalInfoService = inject(GeneralInfoService);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);
  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  generalInformationForm: FormGroup;
  addPaymentMethodForm?: FormGroup

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  isButtonSubmitDisabled2: WritableSignal<boolean> = signal(false);
  auctionTypes: WritableSignal<AuctionTypes> = signal({} as AuctionTypes);
  paymentMethods: WritableSignal<PaymentMethod[]> = signal([] as PaymentMethod[]);
  addPaymentMethod: WritableSignal<boolean> = signal(false);

  addPaymentMethodChangeEffect = effect(() => {
    if (this.addPaymentMethod()) {
      this.addPaymentMethodForm = this.#fb.group({
        cardholderName: ['', [Validators.required]],
      });

      console.log({ addPaymentMethodForm: this.addPaymentMethodForm.value });
    } else {
      this.addPaymentMethodForm = undefined;
    }
  });

  constructor() {
    this.generalInformationForm = this.#fb.group({
      taxId: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      paymentMethodId: ['', [Validators.required]],
      auctionCarPublishId: ['', [Validators.required]],
      auctionTypeId: ['', [Validators.required]],
      discountCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getGeneralInfo();
    this.getAuctionTypes();
  }

  generalInformationFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.generalInformationForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  addPaymentMethodFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.addPaymentMethodForm!);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    const name = 'test';
    return this.stripe
      .createToken(this.card.element, { name });
  }

  getAuctionTypes(): void {
    this.#completeCarRegistrationService.getAuctionTypes$().subscribe((auctionTypes) => {
      this.auctionTypes.set(auctionTypes);
    });
  }

  getGeneralInfo(): void {
    this.#generalInfoService.getGeneralInfo$().subscribe((generalInfo) => {
      this.generalInformationForm.patchValue({
        taxId: generalInfo.data.attributes.taxId,
      });

      this.paymentMethods.set(generalInfo.data.attributes.paymentMethods);

      console.log({ paymentMethods: this.paymentMethods() });
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
