import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { InputDirective } from '@shared/directives/input.directive';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    InputDirective,
    InputErrorComponent,
    PrimaryButtonDirective,
    ReactiveFormsModule,
    SpinnerComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @Output() signInModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() registerModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emailForPasswordResetModalIsOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() mt: string = 'mt-16';
  @Input() mb: string = 'mb-32';

  #authService = inject(AuthService);
  #router = inject(Router);
  #validatorsService = inject(ValidatorsService);
  #activatedRoute = inject(ActivatedRoute);

  isButtonSubmitDisabled = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  errorMessage = signal<string>('');

  get loginForm(): FormGroup {
    return this.#authService.loginForm;
  }

  login(): void {
    this.isButtonSubmitDisabled.set(true);

    const isValid = this.#validatorsService.isValidForm(this.loginForm);

    if (!isValid) {
      this.isButtonSubmitDisabled.set(false);
      return;
    }

    this.#authService.login$(this.loginForm).subscribe({
      next: () => {
        this.loginForm.reset();
        this.errorMessage.set('');

        if (this.#authService.currentUser()?.attributes?.accountVerified) {
          const returnUrl = this.#activatedRoute.snapshot.queryParams['returnUrl'];

          if (returnUrl) {
            this.#router.navigate([returnUrl]);
          } else {
            if (this.#router.url === '/iniciar-sesion') {
              this.#router.navigate(['/home']);
            }
          }
        } else {
          const originalReturnUrl = this.#activatedRoute.snapshot.queryParams['returnUrl'] || this.#router.url;

          this.#router.navigate(['/confirmacion'], {
            queryParams: {
              returnUrl: originalReturnUrl
            },
            replaceUrl: true
          });
        }

        this.signInModalIsOpenChange.emit(false);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set(error);
      }
    }).add(() => {
      this.isButtonSubmitDisabled.set(false);
    });
  }

  openRegisterModal(): void {
    this.signInModalIsOpenChange.emit(false);
    this.registerModalIsOpenChange.emit(true);
  }

  openEmailForPasswordResetModal(): void {
    this.signInModalIsOpenChange.emit(false);
    this.emailForPasswordResetModalIsOpenChange.emit(true);
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
    this.#authService.toggleShowPassword(this.passwordInput);
  }

  hasError(field: string): boolean {
    return this.#validatorsService.hasError(this.loginForm, field);
  }

  getError(field: string): string | undefined {
    if (!this.loginForm) return undefined;

    return this.#validatorsService.getError(this.loginForm, field);
  }
}
