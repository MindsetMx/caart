import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';
import { AppService } from '@app/app.service';
import { ChangePasswordService } from '@app/account/services/change-password.service';

@Component({
  selector: 'settings-account-password',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  templateUrl: './settings-account-password.component.html',
  styleUrl: './settings-account-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountPasswordComponent {
  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #appService = inject(AppService);
  #changePasswordService = inject(ChangePasswordService);

  changePasswordForm: FormGroup;

  changePasswordSubmitButtonIsDisabled = signal<boolean>(false);

  constructor() {
    this.changePasswordForm = this.#formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    }, {
      validators: [this.#validatorsService.samePasswords('newPassword', 'confirmNewPassword')],
    });
  }

  changePasswordSubmit(): void {
    this.changePasswordSubmitButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.changePasswordForm);

    if (!isValid) {
      this.changePasswordSubmitButtonIsDisabled.set(false);
      return;
    }

    this.#changePasswordService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.changePasswordForm.reset();
        this.toastSuccess('La contraseña se ha cambiado correctamente');
      },
      error: (error) => {
        console.error(error);
        this.toastError(error.error.message);
      },
    }).add(() => {
      this.changePasswordSubmitButtonIsDisabled.set(false);
    });
  }

  hasError(field: string, form: FormGroup = this.changePasswordForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.changePasswordForm): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }

  toastError(message: string): void {
    this.#appService.toastError(message);
  }
}
