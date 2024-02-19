import { AuthService } from '@auth/services/auth.service';
import { Component, OnInit, WritableSignal, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet, } from '@angular/router';

import { AuthStatus } from '@auth/enums';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SignInComponent } from '@auth/components/sign-in/sign-in.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
    SignInComponent,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  eventSource?: EventSource;

  ngOnInit(): void {
    console.log('AppComponent initialized');
    const url = 'https://caart.com.mx/back/sse/subscribe/65aef82ff06bc0ed02b45d90';
    const eventSource = new EventSource(url);

    eventSource.onmessage = function (event) {
      console.log('Nuevo mensaje', event.data);
    };

    eventSource.onerror = function (error) {
      console.error('Error al recibir el evento', error);
    };
  }

  title = 'caart';

  #authService = inject(AuthService);
  #router = inject(Router);

  signInModalIsOpen: WritableSignal<boolean> = signal(false);
  registerModalIsOpen: WritableSignal<boolean> = signal(false);

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

  isDashboardRoute(): boolean {
    return this.#router.url.startsWith('/dashboard');
  }

  openSignInModal(): void {
    this.signInModalIsOpen.set(true);
  }

  openRegisterModal(): void {
    this.registerModalIsOpen.set(true);
  }
}
