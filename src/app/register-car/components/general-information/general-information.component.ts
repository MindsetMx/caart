import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

import { environments } from '@env/environments';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

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
  ],
  templateUrl: './general-information.component.html',
  styleUrl: './general-information.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInformationComponent {
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

  #validatorsService = inject(ValidatorsService);
  #fb = inject(FormBuilder);

  generalInformationForm: FormGroup;

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  constructor() {
    this.generalInformationForm = this.#fb.group({
      rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      paquete: ['', [Validators.required]],
      stripeToken: ['', [Validators.required]],
    });
  }

  generalInformationFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.generalInformationForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.generalInformationForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.generalInformationForm) return undefined;

    return this.#validatorsService.getError(this.generalInformationForm, field);
  }
}
