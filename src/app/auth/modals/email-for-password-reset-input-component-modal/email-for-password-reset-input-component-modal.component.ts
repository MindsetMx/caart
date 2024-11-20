import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AppService } from '@app/app.service';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PasswordResetService } from '@auth/services/password-reset.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'email-for-password-reset-input-component-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    SpinnerComponent,
    InputErrorComponent,
    InputDirective,
    PrimaryButtonDirective,
  ],
  templateUrl: './email-for-password-reset-input-component-modal.component.html',
  styleUrl: './email-for-password-reset-input-component-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailForPasswordResetInputComponentModalComponent {
  isOpen = model.required<boolean>();

  #validatorsService = inject(ValidatorsService);
  #formBuilder = inject(FormBuilder);
  #passwordResetService = inject(PasswordResetService);
  #appService = inject(AppService);

  resetPasswordButtonIsDisabled = signal<boolean>(false);
  errorMessage = signal<string>('');

  resetPasswordForm: FormGroup;

  constructor() {
    this.resetPasswordForm = this.#formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  resetPassword(): void {
    this.resetPasswordButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.resetPasswordForm);

    if (!isValid) {
      this.resetPasswordButtonIsDisabled.set(false);
      return;
    }

    this.#passwordResetService.requestPasswordReset$(this.resetPasswordForm.value.email).subscribe({
      next: () => {
        this.resetPasswordForm.reset();
        this.isOpen.set(false);

        this.toastSuccess('Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña');
      },
      error: (error) => {
        console.error('error', error);
        this.errorMessage.set(error.error.message);
      }
    }).add(() => {
      this.resetPasswordButtonIsDisabled.set(false);
    });
  }

  hasError(field: string, form: FormGroup = this.resetPasswordForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.resetPasswordForm): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }

  toastSuccess(message: string): void {
    this.#appService.toastSuccess(message);
  }
}
