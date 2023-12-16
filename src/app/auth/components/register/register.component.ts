import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectStripe, StripeElementsDirective, StripeCardComponent } from 'ngx-stripe';
import { Observable, of, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { StripeElementsOptions, StripeCardElementOptions, TokenResult } from '@stripe/stripe-js';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { countries } from '@shared/countries';
import { environments } from '../../../../environments/environments';
import { idTypes } from '@auth/enums/idTypes.enum';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    InputErrorComponent,
    StripeElementsDirective,
    StripeCardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  private readonly stripePublishableKey = environments.stripe.publishableKey;

  private appService = inject(AppService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);

  countries: string[] = countries;
  dropdownIsOpen: WritableSignal<boolean> = signal(false);
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  registerForm: FormGroup;
  selectedTypeOfValidation: FormControl = new FormControl('', Validators.required);

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

  get idTypes(): typeof idTypes {
    return idTypes;
  }

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      acceptTermsAndConditions: [false, Validators.requiredTrue],
    }, {
      validators: [this.validatorsService.samePasswords('password', 'password2')]
    });
  }

  register(): void {
    this.isButtonSubmitDisabled.set(true);

    if (!this.registerForm)
      throw new Error('Register form is undefined');


    const isValid = this.validatorsService.isValidForm(this.registerForm);

    this.createToken().pipe(
      switchMap((result) => {
        console.log({ result });
        if (result.token) {
          this.registerForm?.get('token')?.setValue(result.token.id);
          this.registerForm?.get('token')?.setErrors(null);
        } else
          if (result.error && result.error.message) {
            this.validatorsService.addServerErrorsToForm(this.registerForm, 'token', result.error.message);
            this.isButtonSubmitDisabled.set(false);
            return of();
          }

        if (isValid)
          return this.authService.registerUser(this.registerForm);

        return of();
      })).subscribe({
        next: () => {
          this.toastSuccess('Usuario registrado correctamente');
          this.registerForm?.reset();
          this.router.navigate(['/iniciar-sesion']);
        },
        error: (err) => {
          console.error(err);
          const fieldName = err.source;
          const errorMessage = err.message;

          if (this.registerForm) {
            this.validatorsService.addServerErrorsToForm(this.registerForm, fieldName, errorMessage);
          }
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  addOptionalFieldsToRegisterForm(): void {
    this.registerForm?.addControl('taxId', new FormControl('', Validators.required));
    this.registerForm?.addControl('clientId', new FormControl('', Validators.required));
    this.registerForm?.addControl('street', new FormControl('', Validators.required));
    this.registerForm?.addControl('internalNumber', new FormControl('', Validators.required));
    this.registerForm?.addControl('externalNumber', new FormControl('', Validators.required));
    this.registerForm?.addControl('postalCode', new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]));
    this.registerForm?.addControl('validationType', new FormControl(idTypes.ine, Validators.required));
    this.registerForm?.addControl('validationImg', new FormControl([], Validators.required));
    this.registerForm?.addControl('token', new FormControl('', Validators.required));
  }

  removeOptionalFieldsFromRegisterForm(): void {
    this.registerForm?.removeControl('taxId');
    this.registerForm?.removeControl('clientId');
    this.registerForm?.removeControl('street');
    this.registerForm?.removeControl('internalNumber');
    this.registerForm?.removeControl('externalNumber');
    this.registerForm?.removeControl('postalCode');
    this.registerForm?.removeControl('validationType');
    this.registerForm?.removeControl('validationImg');
    this.registerForm?.removeControl('token');
  }

  // Replace with your own public key
  stripe = injectStripe(this.stripePublishableKey);

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    const name = this.registerForm?.get('firstName')?.value + ' ' + this.registerForm?.get('lastName')?.value;
    return this.stripe
      .createToken(this.card.element, { name });
  }

  hasError(field: string): boolean {
    return this.validatorsService.hasError(this.registerForm, field);
  }

  getFieldError(field: string): string | undefined {
    if (!this.registerForm) return undefined;

    return this.validatorsService.getFieldError(this.registerForm, field);
  }

  toggleDropdown(): void {
    this.dropdownIsOpen.update((value) => !value);

    if (!this.registerForm) return;

    if (this.dropdownIsOpen()) {
      this.addOptionalFieldsToRegisterForm();
    } else {
      this.removeOptionalFieldsFromRegisterForm();
    }
  }

  toastSuccess(message: string): void {
    this.appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.appService.toastError(message);
  }
}
