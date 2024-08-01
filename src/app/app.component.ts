import { AuthService } from '@auth/services/auth.service';
import { AfterViewInit, Component, OnDestroy, WritableSignal, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet, } from '@angular/router';
import { trigger, transition, query, animateChild } from '@angular/animations';

import { AuthStatus } from '@auth/enums';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SignInComponent } from '@auth/components/sign-in/sign-in.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';
import { environments } from '@env/environments';
import { UserData } from '@auth/interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
    SignInComponent,
    NotificationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('dumbAnimation', [
      transition('* => void', [
        query("@*", [animateChild()], { optional: true })
      ]),
    ]),
  ]
})
export class AppComponent implements OnDestroy, AfterViewInit {
  readonly #baseUrl = environments.baseUrl;

  title = 'caart';

  #authService = inject(AuthService);
  #router = inject(Router);

  signInModalIsOpen: WritableSignal<boolean> = signal(false);
  registerModalIsOpen: WritableSignal<boolean> = signal(false);

  eventSource?: EventSource;
  messages = signal<string[]>([]);

  authStatusChangedEffect = effect(() => {
    switch (this.#authService.authStatus()) {
      case AuthStatus.authenticated:
        this.eventSource = new EventSource(`${this.#baseUrl}/sse/subscribe/${this.user?.id}`);

        this.eventSource.onmessage = (event) => {
          if (JSON.parse(event.data).type !== 'INITIAL_CONNECTION') {
            this.messages.update((messages) => [...messages, JSON.parse(event.data).message]);
          }
        };
        break;

      case AuthStatus.notAuthenticated:
        if (this.eventSource) {
          this.eventSource.close();
        }
        break;
    }
  });

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  ngAfterViewInit(): void {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }

  removeMessage(): void {
    setTimeout(() => {
      this.messages.update((messages) => {
        messages.shift();
        return messages;
      });
    }, 5000);
  }

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
