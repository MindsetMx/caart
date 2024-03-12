import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordResetService } from '@auth/services/password-reset.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InputDirective, PrimaryButtonDirective } from '@shared/directives';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputErrorComponent,
    SpinnerComponent,
    InputDirective,
    PrimaryButtonDirective,
    MatIconModule
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  resetPasswordForm: FormGroup;

  resetPasswordButtonIsDisabled = signal<boolean>(false);
  showPassword1 = signal<boolean>(false);
  showPassword2 = signal<boolean>(false);
  token = signal<string>('');

  #formBuilder = inject(FormBuilder);
  #validatorsService = inject(ValidatorsService);
  #passwordResetService = inject(PasswordResetService);
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.token.set(this.#activatedRoute.snapshot.queryParamMap.get('token')!);

    this.resetPasswordForm = this.#formBuilder.group({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, {
      validators: [this.#validatorsService.samePasswords('newPassword', 'confirmPassword')],
    });
  }

  resetPassword(): void {
    this.resetPasswordButtonIsDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.resetPasswordForm);

    if (!isValid) {
      this.resetPasswordButtonIsDisabled.set(false);
      return;
    }

    this.#passwordResetService.resetPassword$(this.token(), this.resetPasswordForm.value.newPassword).subscribe({
      next: () => {
        this.#router.navigate(['/iniciar-sesion']);
      },
      error: (error) => {
        console.error('error', error);
      },
    });
  }

  toggleShowPassword(showPassword: WritableSignal<boolean>): void {
    showPassword.update((value) => !value);
  }

  hasError(field: string, form: FormGroup = this.resetPasswordForm): boolean {
    return this.#validatorsService.hasError(form, field);
  }

  getError(field: string, form: FormGroup = this.resetPasswordForm): string | undefined {
    if (!form) return undefined;

    return this.#validatorsService.getError(form, field);
  }
}
