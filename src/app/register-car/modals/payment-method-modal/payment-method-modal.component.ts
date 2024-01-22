import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions, TokenResult } from '@stripe/stripe-js';

import { CompleteCarRegistrationService } from '@app/register-car/services/complete-car-registration.service';
import { environments } from '@env/environments';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

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
  error: WritableSignal<string> = signal('');

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);

  stripe = injectStripe(this.#stripePublishableKey);

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontWeight: '400',
        '::placeholder': {
          color: '#9da3af'
        },
      },
    },
    classes: {
      base: 'bg-gray1 py-4 max-h-[48px] px-4 rounded-lg',
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };

  constructor() {
    this.addPaymentMethodForm = this.#fb.group({
      cardholderName: ['', [Validators.required]],
      token: ['', [Validators.required]],
    });
  }

  addPaymentMethodFormSubmit() {
    this.isButtonSubmitDisabled.set(true);

    this.error.set('');
    this.addPaymentMethodForm.get('cardholderName')?.markAsTouched();

    this.createToken().
      pipe(
        switchMap((result) => {
          if (!result.token) {
            this.isButtonSubmitDisabled.set(false);
            this.addPaymentMethodForm.get('token')?.markAsTouched();
            return of();
          }

          console.log({ token: result.token.id });

          this.addPaymentMethodForm.get('token')?.setValue(result.token.id);

          const isValid = this.#validatorsService.isValidForm(this.addPaymentMethodForm!);

          if (!isValid) {
            this.isButtonSubmitDisabled.set(false);
            return of();
          }

          return this.#completeCarRegistrationService.addPaymentMethod(result.token.id);
        })
      ).subscribe({
        next: () => {
          this.isOpen.set(false);
          this.addPaymentMethodForm.reset();
          this.paymentMethodAdded.emit();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.addPaymentMethodForm.get('token')?.setValue('');
          this.error.set(error.error.errors[0].detail);
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    return this.stripe
      .createToken(this.card.element, { name: this.addPaymentMethodForm.get('cardholderName')?.value });
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
