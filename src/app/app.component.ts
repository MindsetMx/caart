import { AuthService } from '@auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { Router, RouterOutlet, } from '@angular/router';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { AuthStatus } from '@auth/enums';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent
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
    this.#authService.checkAuthStatus().subscribe();
  }
}
