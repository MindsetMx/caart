import { AuthService } from '@auth/services/auth.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, WritableSignal, effect, inject, signal ,PLATFORM_ID} from '@angular/core';
import { Router, RouterOutlet, Scroll, Event } from '@angular/router';
import { trigger, transition, query, animateChild } from '@angular/animations';

import { AuthStatus } from '@auth/enums';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NavbarComponent } from '@shared/components/navbar/navbar.component';
import { SignInComponent } from '@auth/components/sign-in/sign-in.component';
import { NotificationComponent } from '@shared/components/notification/notification.component';
import { environments } from '@env/environments';
import { UserData } from '@auth/interfaces';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
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
  #viewportScroller = inject(ViewportScroller);

  signInModalIsOpen: WritableSignal<boolean> = signal(false);
  registerModalIsOpen: WritableSignal<boolean> = signal(false);

  eventSource?: EventSource;
  messages = signal<string[]>([]);

  platformId = inject(PLATFORM_ID);

  constructor() {
    if(isPlatformBrowser(this.platformId)){
    this.#router.events.pipe(filter((event: Event): event is Scroll => event instanceof Scroll)
    ).subscribe(e => {
      requestAnimationFrame(() => {
        if (e.position) {
          this.#viewportScroller.scrollToPosition(e.position);
        }
      });
    });
  }
  }

  authStatusChangedEffect = effect(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
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
    if (isPlatformBrowser(this.platformId)) {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      setTimeout(() => {
        loader.style.display = 'none';
      }, 1000);
    }
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

  isNotFoundRoute(): boolean {
    return this.#router.url === '/not-found';
  }

  openSignInModal(): void {
    this.signInModalIsOpen.set(true);
  }

  openRegisterModal(): void {
    this.registerModalIsOpen.set(true);
  }
}
