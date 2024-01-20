import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralInfoService } from '@auth/services/general-info.service';
import { Observable, of, switchMap } from 'rxjs';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, TokenResult } from '@stripe/stripe-js';

import { environments } from '@env/environments';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { CompleteCarRegistrationService } from '../../services/complete-car-registration.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'payment-method-modal',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    ModalComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
    StripeCardComponent,
    StripeElementsDirective,
  ],
  templateUrl: './payment-method-modal.component.html',
  styleUrl: './payment-method-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodModalComponent {
  readonly #stripePublishableKey = environments.stripe.publishableKey;

  @Input() isOpen: WritableSignal<boolean> = signal(false);
  @Output() paymentMethodAdded: EventEmitter<void> = new EventEmitter();
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  #fb = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #completeCarRegistrationService = inject(CompleteCarRegistrationService);

  addPaymentMethodForm: FormGroup;
  paymentMethodId: FormControl = new FormControl(null, [Validators.required]);
  error: WritableSignal<string> = signal('');

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  stripe = injectStripe(this.#stripePublishableKey);

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
        },
        backgroundColor: '#f5f5f5',
        lineHeight: '50px',
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor() {
    this.addPaymentMethodForm = this.#fb.group({
      cardholderName: ['', [Validators.required]],
    });
  }

  addPaymentMethodFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    this.paymentMethodId.markAllAsTouched();
    const isValid = this.#validatorsService.isValidForm(this.addPaymentMethodForm!);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.createToken().
      pipe(
        switchMap((result) => {
          console.log({ token: result });
          if (!result.token) {
            this.isButtonSubmitDisabled.set(false);
            return of(result);
          }

          return this.#completeCarRegistrationService.addPaymentMethod(result.token.id);
        })
      ).subscribe({
        next: (result) => {
          console.log({ result });
          this.isOpen.set(false);
          this.paymentMethodAdded.emit();
        },
        error: (error: HttpErrorResponse) => {
          console.error({ error });
          this.error.set(error.error.errors[0].detail);
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    const name = 'test';
    return this.stripe
      .createToken(this.card.element, { name });
  }

  controlHasError(control: FormControl): boolean {
    return this.#validatorsService.controlHasError(control);
  }

  getErrorFromControl(control: FormControl): string | undefined {
    return this.#validatorsService.getErrorFromControl(control);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.addPaymentMethodForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.addPaymentMethodForm) return undefined;

    return this.#validatorsService.getError(this.addPaymentMethodForm, field);
  }
}
