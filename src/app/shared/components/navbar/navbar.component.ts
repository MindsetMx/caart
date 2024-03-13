import { ChangeDetectionStrategy, Component, Input, WritableSignal, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { DropdownLink } from '@shared/interfaces/DropdownLink';
import { SignInModalComponent } from '@auth/modals/sign-in-modal/sign-in-modal.component';
import { RegisterModalComponent } from '@auth/modals/register-modal/register-modal.component';
import { EmailForPasswordResetInputComponentModalComponent } from '@auth/modals/email-for-password-reset-input-component-modal/email-for-password-reset-input-component-modal.component';
import { UserData } from '@auth/interfaces';

@Component({
  selector: 'shared-navbar',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    DropdownComponent,
    RouterModule,
    SignInModalComponent,
    RegisterModalComponent,
    EmailForPasswordResetInputComponentModalComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() signInModalIsOpen: WritableSignal<boolean> = signal(false);
  @Input() registerModalIsOpen: WritableSignal<boolean> = signal(false);

  private authService = inject(AuthService);
  private router = inject(Router);

  menuIsOpen = signal<boolean>(false);
  categoriesDropdownIsOpen = signal<boolean>(false);
  userDropdownIsOpen = signal<boolean>(false);
  emailForPasswordResetModalIsOpen = signal(false);

  dropdownLinksCategories: DropdownLink[] = [
    {
      label: 'All',
      route: ['/products']
    },
    {
      label: 'Electronics',
      route: ['/products', 'electronics']
    },
    {
      label: 'Furniture',
      route: ['/products', 'furniture']
    },
    {
      label: 'Clothing',
      route: ['/products', 'clothing']
    },
  ];

  get user(): UserData | null {
    return this.authService.currentUser();
  }

  get authStatus() {
    return this.authService.authStatus;
  }

  get isAuthenticated(): boolean {
    return this.authStatus() === AuthStatus.authenticated;
  }

  get profileImage(): string {
    return 'https://ui-avatars.com/api/?name=' + this.user?.attributes.firstName + this.user?.attributes.lastName;
  }

  openSignInModal(): void {
    this.signInModalIsOpen.set(true);
  }

  logout() {
    this.authService.logout();
    this.userDropdownIsOpen.set(false);
    this.router.navigate(['/home']);
  }

  toggleMenu(): void {
    this.menuIsOpen.update((value) => !value);
  }

  toggleCategoriesDropdown(isOpen?: boolean): void {
    if (!isOpen) {
      this.categoriesDropdownIsOpen.update((value) => !value);
      return;
    }

    this.categoriesDropdownIsOpen.set(isOpen);
  }

  toggleUserDropdown(isOpen?: boolean): void {
    if (!isOpen) {
      this.userDropdownIsOpen.update((value) => !value);
      return;
    }

    this.userDropdownIsOpen.set(isOpen);
  }

  closeDropdown(element: WritableSignal<boolean>): void {
    element.set(false);
  }
}
