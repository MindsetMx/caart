import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppService } from '@app/app.service';

import { AuthService } from '@auth/services/auth.service';
import { InputErrorComponent } from '@shared/components/input-error/input-error.component';
import { InputDirective } from '@shared/directives/input.directive';
import { PrimaryButtonDirective } from '@shared/directives/primary-button.directive';
import { ValidatorsService } from '@shared/services/validators.service';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    InputDirective,
    RouterModule,
    PrimaryButtonDirective,
    InputErrorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  private appService = inject(AppService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validatorsService = inject(ValidatorsService);

  isButtonSubmitDisabled: WritableSignal<boolean> = signal(false);
  showPassword: WritableSignal<boolean> = signal(false);

  get loginForm(): FormGroup {
    return this.authService.loginForm;
  }

  login(): void {
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.toastSuccess('Has iniciado sesión correctamente');
        this.redirectToPreviousUrlIfExistOrHome();
        localStorage.removeItem('url');
      },
      error: (error) => {
        console.error({ error });
      }
    });
  }

  redirectToPreviousUrlIfExistOrHome(): void {
    const url = localStorage.getItem('url');

    url ? this.router.navigate([url]) : this.router.navigate(['/']);
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);
    this.authService.toggleShowPassword(this.passwordInput);
  }

  hasError(field: string): boolean {
    return this.validatorsService.hasError(this.loginForm, field);
  }

  getFieldError(field: string): string | undefined {
    if (!this.loginForm) return undefined;

    return this.validatorsService.getFieldError(this.loginForm, field);
  }

  toastSuccess(message: string): void {
    this.appService.toastSuccess(message);
  }
}
