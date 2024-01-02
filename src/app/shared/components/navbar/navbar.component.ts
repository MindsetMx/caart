import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { AuthStatus } from '@auth/enums';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { DropdownComponent } from '@shared/components/dropdown/dropdown.component';
import { DropdownLink } from '@shared/interfaces/DropdownLink';
import { Router, RouterModule } from '@angular/router';
import { SignInModalComponent } from '@auth/modals/sign-in-modal/sign-in-modal.component';

@Component({
  selector: 'shared-navbar',
  standalone: true,
  imports: [
    ClickOutsideDirective,
    DropdownComponent,
    RouterModule,
    SignInModalComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuIsOpen: WritableSignal<boolean> = signal(false);
  modalSignInIsOpen: WritableSignal<boolean> = signal(false);
  categoriesDropdownIsOpen: WritableSignal<boolean> = signal(false);
  userDropdownIsOpen: WritableSignal<boolean> = signal(false);

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

  get authStatus() {
    return this.authService.authStatus;
  }

  get isAuthenticated(): boolean {
    return this.authStatus() === AuthStatus.authenticated;
  }

  openSignInModal(): void {
    this.modalSignInIsOpen.set(true);
  }

  logout() {
    this.authService.logout();
    this.userDropdownIsOpen.set(false);
    this.router.navigate(['/']);
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
