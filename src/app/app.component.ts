import { AuthService } from '@auth/services/auth.service';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet, } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { AuthStatus } from '@auth/enums';
import { SignInComponent } from '@auth/components/sign-in/sign-in.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
    SignInComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'caart';

  #authService = inject(AuthService);
  #router = inject(Router);

  authStatusChangedEffect = effect(() => {
    switch (this.#authService.authStatus()) {
      case AuthStatus.authenticated:
        const url = localStorage.getItem('url');

        if (url) {
          this.#router.navigate([url]);
          localStorage.removeItem('url');
        }
        break;
    }
  });

  constructor() {
    this.#authService.checkAuthStatus$().subscribe();
  }
}
