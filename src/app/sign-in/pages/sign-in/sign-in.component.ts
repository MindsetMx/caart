import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, WritableSignal, inject, signal } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { InputDirective } from '@shared/directives/input.directive';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    InputDirective
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  private authService = inject(AuthService);

  showPassword: WritableSignal<boolean> = signal(false);

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
    this.authService.toggleShowPassword(this.passwordInput);
  }
}
