import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, WritableSignal, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subscription, map, of, startWith } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AppService } from '@app/app.service';
import { AuthService } from '@auth/services/auth.service';
import { countries } from '@shared/countries';
import { idTypes } from '@auth/enums';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { onlyDigitsValidator } from '@shared/validations/onlyDigitsValidator';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { states } from '@shared/states';
import { TelephonePrefixes } from '@app/register-car/interfaces';
import { telephonePrefixes } from '@shared/telephone-prefixes';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    InputErrorComponent,
    SpinnerComponent,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnDestroy {
  @Output() registerModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() signInModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() mb: string = 'mb-32';

  #appService = inject(AppService);
  #authService = inject(AuthService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);

  countries: string[] = countries;
  states: string[] = states;
  filteredStates: Observable<string[]> = of(this.states);
  telephonePrefixes: TelephonePrefixes[] = telephonePrefixes;
  dropdownIsOpen: WritableSignal<boolean> = signal(false);
  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  previewImages: WritableSignal<string[]> = signal(['', '']);
  registerForm: FormGroup;
  showPassword1: WritableSignal<boolean> = signal(false);
  showPassword2: WritableSignal<boolean> = signal(false);
  userNameIsAvailable: WritableSignal<boolean> = signal(true);
  emailIsAvailable: WritableSignal<boolean> = signal(true);
  phoneNumberIsAvailable: WritableSignal<boolean> = signal(true);

  validationTypeSubscription?: Subscription;

  get idTypes(): typeof idTypes {
    return idTypes;
  }

  get validationType(): FormControl {
    return this.registerForm.get('validationType') as FormControl;
  }

  get countryControl(): FormControl {
    return this.registerForm.get('country') as FormControl;
  }

  get stateControl(): FormControl {
    return this.registerForm.get('state') as FormControl;
  }

  get usernameControl(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get phoneNumberControl(): FormControl {
    return this.registerForm.get('phoneNumber') as FormControl;
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
      prefix: ['+52', Validators.required],
      phoneNumber: ['', [onlyDigitsValidator(), Validators.minLength(10), Validators.maxLength(10), Validators.required]],
      state: ['', Validators.required],
      sellerType: ['', Validators.required],
      username: ['', Validators.required],
    }, {
      validators: [this.#validatorsService.samePasswords('password', 'password2')]
    });

    this.filteredStates = this.stateControl.valueChanges.pipe(
      takeUntilDestroyed(),
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.usernameControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.checkUsernameAvailability();
    });

    this.emailControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.checkEmailAvailability();
    });

    this.phoneNumberControl.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.checkPhoneNumberAvailability();
    });
  }

  ngOnDestroy(): void {
    if (this.validationTypeSubscription)
      this.validationTypeSubscription.unsubscribe();
  }

  register(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.registerForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#authService.registerUser$(this.registerForm).subscribe({
      next: () => {
        this.toastSuccess('Usuario registrado correctamente');

        const loginForm = this.#fb.group({
          login: [this.registerForm?.get('email')?.value, [Validators.required, Validators.email]],
          password: [this.registerForm?.get('password')?.value, Validators.required]
        });

        this.registerForm?.reset();

        this.login(loginForm);

        this.registerModalIsOpenChange.emit(false);
      },
      error: (err) => {
        console.error(err);
        // const fieldName = err.source;
        // const errorMessage = err.message;

        // if (this.registerForm) {
        //   this.#validatorsService.addServerErrorsToForm(this.registerForm, fieldName, errorMessage);
        // }
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
        console.error(error);
      }
    });
  }

  checkUsernameAvailability(): void {
    this.#authService.checkUsernameAvailability$(this.usernameControl.value).subscribe({
      next: (response) => {
        this.userNameIsAvailable.set(response.available);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  checkEmailAvailability(): void {
    this.#authService.checkEmailAvailability$(this.registerForm.get('email')?.value).subscribe({
      next: (response) => {
        this.emailIsAvailable.set(response.available);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  checkPhoneNumberAvailability(): void {
    const prefix = this.registerForm.get('prefix')?.value.replace('+', '%2B');

    this.#authService.checkPhoneNumberAvailability$(prefix + this.phoneNumberControl.value).subscribe({
      next: (response) => {
        this.phoneNumberIsAvailable.set(response.available);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.states.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  toggleShowPassword(showPassword: WritableSignal<boolean>): void {
    showPassword.update((value) => !value);
  }

  singInModalIsOpenChange(): void {
    this.registerModalIsOpenChange.emit(false);
    this.signInModalIsOpenChange.emit(true);
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
