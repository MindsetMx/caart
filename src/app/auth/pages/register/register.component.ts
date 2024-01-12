import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectStripe, StripeElementsDirective, StripeCardComponent } from 'ngx-stripe';
import { Observable, Subscription, of, switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { StripeElementsOptions, StripeCardElementOptions, TokenResult } from '@stripe/stripe-js';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { countries } from '@shared/countries';
import { environments } from '@env/environments';
import { idTypes } from '@auth/enums';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    InputErrorComponent,
    StripeElementsDirective,
    StripeCardComponent,
    SpinnerComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  readonly #stripePublishableKey = environments.stripe.publishableKey;

  #appService = inject(AppService);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  countries: string[] = countries;
  dropdownIsOpen: WritableSignal<boolean> = signal(false);
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImages: WritableSignal<string[]> = signal(['', '']);
  registerForm: FormGroup;

  validationTypeSubscription?: Subscription;

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

  get validationType(): FormControl {
    return this.registerForm.get('validationType') as FormControl;
  }

  constructor() {
    this.registerForm = this.#fb.group({
      acceptTermsAndConditions: [false, Validators.requiredTrue],
      city: ['', Validators.required],
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      state: ['', Validators.required],
      username: ['', Validators.required],
    }, {
      validators: [this.#validatorsService.samePasswords('password', 'password2')]
    });
  }

  register(): void {
    this.isButtonSubmitDisabled.set(true);

    if (!this.registerForm)
      throw new Error('Register form is undefined');

    this.createToken().pipe(
      switchMap((result) => {
        if (result.token) {
          this.registerForm?.get('stripeToken')?.setValue(result.token.id);
          this.registerForm?.get('stripeToken')?.setErrors(null);
        } else
          if (result.error && result.error.message) {
            this.#validatorsService.addServerErrorsToForm(this.registerForm, 'stripeToken', result.error.message);
            this.isButtonSubmitDisabled.set(false);
            return of();
          }

        const isValid = this.#validatorsService.isValidForm(this.registerForm);

        if (isValid)
          return this.#authService.registerUser$(this.registerForm);

        return of();
      })).subscribe({
        next: () => {
          this.toastSuccess('Usuario registrado correctamente');

          const loginForm = this.#fb.group({
            email: [this.registerForm?.get('email')?.value, [Validators.required, Validators.email]],
            password: [this.registerForm?.get('password')?.value, Validators.required]
          });

          this.registerForm?.reset();

          this.login(loginForm);
        },
        error: (err) => {
          console.error(err);
          const fieldName = err.source;
          const errorMessage = err.message;

          if (this.registerForm) {
            this.#validatorsService.addServerErrorsToForm(this.registerForm, fieldName, errorMessage);
          }
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });
  }

  login(loginForm: FormGroup): void {
    this.#authService.login$(loginForm).subscribe({
      next: () => {
        this.#router.navigate(['/confirmacion']);
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }

  setValidationType(type: idTypes): void {
    switch (type) {
      case idTypes.ine:
        this.registerForm?.setControl('validationImg', new FormArray([
          new FormControl(null, Validators.required),
          new FormControl(null, Validators.required),
        ]));

        break;
      case idTypes.pasaporte:
        this.registerForm?.setControl('validationImg', new FormArray([
          new FormControl(null, Validators.required),
        ]));

        break;
    }
  }

  addOptionalFieldsToRegisterForm(): void {
    this.registerForm?.addControl('postalCode', new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]));
    this.registerForm?.addControl('streetAndNumber', new FormControl('', Validators.required));
    this.registerForm?.addControl('stripeToken', new FormControl('', Validators.required));
    this.registerForm?.addControl('taxId', new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]));
    this.registerForm?.addControl('validationImg', new FormArray([
      new FormControl(null, Validators.required),
      new FormControl(null, Validators.required),
    ]));
    this.registerForm?.addControl('validationType', new FormControl(idTypes.ine, Validators.required));


    this.validationTypeSubscription = this.validationType.valueChanges.subscribe((value) => {
      this.setValidationType(value);
    });
  }

  removeOptionalFieldsFromRegisterForm(): void {
    this.registerForm?.removeControl('postalCode');
    this.registerForm?.removeControl('streetAndNumber');
    this.registerForm?.removeControl('stripeToken');
    this.registerForm?.removeControl('taxId');
    this.registerForm?.removeControl('validationImg');
    this.registerForm?.removeControl('validationType');

    if (this.validationTypeSubscription)
      this.validationTypeSubscription.unsubscribe();
  }

  get validationImgFormArray(): FormArray {
    return this.registerForm.get('validationImg') as FormArray;
  }

  selectFile(event: Event, indice: number): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files?.length) return;

    const file = inputElement.files[0];
    this.validationImgFormArray.at(indice).setValue(file);

    this.showPreview(file, indice);
  }

  showPreview(archivo: File, indice: number): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImages.set(
        this.previewImages().map((image, index) => {
          if (index === indice) return reader.result as string;
          return image;
        })
      );
    }
    reader.readAsDataURL(archivo);
  }

  // Replace with your own public key
  stripe = injectStripe(this.#stripePublishableKey);

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    const name = this.registerForm?.get('firstName')?.value + ' ' + this.registerForm?.get('lastName')?.value;
    return this.stripe
      .createToken(this.card.element, { name });
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.registerForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.registerForm) return undefined;

    return this.#validatorsService.getError(this.registerForm, field);
  }

  formArrayHasError(index: number): boolean {
    if (!this.registerForm) return false;

    return this.#validatorsService.formArrayHasError(this.validationImgFormArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    if (!this.registerForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(this.validationImgFormArray, index);
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
    this.#appService.toastSuccess(message);
  }
}
