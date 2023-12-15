import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';
import { AuthService } from '@auth/services/auth.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    InputDirective,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    RouterModule,
    InputErrorComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  dropdownIsOpen: WritableSignal<boolean> = signal(false);
  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      country: ['', Validators.required],
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

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.authService.registerUser(this.registerForm).subscribe({
      next: () => {

      },
      error: (err) => {
        console.error(err);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  limpiarErroresDeValidacionSiElValorDelCampoCambia(): void {
    if (!this.registerForm)
      throw new Error('Register form is undefined');

    this.registerForm.valueChanges.subscribe(() => {
      this.registerForm?.markAllAsTouched();
    });
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
  }
}
