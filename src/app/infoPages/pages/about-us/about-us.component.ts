import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStatus } from '@auth/enums';
import { RegisterModalComponent } from '@auth/modals/register-modal/register-modal.component';
import { AuthService } from '@auth/services/auth.service';
import { PrimaryButtonDirective, TertiaryButtonDirective } from '@shared/directives';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    PrimaryButtonDirective,
    TertiaryButtonDirective,
    RouterLink,
    RegisterModalComponent
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  registerModalIsOpen = signal<boolean>(false);

  #authService = inject(AuthService);

  get authStatus(): Signal<AuthStatus> {
    return this.#authService.authStatus;
  }

  get isNotAuthenticated(): boolean {
    return this.authStatus() === AuthStatus.notAuthenticated;
  }

  openRegisterModal(): void {
    this.registerModalIsOpen.set(true);
  }
}
