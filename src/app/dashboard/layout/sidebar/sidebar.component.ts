import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, query, animateChild, group } from '@angular/animations';

import { AuthService } from '@auth/services/auth.service';
import { UserData } from '@auth/interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sidebar-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        group([
          query('@fadeInOut', animateChild()),
          style({ transform: 'translateX(-100%)' }),
          animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
        ])
      ]),
      transition(':leave', [
        group([
          query('@fadeInOut', animateChild()),
          animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' }))
        ])
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ],
})
export class SidebarComponent {
  @ViewChild('mobileSidebar') mobileSidebar?: ElementRef;

  #authService = inject(AuthService);

  sideBarIsOpen = signal<boolean>(false);

  get user(): UserData | null {
    return this.#authService.currentUser();
  }

  get profileImage(): string {
    return 'https://ui-avatars.com/api/?name=' + this.user?.attributes.firstName + ' ' + this.user?.attributes.lastName;
  }

  openSidebar(): void {
    this.sideBarIsOpen.set(true);
  }

  closeSidebar(event?: Event): void {
    if (event && this.mobileSidebar && this.mobileSidebar.nativeElement.contains(event.target)) {
      return;
    }

    this.sideBarIsOpen.set(false);
  }
}
