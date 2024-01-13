import { ChangeDetectionStrategy, Component, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';

import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { environments } from '@env/environments';
import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { ValidatorsService } from '@shared/services/validators.service';
import { StripeCardElementOptions, StripeElementsOptions, TokenResult } from '@stripe/stripe-js';
import { idTypes } from '@auth/enums';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-complete-register',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    InputErrorComponent,
    StripeElementsDirective,
    StripeCardComponent,
    SpinnerComponent
  ],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompleteRegisterComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  readonly #stripePublishableKey = environments.stripe.publishableKey;

  #appService = inject(AppService);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImages: WritableSignal<string[]> = signal(['', '']);
  completeRegisterForm: FormGroup;

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

  // Replace with your own public key
  stripe = injectStripe(this.#stripePublishableKey);

  constructor() {
    this.completeRegisterForm = this.#fb.group({
      taxId: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      stripeToken: ['', [Validators.required]],
      streetAndNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      validationType: [idTypes.ine, [Validators.required]],
      validationImg: this.#fb.array([
        ['', [Validators.required]],
        ['', [Validators.required]]
      ]),
    });
  }

  get idTypes(): typeof idTypes {
    return idTypes;
  }

  get validationType(): FormControl {
    return this.completeRegisterForm.get('validationType') as FormControl;
  }

  get validationImgFormArray(): FormArray {
    return this.completeRegisterForm.get('validationImg') as FormArray;
  }

  completeRegister(): void {
    this.isButtonSubmitDisabled.set(true);

    this.createToken().pipe(
      switchMap((result) => {
        if (result.token) {
          this.completeRegisterForm?.get('stripeToken')?.setValue(result.token.id);
          this.completeRegisterForm?.get('stripeToken')?.setErrors(null);
        } else
          if (result.error && result.error.message) {
            this.#validatorsService.addServerErrorsToForm(this.completeRegisterForm, 'stripeToken', result.error.message);
            this.isButtonSubmitDisabled.set(false);
            return of();
          }

        const isValid = this.#validatorsService.isValidForm(this.completeRegisterForm);

        if (isValid)
          return this.#authService.completeRegister$(this.completeRegisterForm);

        return of();
      })).subscribe({
        next: (response) => {
          console.log({ response });

          this.toastSuccess('Registro completado con éxito');

          this.completeRegisterForm.reset();

          this.redirectToPreviousUrlIfExistOrHome();
        },
        error: (error) => {
          console.error({ error });
        }
      }).add(() => {
        this.isButtonSubmitDisabled.set(false);
      });

    // const isValid = this.#validatorsService.isValidForm(this.completeRegisterForm);

    // if (!isValid) {
    //   this.isButtonSubmitDisabled.set(false);
    //   return;
    // }

    // this.#authService.completeRegister$(this.completeRegisterForm).subscribe({
    //   next: (response) => {
    //     console.log({ response });

    //     this.toastSuccess('Registro completado con éxito');

    //     this.completeRegisterForm.reset();
    //   },
    //   error: (error) => {
    //     console.error({ error });
    //   }
    // }).add(() => {
    //   this.isButtonSubmitDisabled.set(false);
    // });
  }

  redirectToPreviousUrlIfExistOrHome(): void {
    const url = localStorage.getItem('url');

    url ? this.#router.navigate([url]) : this.#router.navigate(['/']);
  }

  createToken(): Observable<TokenResult> {
    if (!this.card) return of({} as TokenResult);

    const name = this.completeRegisterForm?.get('firstName')?.value + ' ' + this.completeRegisterForm?.get('lastName')?.value;
    return this.stripe
      .createToken(this.card.element, { name });
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

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.completeRegisterForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getError(this.completeRegisterForm, field);
  }

  formArrayHasError(index: number): boolean {
    if (!this.completeRegisterForm) return false;

    return this.#validatorsService.formArrayHasError(this.validationImgFormArray, index);
  }

  getErrorFromFormArray(index: number): string | undefined {
    if (!this.completeRegisterForm) return undefined;

    return this.#validatorsService.getErrorFromFormArray(this.validationImgFormArray, index);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
